// Canvas rendering engine for the Brat Generator Pro application

class CanvasRenderer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.state = null;
    this.animationFrame = null;
    
    // Performance optimization
    this.lastRenderHash = null;
    
    // Bind methods
    this.render = this.render.bind(this);
    this.debouncedRender = Utils.debounce(this.render, 16);
  }

  /**
   * Set the current state for rendering
   * @param {Object} state - Application state
   */
  setState(state) {
    this.state = state;
    this.scheduleRender();
  }

  /**
   * Schedule a render on the next animation frame
   */
  scheduleRender() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.animationFrame = requestAnimationFrame(this.debouncedRender);
  }

  /**
   * Main render function
   */
  render() {
    if (!this.state) return;

    // Set canvas size
    this.setCanvasSize(this.state.canvasWidth, this.state.canvasHeight);
    
    // Clear canvas
    this.clearCanvas();
    
    // Draw background
    this.drawBackground();
    
    // Draw image overlay if enabled
    this.drawImageOverlay();
    
    // Draw text with effects
    this.drawText();
    
    // Update canvas border radius
    this.updateCanvasBorderRadius();
  }

  /**
   * Generate a hash of the current state for performance optimization
   * @param {Object} state - Application state
   * @returns {string} State hash
   */
  getStateHash(state) {
    const relevantState = {
      text: state.text,
      backgroundColor: state.backgroundColor,
      bgType: state.bgType,
      gradientKey: state.gradientKey,
      textColor: state.textColor,
      fontKey: state.fontKey,
      fontSize: state.fontSize,
      padding: state.padding,
      letterSpacing: state.letterSpacing,
      rotation: state.rotation,
      canvasWidth: state.canvasWidth,
      canvasHeight: state.canvasHeight,
      align: state.align,
      blur: state.blur,
      shadow: state.shadow,
      mirror: state.mirror,
      effect: state.effect,
      imageOverlay: state.imageOverlay,
      outline: state.outline
    };
    
    return JSON.stringify(relevantState);
  }

  /**
   * Set canvas dimensions
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   */
  setCanvasSize(width, height) {
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      
      // Update CSS size for proper display
      const maxSize = Math.min(window.innerWidth * 0.8, window.innerHeight * 0.7, 600);
      const aspectRatio = width / height;
      
      if (aspectRatio > 1) {
        this.canvas.style.width = maxSize + 'px';
        this.canvas.style.height = (maxSize / aspectRatio) + 'px';
      } else {
        this.canvas.style.width = (maxSize * aspectRatio) + 'px';
        this.canvas.style.height = maxSize + 'px';
      }
    }
  }

  /**
   * Update canvas size (public method for external use)
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   */
  updateCanvasSize(width, height) {
    this.setCanvasSize(width, height);
    // Force a re-render after size change
    this.scheduleRender();
  }

  /**
   * Clear the canvas
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draw the background
   */
  drawBackground() {
    const { bgType, backgroundColor, gradientKey } = this.state;
    
    if (bgType === 'gradient' && gradientKey) {
      // Draw gradient background
      const gradient = PresetUtils.createCanvasGradient(
        this.ctx, 
        gradientKey, 
        this.canvas.width, 
        this.canvas.height
      );
      
      if (gradient) {
        this.ctx.fillStyle = gradient;
      } else {
        this.ctx.fillStyle = backgroundColor;
      }
    } else {
      // Draw solid background
      this.ctx.fillStyle = backgroundColor;
    }
    
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draw the text with all effects
   */
  drawText() {
    const text = this.state.text;
    if (!text) return;

    // Save context state
    this.ctx.save();
    
    // Setup text properties
    this.setupTextStyle();
    
    // Calculate text position
    const { x, y } = this.calculateTextPosition(text);
    
    // Apply rotation
    if (this.state.rotation !== 0) {
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.rotate((this.state.rotation * Math.PI) / 180);
      this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
    }
    
    // Apply blur effect
    if (this.state.blur.enabled && this.state.blur.amount > 0) {
      this.ctx.filter = `blur(${this.state.blur.amount}px)`;
    }
    
    // Apply special effects
    this.applySpecialEffect();
    
    // Apply text shadow
    this.applyTextShadow();
    
    // Draw mirror effects first (behind main text)
    this.drawMirrorEffect(text, x, y);
    
    // Draw main text
    this.drawMainText(text, x, y);
    
    // Restore context state
    this.ctx.restore();
  }

  /**
   * Setup text styling properties
   */
  setupTextStyle() {
    const { fontKey, fontSize, textColor, letterSpacing } = this.state;
    
    // Set font
    const fontFamily = PresetUtils.getFontFamily(fontKey);
    this.ctx.font = `bold ${fontSize}px ${fontFamily}`;
    this.ctx.fillStyle = textColor;
    this.ctx.textBaseline = 'middle';
    
    // Set letter spacing if supported
    if ('letterSpacing' in this.ctx) {
      this.ctx.letterSpacing = `${letterSpacing}px`;
    }
  }

  /**
   * Calculate text position based on alignment
   * @param {string} text - Text to position
   * @returns {Object} X and Y coordinates
   */
  calculateTextPosition(text) {
    const { align, padding } = this.state;
    const canvasWidth = this.canvas.width;
    const canvasHeight = this.canvas.height;
    
    let x, y;
    
    // Calculate Y position (always centered vertically)
    y = canvasHeight / 2;
    
    // Calculate X position based on alignment
    switch (align) {
      case 'left':
        this.ctx.textAlign = 'left';
        x = padding;
        break;
      case 'right':
        this.ctx.textAlign = 'right';
        x = canvasWidth - padding;
        break;
      case 'center':
      default:
        this.ctx.textAlign = 'center';
        x = canvasWidth / 2;
        break;
    }
    
    return { x, y };
  }

  /**
   * Wrap text to fit within canvas width
   * @param {string} text - Text to wrap
   * @param {number} maxWidth - Maximum width for text
   * @returns {Array} Array of text lines
   */
  wrapText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const testWidth = this.ctx.measureText(testLine).width;
      
      if (testWidth > maxWidth && currentLine !== '') {
        // Current line is full, push it and start new line with current word
        lines.push(currentLine);
        
        // Check if the word itself is too long
        if (this.ctx.measureText(word).width > maxWidth) {
          // Break the word into characters
          let wordLine = '';
          for (let char of word) {
            const testChar = wordLine + char;
            if (this.ctx.measureText(testChar).width > maxWidth && wordLine !== '') {
              lines.push(wordLine);
              wordLine = char;
            } else {
              wordLine = testChar;
            }
          }
          currentLine = wordLine;
        } else {
          currentLine = word;
        }
      } else if (testWidth > maxWidth && currentLine === '') {
        // First word is too long, break it into characters
        let wordLine = '';
        for (let char of word) {
          const testChar = wordLine + char;
          if (this.ctx.measureText(testChar).width > maxWidth && wordLine !== '') {
            lines.push(wordLine);
            wordLine = char;
          } else {
            wordLine = testChar;
          }
        }
        currentLine = wordLine;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    // If no lines were created, return the original text as a single line
    return lines.length > 0 ? lines : [text];
  }

  /**
   * Apply special effects to text
   */
  applySpecialEffect() {
    const effect = PresetUtils.getEffect(this.state.effect);
    
    if (effect.fillStyle) {
      // For gradient fills, we need to create a gradient
      if (effect.fillStyle.includes('linear-gradient')) {
        const gradientColors = this.extractGradientColors(effect.fillStyle);
        if (gradientColors.length > 0) {
          const gradient = this.ctx.createLinearGradient(0, 0, 0, this.state.fontSize);
          gradientColors.forEach((color, index) => {
            gradient.addColorStop(index / (gradientColors.length - 1), color);
          });
          this.ctx.fillStyle = gradient;
        }
      } else {
        this.ctx.fillStyle = effect.fillStyle;
      }
    }
    
    // Apply CSS filters if supported
    if (effect.filter) {
      this.ctx.filter = (this.ctx.filter || '') + ' ' + effect.filter;
    }
  }

  /**
   * Extract colors from gradient string
   * @param {string} gradientString - CSS gradient string
   * @returns {Array} Array of color strings
   */
  extractGradientColors(gradientString) {
    // Simple regex to extract colors from gradient
    const colorRegex = /#[a-fA-F0-9]{6}|rgba?\([^)]+\)/g;
    return gradientString.match(colorRegex) || [];
  }

  /**
   * Apply text shadow effect
   */
  applyTextShadow() {
    const { shadow, effect } = this.state;
    
    // Use shadow from special effect if available
    const effectShadow = PresetUtils.getEffect(effect);
    
    if (shadow.enabled || effectShadow.shadowBlur > 0) {
      const shadowColor = shadow.enabled ? shadow.color : effectShadow.shadowColor;
      const shadowBlur = shadow.enabled ? shadow.blur : effectShadow.shadowBlur;
      const shadowX = shadow.enabled ? shadow.x : effectShadow.shadowOffsetX;
      const shadowY = shadow.enabled ? shadow.y : effectShadow.shadowOffsetY;
      const shadowOpacity = shadow.enabled ? shadow.opacity : 1;
      
      // Apply shadow with opacity
      if (shadowColor) {
        const rgb = Utils.hexToRgb(shadowColor);
        if (rgb) {
          this.ctx.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shadowOpacity})`;
        } else {
          this.ctx.shadowColor = shadowColor;
        }
      }
      
      this.ctx.shadowBlur = shadowBlur;
      this.ctx.shadowOffsetX = shadowX;
      this.ctx.shadowOffsetY = shadowY;
    }
  }

  /**
   * Draw mirror effects
   * @param {string} text - Text to mirror
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  drawMirrorEffect(text, x, y) {
    const { mirror, padding } = this.state;
    if (mirror === 'none') return;

    this.ctx.save();
    
    // Calculate wrapped lines for mirror effect
    const maxWidth = this.canvas.width - (padding * 2);
    const lines = this.wrapText(text, maxWidth);
    const lineHeight = this.state.fontSize * 1.2;
    const totalHeight = lineHeight * lines.length;
    const startY = y - (totalHeight / 2) + (lineHeight / 2);
    
    switch (mirror) {
      case 'center':
        this.drawCenterMirror(lines, x, startY, lineHeight);
        break;
      case 'left':
        this.drawLeftMirror(lines, x, startY, lineHeight);
        break;
      case 'right':
        this.drawRightMirror(lines, x, startY, lineHeight);
        break;
      case 'wide':
        this.drawWideMirror(lines, x, startY, lineHeight);
        break;
      case 'full':
        this.drawFullMirror(lines, x, startY, lineHeight);
        break;
    }
    
    this.ctx.restore();
  }

  /**
   * Draw center mirror effect
   * @param {Array} lines - Lines of text to mirror
   * @param {number} x - X coordinate
   * @param {number} startY - Starting Y coordinate
   * @param {number} lineHeight - Height between lines
   */
  drawCenterMirror(lines, x, startY, lineHeight) {
    this.ctx.globalAlpha = 0.3;
    this.ctx.scale(-1, 1);
    let currentY = startY;
    lines.forEach(line => {
      this.ctx.fillText(line, -x - 10, currentY);
      currentY += lineHeight;
    });
    this.ctx.scale(-1, 1); // Reset scale
  }

  /**
   * Draw left mirror effect
   * @param {Array} lines - Lines of text to mirror
   * @param {number} x - X coordinate
   * @param {number} startY - Starting Y coordinate
   * @param {number} lineHeight - Height between lines
   */
  drawLeftMirror(lines, x, startY, lineHeight) {
    const clipX = this.canvas.width / 2;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(0, 0, clipX, this.canvas.height);
    this.ctx.clip();
    
    this.ctx.globalAlpha = 0.4;
    this.ctx.scale(-1, 1);
    let currentY = startY;
    lines.forEach(line => {
      this.ctx.fillText(line, -x, currentY);
      currentY += lineHeight;
    });
    this.ctx.restore();
  }

  /**
   * Draw right mirror effect
   * @param {Array} lines - Lines of text to mirror
   * @param {number} x - X coordinate
   * @param {number} startY - Starting Y coordinate
   * @param {number} lineHeight - Height between lines
   */
  drawRightMirror(lines, x, startY, lineHeight) {
    const clipX = this.canvas.width / 2;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(clipX, 0, clipX, this.canvas.height);
    this.ctx.clip();
    
    this.ctx.globalAlpha = 0.4;
    this.ctx.scale(-1, 1);
    let currentY = startY;
    lines.forEach(line => {
      this.ctx.fillText(line, -x, currentY);
      currentY += lineHeight;
    });
    this.ctx.restore();
  }

  /**
   * Draw wide mirror effect
   * @param {Array} lines - Lines of text to mirror
   * @param {number} x - X coordinate
   * @param {number} startY - Starting Y coordinate
   * @param {number} lineHeight - Height between lines
   */
  drawWideMirror(lines, x, startY, lineHeight) {
    this.ctx.globalAlpha = 0.2;
    this.ctx.scale(-1, 1);
    let currentY = startY;
    lines.forEach(line => {
      this.ctx.fillText(line, -x - 50, currentY);
      currentY += lineHeight;
    });
    this.ctx.scale(-1, 1); // Reset scale
  }

  /**
   * Draw full mirror effect (reflection)
   * @param {Array} lines - Lines of text to mirror
   * @param {number} x - X coordinate
   * @param {number} startY - Starting Y coordinate
   * @param {number} lineHeight - Height between lines
   */
  drawFullMirror(lines, x, startY, lineHeight) {
    const totalHeight = lineHeight * lines.length;
    const mirrorY = startY + totalHeight;
    
    this.ctx.save();
    this.ctx.scale(1, -1);
    this.ctx.globalAlpha = 0.3;
    
    // Create gradient mask for fade effect
    const gradient = this.ctx.createLinearGradient(0, -mirrorY, 0, -mirrorY - totalHeight);
    gradient.addColorStop(0, 'rgba(0,0,0,0.3)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    this.ctx.fillStyle = gradient;
    
    let currentY = mirrorY;
    lines.forEach(line => {
      this.ctx.fillText(line, x, -currentY);
      currentY += lineHeight;
    });
    this.ctx.restore();
  }

  /**
   * Draw the main text with outline if specified
   * @param {string} text - Text to draw
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  drawMainText(text, x, y) {
    const { outline, padding } = this.state;
    const outlineStyle = PresetUtils.getOutlineStyle(outline.type);
    
    // Calculate max width for text wrapping
    const maxWidth = this.canvas.width - (padding * 2);
    const lines = this.wrapText(text, maxWidth);
    
    // Calculate line height and starting Y position
    const lineHeight = this.state.fontSize * 1.2;
    const totalHeight = lineHeight * lines.length;
    let currentY = y - (totalHeight / 2) + (lineHeight / 2);
    
    // Draw each line
    lines.forEach((line) => {
      // Draw outline if specified
      if (outlineStyle.width > 0) {
        this.ctx.save();
        this.ctx.strokeStyle = outline.color;
        this.ctx.lineWidth = outlineStyle.width;
        this.ctx.lineJoin = 'round';
        
        if (outlineStyle.style === 'dashed') {
          this.ctx.setLineDash([5, 5]);
        }
        
        // For double outline, draw multiple strokes
        if (outlineStyle.style === 'double') {
          this.ctx.lineWidth = 1;
          this.ctx.strokeText(line, x, currentY);
          this.ctx.lineWidth = 3;
          this.ctx.strokeText(line, x, currentY);
        } else {
          this.ctx.strokeText(line, x, currentY);
        }
        
        this.ctx.restore();
      }
      
      // Draw main text line
      this.ctx.fillText(line, x, currentY);
      currentY += lineHeight;
    });
  }

  /**
   * Update canvas border radius styling
   */
  updateCanvasBorderRadius() {
    this.canvas.style.borderRadius = `${this.state.borderRadius}px`;
  }

  /**
   * Export canvas as data URL
   * @param {string} format - Export format ('png', 'jpg', 'webp')
   * @param {number} quality - Export quality (0-1)
   * @returns {string} Data URL
   */
  exportAsDataURL(format = 'png', quality = 1) {
    const mimeType = `image/${format === 'jpg' ? 'jpeg' : format}`;
    return this.canvas.toDataURL(mimeType, quality);
  }

  /**
   * Export canvas with specific dimensions
   * @param {number} width - Export width
   * @param {number} height - Export height
   * @param {string} format - Export format
   * @param {number} quality - Export quality
   * @returns {string} Data URL
   */
  exportWithSize(width, height, format = 'png', quality = 1) {
    // Create temporary canvas for export
    const exportCanvas = document.createElement('canvas');
    const exportCtx = exportCanvas.getContext('2d');
    
    exportCanvas.width = width;
    exportCanvas.height = height;
    
    // Scale and draw current canvas to export canvas
    exportCtx.drawImage(this.canvas, 0, 0, width, height);
    
    const mimeType = `image/${format === 'jpg' ? 'jpeg' : format}`;
    return exportCanvas.toDataURL(mimeType, quality);
  }

  /**
   * Get canvas as blob
   * @param {string} format - Export format
   * @param {number} quality - Export quality
   * @returns {Promise<Blob>} Canvas blob
   */
  getBlob(format = 'png', quality = 1) {
    return new Promise((resolve) => {
      const mimeType = `image/${format === 'jpg' ? 'jpeg' : format}`;
      this.canvas.toBlob(resolve, mimeType, quality);
    });
  }

  /**
   * Get thumbnail data URL
   * @param {number} size - Thumbnail size (default 100)
   * @returns {string} Thumbnail data URL
   */
  getThumbnail(size = 100) {
    return this.exportWithSize(size, size, 'png', 0.8);
  }

  /**
   * Draw image overlay if enabled
   */
  drawImageOverlay() {
    if (!this.state.imageOverlay?.enabled) return;
    
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const overlaySize = Math.min(this.canvas.width, this.canvas.height) * 0.4;
    
    this.ctx.save();
    this.ctx.globalAlpha = 0.8;
    
    // Use cached image or load it
    if (!this.overlayImage) {
      this.overlayImage = new Image();
      this.overlayImage.crossOrigin = 'anonymous';
      this.overlayImage.onload = () => {
        // Re-render when image loads
        this.scheduleRender();
      };
      this.overlayImage.src = './overlay-image.png';
    }
    
    // Draw the image if it's loaded - fit to whole canvas
    if (this.overlayImage.complete && this.overlayImage.naturalWidth > 0) {
      // Draw the image to fit the entire canvas
      this.ctx.drawImage(this.overlayImage, 0, 0, this.canvas.width, this.canvas.height);
    }
    
    this.ctx.restore();
  }

  /**
   * Destroy the renderer and clean up resources
   */
  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.canvas = null;
    this.ctx = null;
    this.state = null;
    this.listeners.clear();
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CanvasRenderer;
}
