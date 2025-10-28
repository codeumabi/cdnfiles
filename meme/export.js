// Export functionality for Meme Generator

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

// Create debounced resize function for better performance (especially important for meme generator)
const debouncedResizeMemeCanvas = debounce((width, height) => {
    resizeMemeCanvas(width, height);
}, 1000);

function initMemeExport() {
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
        downloadBtnDesktop.addEventListener('click', handleMemeDownload);
    }
    if (copyImageBtnDesktop) {
        copyImageBtnDesktop.addEventListener('click', handleMemeCopyImage);
    }
    if (resetBtnDesktop) {
        resetBtnDesktop.addEventListener('click', handleMemeReset);
    }
    
    // Event listeners for mobile
    if (downloadBtn) {
        downloadBtn.addEventListener('click', handleMemeDownload);
    }
    if (copyImageBtn) {
        copyImageBtn.addEventListener('click', handleMemeCopyImage);
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', handleMemeReset);
    }
    
    // Event listeners for additional mobile buttons
    if (downloadBtnMobile) {
        downloadBtnMobile.addEventListener('click', handleMemeDownload);
    }
    if (copyImageBtnMobile) {
        copyImageBtnMobile.addEventListener('click', handleMemeCopyImage);
    }
    if (resetBtnMobile) {
        resetBtnMobile.addEventListener('click', handleMemeReset);
    }
    
    // Export size preset handlers
    if (exportSizePresetDesktop) {
        exportSizePresetDesktop.addEventListener('change', (e) => {
            handleMemeExportSizeChange(e.target.value, true);
        });
    }
    if (exportSizePreset) {
        exportSizePreset.addEventListener('change', (e) => {
            handleMemeExportSizeChange(e.target.value, false);
        });
    }
    if (exportSizePresetMobile) {
        exportSizePresetMobile.addEventListener('change', (e) => {
            handleMemeExportSizeChange(e.target.value, false);
        });
    }
    
    // Custom size input handlers with debounced live preview for better performance
    if (customExportWidthDesktop) {
        customExportWidthDesktop.addEventListener('input', (e) => {
            memeState.exportWidth = parseInt(e.target.value) || 500;
            // Update live preview with debouncing to prevent performance issues
            debouncedResizeMemeCanvas(memeState.exportWidth, memeState.exportHeight);
        });
    }
    if (customExportHeightDesktop) {
        customExportHeightDesktop.addEventListener('input', (e) => {
            memeState.exportHeight = parseInt(e.target.value) || 500;
            // Update live preview with debouncing to prevent performance issues
            debouncedResizeMemeCanvas(memeState.exportWidth, memeState.exportHeight);
        });
    }
    if (customExportWidth) {
        customExportWidth.addEventListener('input', (e) => {
            memeState.exportWidth = parseInt(e.target.value) || 500;
            // Update live preview with debouncing to prevent performance issues
            debouncedResizeMemeCanvas(memeState.exportWidth, memeState.exportHeight);
        });
    }
    if (customExportHeight) {
        customExportHeight.addEventListener('input', (e) => {
            memeState.exportHeight = parseInt(e.target.value) || 500;
            // Update live preview with debouncing to prevent performance issues
            debouncedResizeMemeCanvas(memeState.exportWidth, memeState.exportHeight);
        });
    }
    
    // Mobile custom size input handlers (CRITICAL: these were missing!)
    if (customExportWidthMobile) {
        customExportWidthMobile.addEventListener('input', (e) => {
            memeState.exportWidth = parseInt(e.target.value) || 500;
            // Update live preview with debouncing to prevent performance issues
            debouncedResizeMemeCanvas(memeState.exportWidth, memeState.exportHeight);
        });
    }
    if (customExportHeightMobile) {
        customExportHeightMobile.addEventListener('input', (e) => {
            memeState.exportHeight = parseInt(e.target.value) || 500;
            // Update live preview with debouncing to prevent performance issues
            debouncedResizeMemeCanvas(memeState.exportWidth, memeState.exportHeight);
        });
    }
    
    // Format selection handlers
    if (exportFormatSelectDesktop) {
        exportFormatSelectDesktop.addEventListener('change', (e) => {
            memeState.exportFormat = e.target.value;
        });
    }
    if (exportFormatSelect) {
        exportFormatSelect.addEventListener('change', (e) => {
            memeState.exportFormat = e.target.value;
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

function handleMemeExportSizeChange(preset, isDesktop) {
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
        memeState.exportWidth = parseInt(widthInput.value) || 500;
        memeState.exportHeight = parseInt(heightInput.value) || 500;
    } else {
        customSizeGroup.style.display = 'none';
        const [width, height] = preset.split('x').map(Number);
        memeState.exportWidth = width;
        memeState.exportHeight = height;
        
        // Update input values
        widthInput.value = width;
        heightInput.value = height;
    }
    
    // Update canvas preview to show the export size
    resizeMemeCanvas(memeState.exportWidth, memeState.exportHeight);
}

function handleMemeDownload() {
    const exportCanvas = createMemeExportCanvas();
    const filename = `brat-meme-${Date.now()}.${memeState.exportFormat}`;
    downloadCanvas(exportCanvas, filename, memeState.exportFormat);
}

async function handleMemeCopyImage() {
    const exportCanvas = createMemeExportCanvas();
    const success = await copyCanvasToClipboard(exportCanvas);
    
    if (success) {
    } else {
    }
}

function handleMemeReset() {
    if (confirm('Are you sure you want to reset all settings? This will clear your image, text, stickers, and all customizations.')) {
        resetMemeState();
        resetMemeUI();
        drawMemeCanvas();
    }
}

function createMemeExportCanvas() {
    const exportCanvas = document.createElement('canvas');
    const exportCtx = exportCanvas.getContext('2d');
    
    exportCanvas.width = memeState.exportWidth;
    exportCanvas.height = memeState.exportHeight;
    
    // Save current canvas state
    const originalWidth = memeState.canvasWidth;
    const originalHeight = memeState.canvasHeight;
    
    // Temporarily update state for export size
    memeState.canvasWidth = memeState.exportWidth;
    memeState.canvasHeight = memeState.exportHeight;
    
    // Scale stickers for export
    const originalStickers = [...memeState.stickers];
    const scaleX = memeState.exportWidth / originalWidth;
    const scaleY = memeState.exportHeight / originalHeight;
    
    memeState.stickers = memeState.stickers.map(sticker => ({
        ...sticker,
        x: sticker.x * scaleX,
        y: sticker.y * scaleY,
        size: sticker.size * Math.min(scaleX, scaleY)
    }));
    
    // Render to export canvas
    const tempCanvas = memeCanvas;
    const tempCtx = memeCtx;
    
    // Set global canvas and context to export canvas
    memeCanvas = exportCanvas;
    memeCtx = exportCtx;
    
    // Draw the meme at export resolution
    drawMemeCanvas();
    
    // Restore original canvas and context
    memeCanvas = tempCanvas;
    memeCtx = tempCtx;
    memeState.canvasWidth = originalWidth;
    memeState.canvasHeight = originalHeight;
    memeState.stickers = originalStickers;
    
    return exportCanvas;
}

function resetMemeUI() {
    // Reset all form inputs to their default values
    const textInput = document.getElementById('textInput');
    const fontSelect = document.getElementById('fontSelect');
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const textColorPicker = document.getElementById('textColorPicker');
    const imageUpload = document.getElementById('imageUpload');
    const blendModeSelect = document.getElementById('blendModeSelect');
    const imageOpacitySlider = document.getElementById('imageOpacitySlider');
    const outlineToggle = document.getElementById('outlineToggle');
    const outlineWidthSlider = document.getElementById('outlineWidthSlider');
    const outlineColorPicker = document.getElementById('outlineColorPicker');
    const shadowToggle = document.getElementById('shadowToggle');
    const shadowXSlider = document.getElementById('shadowXSlider');
    const shadowYSlider = document.getElementById('shadowYSlider');
    const shadowBlurSlider = document.getElementById('shadowBlurSlider');
    const shadowColorPicker = document.getElementById('shadowColorPicker');
    const aestheticIntensitySlider = document.getElementById('aestheticIntensitySlider');
    const stickerSizeSlider = document.getElementById('stickerSizeSlider');
    
    if (textInput) textInput.value = 'brat';
    if (fontSelect) fontSelect.value = 'fredoka-one';
    if (fontSizeSlider) {
        fontSizeSlider.value = 128;
        document.getElementById('fontSizeValue').textContent = '128';
    }
    if (textColorPicker) textColorPicker.value = '#ff69b4';
    if (imageUpload) imageUpload.value = '';
    if (blendModeSelect) blendModeSelect.value = 'normal';
    if (imageOpacitySlider) {
        imageOpacitySlider.value = 100;
        document.getElementById('imageOpacityValue').textContent = '100';
    }
    
    // Reset background color
    const backgroundColorPicker = document.getElementById('backgroundColorPicker');
    if (backgroundColorPicker) backgroundColorPicker.value = '#8ACE00';
    if (outlineToggle) outlineToggle.checked = true;
    if (outlineWidthSlider) {
        outlineWidthSlider.value = 4;
        document.getElementById('outlineWidthValue').textContent = '4';
    }
    if (outlineColorPicker) outlineColorPicker.value = '#000000';
    if (shadowToggle) shadowToggle.checked = true;
    if (shadowXSlider) {
        shadowXSlider.value = 2;
        document.getElementById('shadowXValue').textContent = '2';
    }
    if (shadowYSlider) {
        shadowYSlider.value = 2;
        document.getElementById('shadowYValue').textContent = '2';
    }
    if (shadowBlurSlider) {
        shadowBlurSlider.value = 6;
        document.getElementById('shadowBlurValue').textContent = '6';
    }
    if (shadowColorPicker) shadowColorPicker.value = '#ff1493';
    if (aestheticIntensitySlider) {
        aestheticIntensitySlider.value = 50;
        document.getElementById('aestheticIntensityValue').textContent = '50';
    }
    if (stickerSizeSlider) {
        stickerSizeSlider.value = 50;
        document.getElementById('stickerSizeValue').textContent = '50';
    }
    
    // Reset text style buttons
    const textStyleButtons = document.querySelectorAll('[id$="TextBtn"]');
    textStyleButtons.forEach(btn => btn.classList.remove('active'));
    const bubbleBtn = document.getElementById('bubbleTextBtn');
    if (bubbleBtn) bubbleBtn.classList.add('active');
    
    // Reset alignment buttons
    const alignButtons = document.querySelectorAll('[id^="align"]');
    alignButtons.forEach(btn => btn.classList.remove('active'));
    const centerBtn = document.getElementById('alignCenter');
    if (centerBtn) centerBtn.classList.add('active');
    
    // Reset aesthetic buttons
    const aestheticButtons = document.querySelectorAll('.aesthetic-item');
    aestheticButtons.forEach(btn => btn.classList.remove('active'));
    
    // Reset mood buttons
    const moodButtons = document.querySelectorAll('.mood-item');
    moodButtons.forEach(btn => btn.classList.remove('active'));
    
    // Reset sticker category buttons
    const stickerCatButtons = document.querySelectorAll('[id$="StickersBtn"]');
    stickerCatButtons.forEach(btn => btn.classList.remove('active'));
    const crownBtn = document.getElementById('crownStickersBtn');
    if (crownBtn) crownBtn.classList.add('active');
    
    // Reset mood category buttons
    const moodCatButtons = document.querySelectorAll('[id$="MoodsBtn"]');
    moodCatButtons.forEach(btn => btn.classList.remove('active'));
    const brattyBtn = document.getElementById('brattyMoodsBtn');
    if (brattyBtn) brattyBtn.classList.add('active');
    
    // Clear upload area
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.innerHTML = `
            <i data-lucide="upload"></i>
            <p>Click to upload or drag & drop an image</p>
        `;
        uploadArea.classList.remove('upload-success');
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}