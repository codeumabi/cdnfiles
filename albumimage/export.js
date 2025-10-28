// Export functionality for Album Cover Generator

// Debounce utility function for better performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Create debounced resize function for better performance
const debouncedResizeCanvas = debounce((width, height) => {
    resizeCanvas(width, height);
}, 300);

function initExport() {
    // Desktop export buttons
    const downloadBtnDesktop = document.getElementById('downloadBtnDesktop');
    const copyImageBtnDesktop = document.getElementById('copyImageBtnDesktop');
    const resetBtnDesktop = document.getElementById('resetBtnDesktop');
    
    // Mobile export buttons
    const downloadBtn = document.getElementById('downloadBtn');
    const copyImageBtn = document.getElementById('copyImageBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    // Mobile buttons
    const downloadBtnMobile = document.getElementById('downloadBtnMobile');
    const copyImageBtnMobile = document.getElementById('copyImageBtnMobile');
    const resetBtnMobile = document.getElementById('resetBtnMobile');
    
    // Export size controls
    const exportSizePresetDesktop = document.getElementById('exportSizePresetDesktop');
    const exportSizePreset = document.getElementById('exportSizePreset');
    const exportSizePresetMobile = document.getElementById('exportSizePresetMobile');
    const customExportWidthDesktop = document.getElementById('customExportWidthDesktop');
    const customExportHeightDesktop = document.getElementById('customExportHeightDesktop');
    const customExportWidth = document.getElementById('customExportWidth');
    const customExportHeight = document.getElementById('customExportHeight');
    const customExportWidthMobile = document.getElementById('customExportWidthMobile');
    const customExportHeightMobile = document.getElementById('customExportHeightMobile');
    const exportFormatSelectDesktop = document.getElementById('exportFormatSelectDesktop');
    const exportFormatSelect = document.getElementById('exportFormatSelect');
    const exportFormatSelectMobile = document.getElementById('exportFormatSelectMobile');
    
    // Custom size groups
    const customExportSizeGroupDesktop = document.getElementById('customExportSizeGroupDesktop');
    const customExportSizeGroup = document.getElementById('customExportSizeGroup');
    
    // Event listeners for desktop
    if (downloadBtnDesktop) {
        downloadBtnDesktop.addEventListener('click', handleDownload);
    }
    if (copyImageBtnDesktop) {
        copyImageBtnDesktop.addEventListener('click', handleCopyImage);
    }
    if (resetBtnDesktop) {
        resetBtnDesktop.addEventListener('click', handleReset);
    }
    
    // Event listeners for mobile
    if (downloadBtn) {
        downloadBtn.addEventListener('click', handleDownload);
    }
    if (copyImageBtn) {
        copyImageBtn.addEventListener('click', handleCopyImage);
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', handleReset);
    }
    
    // Event listeners for additional mobile buttons
    if (downloadBtnMobile) {
        downloadBtnMobile.addEventListener('click', handleDownload);
    }
    if (copyImageBtnMobile) {
        copyImageBtnMobile.addEventListener('click', handleCopyImage);
    }
    if (resetBtnMobile) {
        resetBtnMobile.addEventListener('click', handleReset);
    }
    
    // Export size preset handlers
    if (exportSizePresetDesktop) {
        exportSizePresetDesktop.addEventListener('change', (e) => {
            handleExportSizeChange(e.target.value, true);
        });
    }
    if (exportSizePreset) {
        exportSizePreset.addEventListener('change', (e) => {
            handleExportSizeChange(e.target.value, false);
        });
    }
    if (exportSizePresetMobile) {
        exportSizePresetMobile.addEventListener('change', (e) => {
            handleExportSizeChange(e.target.value, false);
        });
    }
    
    // Custom size input handlers with debounced live preview for better performance
    if (customExportWidthDesktop) {
        customExportWidthDesktop.addEventListener('input', (e) => {
            albumState.exportWidth = parseInt(e.target.value) || 500;
            // Update live preview with debouncing
            debouncedResizeCanvas(albumState.exportWidth, albumState.exportHeight);
        });
    }
    if (customExportHeightDesktop) {
        customExportHeightDesktop.addEventListener('input', (e) => {
            albumState.exportHeight = parseInt(e.target.value) || 500;
            // Update live preview with debouncing
            debouncedResizeCanvas(albumState.exportWidth, albumState.exportHeight);
        });
    }
    if (customExportWidth) {
        customExportWidth.addEventListener('input', (e) => {
            albumState.exportWidth = parseInt(e.target.value) || 500;
            // Update live preview with debouncing
            debouncedResizeCanvas(albumState.exportWidth, albumState.exportHeight);
        });
    }
    if (customExportHeight) {
        customExportHeight.addEventListener('input', (e) => {
            albumState.exportHeight = parseInt(e.target.value) || 500;
            // Update live preview with debouncing
            debouncedResizeCanvas(albumState.exportWidth, albumState.exportHeight);
        });
    }
    
    // Mobile custom size input handlers (CRITICAL: these were missing!)
    if (customExportWidthMobile) {
        customExportWidthMobile.addEventListener('input', (e) => {
            albumState.exportWidth = parseInt(e.target.value) || 500;
            // Update live preview with debouncing
            debouncedResizeCanvas(albumState.exportWidth, albumState.exportHeight);
        });
    }
    if (customExportHeightMobile) {
        customExportHeightMobile.addEventListener('input', (e) => {
            albumState.exportHeight = parseInt(e.target.value) || 500;
            // Update live preview with debouncing
            debouncedResizeCanvas(albumState.exportWidth, albumState.exportHeight);
        });
    }
    
    // Format selection handlers
    if (exportFormatSelectDesktop) {
        exportFormatSelectDesktop.addEventListener('change', (e) => {
            albumState.exportFormat = e.target.value;
        });
    }
    if (exportFormatSelect) {
        exportFormatSelect.addEventListener('change', (e) => {
            albumState.exportFormat = e.target.value;
        });
    }
    
    // Initially hide custom size groups
    if (customExportSizeGroupDesktop) {
        customExportSizeGroupDesktop.style.display = 'none';
    }
    if (customExportSizeGroup) {
        customExportSizeGroup.style.display = 'none';
    }
}

function handleExportSizeChange(preset, isDesktop) {
    const customSizeGroup = isDesktop ? 
        document.getElementById('customExportSizeGroupDesktop') : 
        document.getElementById('customExportSizeGroup');
    
    const widthInput = isDesktop ? 
        document.getElementById('customExportWidthDesktop') : 
        document.getElementById('customExportWidth');
    
    const heightInput = isDesktop ? 
        document.getElementById('customExportHeightDesktop') : 
        document.getElementById('customExportHeight');
    
    if (preset === 'custom') {
        customSizeGroup.style.display = 'block';
        albumState.exportWidth = parseInt(widthInput.value) || 500;
        albumState.exportHeight = parseInt(heightInput.value) || 500;
    } else {
        customSizeGroup.style.display = 'none';
        const [width, height] = preset.split('x').map(Number);
        albumState.exportWidth = width;
        albumState.exportHeight = height;
        
        // Update input values
        widthInput.value = width;
        heightInput.value = height;
    }
    
    // Update canvas preview to show the export size
    resizeCanvas(albumState.exportWidth, albumState.exportHeight);
}

function handleDownload() {
    const exportCanvas = createExportCanvas();
    const filename = `album-cover-${Date.now()}.${albumState.exportFormat}`;
    downloadCanvas(exportCanvas, filename, albumState.exportFormat);
}

async function handleCopyImage() {
    const exportCanvas = createExportCanvas();
    const success = await copyCanvasToClipboard(exportCanvas);
    
    if (success) {
    } else {
    }
}

function handleReset() {
    if (confirm('Are you sure you want to reset all settings? This will clear your uploaded image and all customizations.')) {
        resetState();
        resetUI();
        drawCanvas();
    }
}

function createExportCanvas() {
    const exportCanvas = document.createElement('canvas');
    const exportCtx = exportCanvas.getContext('2d');
    
    exportCanvas.width = albumState.exportWidth;
    exportCanvas.height = albumState.exportHeight;
    
    // Save current canvas state
    const originalWidth = albumState.canvasWidth;
    const originalHeight = albumState.canvasHeight;
    
    // Temporarily update state for export size
    albumState.canvasWidth = albumState.exportWidth;
    albumState.canvasHeight = albumState.exportHeight;
    
    // Render to export canvas
    const tempCanvas = canvas;
    const tempCtx = ctx;
    
    // Set global canvas and context to export canvas
    canvas = exportCanvas;
    ctx = exportCtx;
    
    // Draw the image at export resolution
    drawCanvas();
    
    // Restore original canvas and context
    canvas = tempCanvas;
    ctx = tempCtx;
    albumState.canvasWidth = originalWidth;
    albumState.canvasHeight = originalHeight;
    
    return exportCanvas;
}

function resetUI() {
    // Reset all form inputs to their default values
    const textInput = document.getElementById('textInput');
    const fontSelect = document.getElementById('fontSelect');
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const textColorPicker = document.getElementById('textColorPicker');
    const imageUpload = document.getElementById('imageUpload');
    const imageBlurSlider = document.getElementById('imageBlurSlider');
    const imageOpacitySlider = document.getElementById('imageOpacitySlider');
    const colorOverlayToggle = document.getElementById('colorOverlayToggle');
    const overlayColorPicker = document.getElementById('overlayColorPicker');
    const overlayOpacitySlider = document.getElementById('overlayOpacitySlider');
    const outlineSelect = document.getElementById('outlineSelect');
    const outlineColorPicker = document.getElementById('outlineColorPicker');
    const letterSpacingSlider = document.getElementById('letterSpacingSlider');
    const shadowToggle = document.getElementById('shadowToggle');
    const effectSelect = document.getElementById('effectSelect');
    
    if (textInput) textInput.value = 'brat';
    if (fontSelect) fontSelect.value = 'inter';
    if (fontSizeSlider) {
        fontSizeSlider.value = 128;
        document.getElementById('fontSizeValue').textContent = '128';
    }
    if (textColorPicker) textColorPicker.value = '#ffffff';
    if (imageUpload) imageUpload.value = '';
    if (imageBlurSlider) {
        imageBlurSlider.value = 0;
        document.getElementById('imageBlurValue').textContent = '0';
    }
    if (imageOpacitySlider) {
        imageOpacitySlider.value = 100;
        document.getElementById('imageOpacityValue').textContent = '100';
    }
    if (colorOverlayToggle) {
        colorOverlayToggle.checked = false;
        document.getElementById('colorOverlayGroup').style.display = 'none';
    }
    if (overlayColorPicker) overlayColorPicker.value = '#8ACE00';
    if (overlayOpacitySlider) {
        overlayOpacitySlider.value = 30;
        document.getElementById('overlayOpacityValue').textContent = '30';
    }
    if (outlineSelect) outlineSelect.value = 'none';
    if (outlineColorPicker) outlineColorPicker.value = '#000000';
    if (letterSpacingSlider) {
        letterSpacingSlider.value = 0;
        document.getElementById('letterSpacingValue').textContent = '0';
    }
    if (shadowToggle) {
        shadowToggle.checked = false;
        document.getElementById('shadowControls').style.display = 'none';
    }
    if (effectSelect) effectSelect.value = 'none';
    
    // Reset alignment buttons
    const alignButtons = document.querySelectorAll('[id^="align"]');
    alignButtons.forEach(btn => btn.classList.remove('active'));
    const centerBtn = document.getElementById('alignCenter');
    if (centerBtn) centerBtn.classList.add('active');
    
    // Clear upload area
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.innerHTML = `
            <i data-lucide="upload"></i>
            <p>Click to upload or drag & drop an image</p>
        `;
        lucide.createIcons();
    }
}

// Notification function removed