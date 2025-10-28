// Export functionality for the Brat Generator Pro application

class ExportManager {
  constructor(renderer, state) {
    this.renderer = renderer;
    this.state = state;
    this.isExporting = false;
    
  }

  /**
   * Download image in the specified format using current canvas dimensions
   * @param {string} format - Export format ("png", "jpg", "webp", "pdf")
   * @param {string} filename - Optional custom filename
   */
  async downloadImage(format, filename = null) {
    if (this.isExporting) {
      throw new Error('Export already in progress');
    }

    this.isExporting = true;

    try {
      // Get export dimensions from the state directly  
      const state = this.state ? this.state.getState() : null;
      console.log('Retrieved state:', state);
      
      const size = state ? 
        { width: state.customExportWidth, height: state.customExportHeight } :
        { width: 500, height: 500 }; // fallback
      
      // Debug log to verify dimensions
      console.log('Export dimensions:', size);
      if (state) {
        console.log('Export size from state:', state.customExportWidth, state.customExportHeight);
      }
      
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
      const defaultFilename = `brat-${timestamp}`;
      const finalFilename = filename || defaultFilename;

      let dataUrl;

      if (format === 'jpg' || format === 'webp') {
        // Use better conversion for JPG/WEBP formats
        dataUrl = await this.generateImageWithFormat(size.width, size.height, format);
      } else {
        // Generate standard PNG
        dataUrl = await this.generateImage(size.width, size.height, format);
      }

      // Download the file
      Utils.downloadFile(dataUrl, `${finalFilename}.${format}`);

    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    } finally {
      this.isExporting = false;
    }
  }

  /**
   * Generate image data URL for export
   * @param {number} width - Export width
   * @param {number} height - Export height
   * @param {string} format - Image format
   * @param {number} quality - Export quality (0-1)
   * @returns {Promise<string>} Data URL
   */
  async generateImage(width, height, format, quality = 0.95) {
    // Create export canvas with exact dimensions (no pixel ratio scaling)
    const exportCanvas = document.createElement('canvas');
    const exportCtx = exportCanvas.getContext('2d', { alpha: format === 'png' });

    // Set exact canvas size as requested
    exportCanvas.width = width;
    exportCanvas.height = height;
    
    // Debug log to verify canvas dimensions
    console.log('Export canvas created:', exportCanvas.width, 'x', exportCanvas.height);

    // Set canvas display size
    exportCanvas.style.width = width + 'px';
    exportCanvas.style.height = height + 'px';

    // For JPG format, fill white background first
    if (format === 'jpg' || format === 'jpeg') {
      exportCtx.fillStyle = '#FFFFFF';
      exportCtx.fillRect(0, 0, width, height);
    }

    // Render the current canvas content to export canvas
    await this.renderToCanvas(exportCtx, width, height);

    // Convert to data URL with proper format and quality
    const mimeType = this.getMimeType(format);
    const adjustedQuality = format === 'png' ? 1 : quality;
    return exportCanvas.toDataURL(mimeType, adjustedQuality);
  }



  /**
   * Render current design to a canvas context
   * @param {CanvasRenderingContext2D} ctx - Target canvas context
   * @param {number} width - Target width
   * @param {number} height - Target height
   */
  async renderToCanvas(ctx, width, height) {
    // Save current context state
    ctx.save();

    // Get current state
    const state = this.renderer.state;
    if (!state) {
      throw new Error('No state available for export');
    }

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Render at exact size without scaling - use the requested width/height directly
    this.drawBackgroundToContext(ctx, state, width, height);

    // Draw image overlay if enabled
    await this.drawImageOverlayToContext(ctx, state, width, height);

    // Draw text with effects at exact size
    this.drawTextToContext(ctx, state, width, height);

    // Restore context
    ctx.restore();
  }

  /**
   * Draw background to context
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Object} state - Application state
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   */
  drawBackgroundToContext(ctx, state, width, height) {
    if (state.bgType === 'gradient' && state.gradientKey) {
      const gradient = PresetUtils.createCanvasGradient(ctx, state.gradientKey, width, height);
      ctx.fillStyle = gradient || state.backgroundColor;
    } else {
      ctx.fillStyle = state.backgroundColor;
    }
    
    ctx.fillRect(0, 0, width, height);
  }

  /**
   * Draw image overlay to context
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Object} state - Application state
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   */
  async drawImageOverlayToContext(ctx, state, width, height) {
    if (!state.imageOverlay?.enabled) return;
    
    ctx.save();
    ctx.globalAlpha = 0.8;
    
    // Create and load the overlay image
    return new Promise((resolve) => {
      const overlayImage = new Image();
      overlayImage.crossOrigin = 'anonymous';
      overlayImage.onload = () => {
        // Draw the image to fit the entire canvas
        ctx.drawImage(overlayImage, 0, 0, width, height);
        ctx.restore();
        resolve();
      };
      overlayImage.onerror = () => {
        ctx.restore();
        resolve(); // Continue even if image fails to load
      };
      overlayImage.src = './overlay-image.png';
    });
  }

  /**
   * Draw text to context
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Object} state - Application state
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   */
  drawTextToContext(ctx, state, width, height) {
    const text = state.text;
    if (!text) return;

    ctx.save();

    // Setup text properties
    const fontFamily = PresetUtils.getFontFamily(state.fontKey);
    ctx.font = `bold ${state.fontSize}px ${fontFamily}`;
    ctx.fillStyle = state.textColor;
    ctx.textBaseline = 'middle';

    // Set letter spacing if supported
    if ('letterSpacing' in ctx) {
      ctx.letterSpacing = `${state.letterSpacing}px`;
    }

    // Calculate text position
    const { x, y } = this.calculateTextPosition(ctx, text, state, width, height);

    // Apply rotation
    if (state.rotation !== 0) {
      ctx.translate(width / 2, height / 2);
      ctx.rotate((state.rotation * Math.PI) / 180);
      ctx.translate(-width / 2, -height / 2);
    }

    // Apply blur effect
    if (state.blur.enabled && state.blur.amount > 0) {
      ctx.filter = `blur(${state.blur.amount}px)`;
    }

    // Apply special effects
    this.applySpecialEffectToContext(ctx, state);

    // Apply text shadow
    this.applyTextShadowToContext(ctx, state);

    // Draw mirror effects
    this.drawMirrorEffectToContext(ctx, text, x, y, state, width, height);

    // Draw outline if specified
    this.drawTextOutlineToContext(ctx, text, x, y, state);

    // Draw main text
    ctx.fillText(text, x, y);

    ctx.restore();
  }

  /**
   * Calculate text position for export
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} text - Text to position
   * @param {Object} state - Application state
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   * @returns {Object} X and Y coordinates
   */
  calculateTextPosition(ctx, text, state, width, height) {
    let x, y;
    
    y = height / 2;
    
    switch (state.align) {
      case 'left':
        ctx.textAlign = 'left';
        x = state.padding;
        break;
      case 'right':
        ctx.textAlign = 'right';
        x = width - state.padding;
        break;
      case 'center':
      default:
        ctx.textAlign = 'center';
        x = width / 2;
        break;
    }
    
    return { x, y };
  }

  /**
   * Apply special effects to context
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Object} state - Application state
   */
  applySpecialEffectToContext(ctx, state) {
    const effect = PresetUtils.getEffect(state.effect);
    
    if (effect.fillStyle && effect.fillStyle.includes('linear-gradient')) {
      const gradientColors = this.extractGradientColors(effect.fillStyle);
      if (gradientColors.length > 0) {
        const gradient = ctx.createLinearGradient(0, 0, 0, state.fontSize);
        gradientColors.forEach((color, index) => {
          gradient.addColorStop(index / (gradientColors.length - 1), color);
        });
        ctx.fillStyle = gradient;
      }
    } else if (effect.fillStyle) {
      ctx.fillStyle = effect.fillStyle;
    }

    if (effect.filter) {
      ctx.filter = (ctx.filter || '') + ' ' + effect.filter;
    }
  }

  /**
   * Apply text shadow to context
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {Object} state - Application state
   */
  applyTextShadowToContext(ctx, state) {
    const { shadow, effect } = state;
    const effectShadow = PresetUtils.getEffect(effect);
    
    if (shadow.enabled || effectShadow.shadowBlur > 0) {
      const shadowColor = shadow.enabled ? shadow.color : effectShadow.shadowColor;
      const shadowBlur = shadow.enabled ? shadow.blur : effectShadow.shadowBlur;
      const shadowX = shadow.enabled ? shadow.x : effectShadow.shadowOffsetX;
      const shadowY = shadow.enabled ? shadow.y : effectShadow.shadowOffsetY;
      const shadowOpacity = shadow.enabled ? shadow.opacity : 1;
      
      if (shadowColor) {
        const rgb = Utils.hexToRgb(shadowColor);
        if (rgb) {
          ctx.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shadowOpacity})`;
        } else {
          ctx.shadowColor = shadowColor;
        }
      }
      
      ctx.shadowBlur = shadowBlur;
      ctx.shadowOffsetX = shadowX;
      ctx.shadowOffsetY = shadowY;
    }
  }

  /**
   * Draw mirror effects to context
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} text - Text to mirror
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {Object} state - Application state
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   */
  drawMirrorEffectToContext(ctx, text, x, y, state, width, height) {
    if (state.mirror === 'none') return;

    ctx.save();
    
    switch (state.mirror) {
      case 'center':
        ctx.globalAlpha = 0.3;
        ctx.scale(-1, 1);
        ctx.fillText(text, -x - 10, y);
        break;
      case 'left':
        const clipX = width / 2;
        ctx.beginPath();
        ctx.rect(0, 0, clipX, height);
        ctx.clip();
        ctx.globalAlpha = 0.4;
        ctx.scale(-1, 1);
        ctx.fillText(text, -x, y);
        break;
      case 'right':
        const clipX2 = width / 2;
        ctx.beginPath();
        ctx.rect(clipX2, 0, clipX2, height);
        ctx.clip();
        ctx.globalAlpha = 0.4;
        ctx.scale(-1, 1);
        ctx.fillText(text, -x, y);
        break;
      case 'wide':
        ctx.globalAlpha = 0.2;
        ctx.scale(-1, 1);
        ctx.fillText(text, -x - 50, y);
        break;
      case 'full':
        const mirrorY = y + state.fontSize;
        ctx.scale(1, -1);
        ctx.globalAlpha = 0.3;
        const gradient = ctx.createLinearGradient(0, -mirrorY, 0, -mirrorY - state.fontSize);
        gradient.addColorStop(0, 'rgba(0,0,0,0.3)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.fillText(text, x, -mirrorY);
        break;
    }
    
    ctx.restore();
  }

  /**
   * Draw text outline to context
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} text - Text to outline
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {Object} state - Application state
   */
  drawTextOutlineToContext(ctx, text, x, y, state) {
    const outlineStyle = PresetUtils.getOutlineStyle(state.outline.type);
    
    if (outlineStyle.width > 0) {
      ctx.save();
      ctx.strokeStyle = state.outline.color;
      ctx.lineWidth = outlineStyle.width;
      ctx.lineJoin = 'round';
      
      if (outlineStyle.style === 'dashed') {
        ctx.setLineDash([5, 5]);
      }
      
      if (outlineStyle.style === 'double') {
        ctx.lineWidth = 1;
        ctx.strokeText(text, x, y);
        ctx.lineWidth = 3;
        ctx.strokeText(text, x, y);
      } else {
        ctx.strokeText(text, x, y);
      }
      
      ctx.restore();
    }
  }

  /**
   * Extract colors from gradient string
   * @param {string} gradientString - CSS gradient string
   * @returns {Array} Array of color strings
   */
  extractGradientColors(gradientString) {
    const colorRegex = /#[a-fA-F0-9]{6}|rgba?\([^)]+\)/g;
    return gradientString.match(colorRegex) || [];
  }


  /**
   * Generate image with better format conversion
   * @param {number} width - Export width
   * @param {number} height - Export height
   * @param {string} format - Target format
   * @returns {Promise<string>} Data URL
   */
  async generateImageWithFormat(width, height, format) {
    // First generate PNG
    const pngDataUrl = await this.generateImage(width, height, 'png');
    
    // Convert using browser canvas API for better compatibility
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          ctx.drawImage(img, 0, 0);
          const quality = format === 'jpg' ? 0.9 : 0.8;
          const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/webp';
          resolve(canvas.toDataURL(mimeType, quality));
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = reject;
      img.src = pngDataUrl;
    });
  }

  /**
   * Get MIME type for format
   * @param {string} format - Export format
   * @returns {string} MIME type
   */
  getMimeType(format) {
    const mimeTypes = {
      png: 'image/png',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      webp: 'image/webp'
    };
    
    return mimeTypes[format.toLowerCase()] || 'image/png';
  }

  /**
   * Get blob from data URL
   * @param {string} dataUrl - Data URL
   * @returns {Blob} Blob object
   */
  dataURLToBlob(dataUrl) {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while(n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new Blob([u8arr], { type: mime });
  }

  /**
   * Estimate file size for export
   * @param {string} sizeKey - Export size key
   * @param {string} format - Export format
   * @returns {string} Estimated file size
   */
  estimateFileSize(sizeKey, format) {
    const size = PresetUtils.getExportSize(sizeKey);
    const pixels = size.width * size.height;
    
    let bytesPerPixel;
    switch (format) {
      case 'png':
        bytesPerPixel = 4; // RGBA
        break;
      case 'jpg':
      case 'jpeg':
        bytesPerPixel = 1; // Compressed
        break;
      case 'webp':
        bytesPerPixel = 0.8; // More compressed
        break;
      default:
        bytesPerPixel = 2;
    }
    
    const estimatedBytes = pixels * bytesPerPixel;
    return Utils.formatFileSize(estimatedBytes);
  }

  /**
   * Check if format is supported
   * @param {string} format - Format to check
   * @returns {boolean} Support status
   */
  isFormatSupported(format) {
    const supportedFormats = ['png', 'jpg', 'jpeg', 'webp'];
    return supportedFormats.includes(format.toLowerCase());
  }

  /**
   * Get export progress (for future use with large exports)
   * @returns {number} Progress percentage (0-100)
   */
  getExportProgress() {
    return this.isExporting ? 50 : 100;
  }

  /**
   * Cancel export (for future use)
   */
  cancelExport() {
    this.isExporting = false;
  }

  /**
   * Cleanup and destroy the export manager
   */
  destroy() {
    this.renderer = null;
    this.isExporting = false;
  }
}


// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ExportManager;
}
