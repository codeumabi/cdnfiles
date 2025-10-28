// Main application file for Album Cover Generator

document.addEventListener('DOMContentLoaded', async function() {
    // Wait for fonts to be loaded
    if (typeof FontLoader !== 'undefined') {
        await FontLoader.loadFonts();
    }
    
    console.log('Album Cover Generator initialized');
    
    // Initialize components
    initCanvas();
    initControls();
    initExport();
    initColorPalettes();
    initGallery();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

function initControls() {
    // Image upload controls
    initImageUpload();
    
    // Text controls
    initTextControls();
    
    // Effect controls
    initEffectControls();
    
    // Layout controls
    initLayoutControls();
}

function initImageUpload() {
    const imageUpload = document.getElementById('imageUpload');
    const uploadArea = document.getElementById('uploadArea');
    const imageBlurSlider = document.getElementById('imageBlurSlider');
    const imageOpacitySlider = document.getElementById('imageOpacitySlider');
    const colorOverlayToggle = document.getElementById('colorOverlayToggle');
    const overlayColorPicker = document.getElementById('overlayColorPicker');
    const overlayOpacitySlider = document.getElementById('overlayOpacitySlider');
    
    // File input change handler
    if (imageUpload) {
        imageUpload.addEventListener('change', handleImageUpload);
    }
    
    // Upload area click handler
    if (uploadArea) {
        uploadArea.addEventListener('click', () => {
            imageUpload.click();
        });
        
        // Setup drag and drop
        setupDragAndDrop(uploadArea, handleImageFile);
    }
    
    // Image blur slider
    if (imageBlurSlider) {
        imageBlurSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('imageBlurValue').textContent = value;
            updateState('imageBlur', value);
        });
    }
    
    // Image opacity slider
    if (imageOpacitySlider) {
        imageOpacitySlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('imageOpacityValue').textContent = value;
            updateState('imageOpacity', value);
        });
    }
    
    // Color overlay toggle
    if (colorOverlayToggle) {
        colorOverlayToggle.addEventListener('change', (e) => {
            const colorOverlayGroup = document.getElementById('colorOverlayGroup');
            if (e.target.checked) {
                colorOverlayGroup.style.display = 'block';
                updateState('colorOverlay', true);
            } else {
                colorOverlayGroup.style.display = 'none';
                updateState('colorOverlay', false);
            }
        });
    }
    
    // Overlay color picker
    if (overlayColorPicker) {
        overlayColorPicker.addEventListener('input', (e) => {
            updateState('overlayColor', e.target.value);
        });
    }
    
    // Overlay opacity slider
    if (overlayOpacitySlider) {
        overlayOpacitySlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('overlayOpacityValue').textContent = value;
            updateState('overlayOpacity', value);
        });
    }
}

function initTextControls() {
    const textInput = document.getElementById('textInput');
    const fontSelect = document.getElementById('fontSelect');
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const textColorPicker = document.getElementById('textColorPicker');
    const outlineSelect = document.getElementById('outlineSelect');
    const outlineColorPicker = document.getElementById('outlineColorPicker');
    const letterSpacingSlider = document.getElementById('letterSpacingSlider');
    
    // Text input
    if (textInput) {
        textInput.addEventListener('input', (e) => {
            updateState('text', e.target.value);
        });
    }
    
    // Font selection
    if (fontSelect) {
        fontSelect.addEventListener('change', (e) => {
            updateState('fontFamily', e.target.value);
        });
    }
    
    // Font size slider
    if (fontSizeSlider) {
        fontSizeSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('fontSizeValue').textContent = value;
            updateState('fontSize', value);
        });
    }
    
    // Text color picker
    if (textColorPicker) {
        textColorPicker.addEventListener('input', (e) => {
            updateState('textColor', e.target.value);
        });
    }
    
    // Outline selection
    if (outlineSelect) {
        outlineSelect.addEventListener('change', (e) => {
            updateState('outline', e.target.value);
        });
    }
    
    // Outline color picker
    if (outlineColorPicker) {
        outlineColorPicker.addEventListener('input', (e) => {
            updateState('outlineColor', e.target.value);
        });
    }
    
    // Letter spacing slider
    if (letterSpacingSlider) {
        letterSpacingSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('letterSpacingValue').textContent = value;
            updateState('letterSpacing', value);
        });
    }
}

function initEffectControls() {
    const shadowToggle = document.getElementById('shadowToggle');
    const shadowControls = document.getElementById('shadowControls');
    const shadowXSlider = document.getElementById('shadowXSlider');
    const shadowYSlider = document.getElementById('shadowYSlider');
    const shadowBlurSlider = document.getElementById('shadowBlurSlider');
    const shadowColorPicker = document.getElementById('shadowColorPicker');
    const shadowOpacitySlider = document.getElementById('shadowOpacitySlider');
    const effectSelect = document.getElementById('effectSelect');
    
    // Shadow toggle
    if (shadowToggle) {
        shadowToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                shadowControls.style.display = 'block';
                updateState('shadow', true);
            } else {
                shadowControls.style.display = 'none';
                updateState('shadow', false);
            }
        });
    }
    
    // Shadow controls
    if (shadowXSlider) {
        shadowXSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('shadowXValue').textContent = value;
            updateState('shadowX', value);
        });
    }
    
    if (shadowYSlider) {
        shadowYSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('shadowYValue').textContent = value;
            updateState('shadowY', value);
        });
    }
    
    if (shadowBlurSlider) {
        shadowBlurSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('shadowBlurValue').textContent = value;
            updateState('shadowBlur', value);
        });
    }
    
    if (shadowColorPicker) {
        shadowColorPicker.addEventListener('input', (e) => {
            updateState('shadowColor', e.target.value);
        });
    }
    
    if (shadowOpacitySlider) {
        shadowOpacitySlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('shadowOpacityValue').textContent = value;
            updateState('shadowOpacity', value);
        });
    }
    
    // Effect selection
    if (effectSelect) {
        effectSelect.addEventListener('change', (e) => {
            updateState('effect', e.target.value);
        });
    }
}

function initLayoutControls() {
    const alignLeft = document.getElementById('alignLeft');
    const alignCenter = document.getElementById('alignCenter');
    const alignRight = document.getElementById('alignRight');
    
    // Text alignment buttons
    if (alignLeft) {
        alignLeft.addEventListener('click', () => {
            setActiveAlignment('left');
            updateState('textAlignment', 'left');
        });
    }
    
    if (alignCenter) {
        alignCenter.addEventListener('click', () => {
            setActiveAlignment('center');
            updateState('textAlignment', 'center');
        });
    }
    
    if (alignRight) {
        alignRight.addEventListener('click', () => {
            setActiveAlignment('right');
            updateState('textAlignment', 'right');
        });
    }
}

function initColorPalettes() {
    // Initialize text color palette
    const textColorPalette = document.getElementById('textColorPalette');
    if (textColorPalette) {
        createColorPalette(textColorPalette, colorPalettes.text, (color) => {
            document.getElementById('textColorPicker').value = color;
            updateState('textColor', color);
        });
    }
    
    // Initialize overlay color palette
    const overlayColorPalette = document.getElementById('overlayColorPalette');
    if (overlayColorPalette) {
        createColorPalette(overlayColorPalette, colorPalettes.overlay, (color) => {
            document.getElementById('overlayColorPicker').value = color;
            updateState('overlayColor', color);
        });
    }
}

function createColorPalette(container, colors, onColorSelect) {
    container.innerHTML = '';
    
    colors.forEach(color => {
        const colorSwatch = document.createElement('div');
        colorSwatch.className = 'color-swatch';
        colorSwatch.style.backgroundColor = color;
        colorSwatch.title = color;
        
        colorSwatch.addEventListener('click', () => {
            // Remove active class from all swatches in this container
            container.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
            // Add active class to clicked swatch
            colorSwatch.classList.add('active');
            // Call the callback
            onColorSelect(color);
        });
        
        container.appendChild(colorSwatch);
    });
}

function setActiveAlignment(alignment) {
    // Remove active class from all alignment buttons
    document.querySelectorAll('[id^="align"]').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected button
    const button = document.getElementById(`align${alignment.charAt(0).toUpperCase() + alignment.slice(1)}`);
    if (button) {
        button.classList.add('active');
    }
}

async function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        await handleImageFile(file);
    }
}

async function handleImageFile(file) {
    try {
        const img = await loadImage(file);
        albumState.backgroundImage = img;
        albumState.backgroundImageData = file;
        
        // Resize canvas to match image dimensions
        const imageWidth = img.naturalWidth || img.width;
        const imageHeight = img.naturalHeight || img.height;
        
        albumState.canvasWidth = imageWidth;
        albumState.canvasHeight = imageHeight;
        
        // Update canvas element size
        const canvas = document.getElementById('previewCanvas');
        if (canvas) {
            canvas.width = imageWidth;
            canvas.height = imageHeight;
        }
        
        // Add or update custom size option in export preset dropdowns
        updateExportPresetWithImageSize(imageWidth, imageHeight);
        
        // Update upload area to show success
        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea) {
            uploadArea.innerHTML = `
                <i data-lucide="check-circle"></i>
                <p>Image uploaded successfully!</p>
                <small style="max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: block;">${file.name} (${imageWidth}×${imageHeight})</small>
            `;
            uploadArea.classList.add('upload-success');
            
            // Recreate icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
        
        drawCanvas();
    } catch (error) {
        console.error('Error loading image:', error);
    }
}

function updateExportPresetWithImageSize(width, height) {
    const sizeValue = `${width}x${height}`;
    const sizeLabel = `${width}×${height} (Image Size)`;
    
    // Update export size preset dropdown
    const exportSizePreset = document.getElementById('exportSizePreset');
    
    if (exportSizePreset) {
        // Remove previous "Image Size" option if it exists
        const existingOption = exportSizePreset.querySelector('option[data-image-size="true"]');
        if (existingOption) {
            existingOption.remove();
        }
        
        // Add new image size option at the top (after "Custom Size")
        const option = document.createElement('option');
        option.value = sizeValue;
        option.textContent = sizeLabel;
        option.setAttribute('data-image-size', 'true');
        
        // Insert after the custom option (position 1)
        if (exportSizePreset.options.length > 1) {
            exportSizePreset.insertBefore(option, exportSizePreset.options[1]);
        } else {
            exportSizePreset.appendChild(option);
        }
        
        // Select this option
        exportSizePreset.value = sizeValue;
    }
    
    // Update custom width/height inputs
    const customExportWidth = document.getElementById('customExportWidth');
    const customExportHeight = document.getElementById('customExportHeight');
    
    if (customExportWidth) customExportWidth.value = width;
    if (customExportHeight) customExportHeight.value = height;
}

// Gallery functions
function saveToAlbumGallery() {
    if (!albumGalleryManager) {
        return;
    }

    try {
        // Create thumbnail from current canvas
        const thumbnailSize = 200;
        const thumbnailCanvas = document.createElement('canvas');
        thumbnailCanvas.width = thumbnailSize;
        thumbnailCanvas.height = thumbnailSize;
        const thumbnailCtx = thumbnailCanvas.getContext('2d');
        
        // Draw current canvas content to thumbnail
        const canvas = document.getElementById('previewCanvas');
        if (canvas) {
            thumbnailCtx.drawImage(canvas, 0, 0, thumbnailSize, thumbnailSize);
        }
        const thumbnailDataUrl = thumbnailCanvas.toDataURL('image/png');
        
        // Prepare state for saving
        const stateToSave = {
            text: albumState.text,
            fontKey: albumState.fontKey,
            fontSize: albumState.fontSize,
            textColor: albumState.textColor,
            backgroundColor: albumState.backgroundColor,
            backgroundImage: albumState.backgroundImage ? {
                src: albumState.backgroundImage.src,
                width: albumState.backgroundImage.width,
                height: albumState.backgroundImage.height
            } : null,
            backgroundImageData: albumState.backgroundImageData,
            imageBlur: albumState.imageBlur,
            imageOpacity: albumState.imageOpacity,
            colorOverlay: albumState.colorOverlay,
            overlayColor: albumState.overlayColor,
            overlayOpacity: albumState.overlayOpacity,
            outline: {
                type: albumState.outline?.type || 'none',
                color: albumState.outline?.color || '#ffffff'
            },
            letterSpacing: albumState.letterSpacing,
            align: albumState.align || 'center',
            shadow: albumState.shadow,
            shadowX: albumState.shadowX,
            shadowY: albumState.shadowY,
            shadowBlur: albumState.shadowBlur,
            shadowColor: albumState.shadowColor,
            shadowOpacity: albumState.shadowOpacity,
            effect: albumState.effect,
            canvasWidth: albumState.canvasWidth,
            canvasHeight: albumState.canvasHeight
        };
        
        // Save to gallery
        const itemId = albumGalleryManager.saveToGallery(thumbnailDataUrl, stateToSave);
        
        console.log('Album saved to gallery with ID:', itemId);
    } catch (error) {
        console.error('Failed to save album to gallery:', error);
    }
}

function initGallery() {
    // Initialize gallery manager with mobile and desktop containers
    const mobileGalleryContainer = document.getElementById('galleryGrid');
    const desktopGalleryContainer = document.getElementById('galleryGridDesktop');
    
    // Initialize gallery manager with correct parameter order (desktop, mobile)
    if (typeof AlbumGalleryManager !== 'undefined' && (mobileGalleryContainer || desktopGalleryContainer)) {
        window.albumGalleryManager = new AlbumGalleryManager(desktopGalleryContainer, mobileGalleryContainer);
    } else {
        console.error('AlbumGalleryManager not found or gallery containers not found');
    }
    
    // Initialize save buttons (desktop and mobile)
    const saveToGalleryBtn = document.getElementById('saveToGalleryBtn');
    const saveToGalleryBtnMobile = document.getElementById('saveToGalleryBtnMobile');
    
    if (saveToGalleryBtn) {
        saveToGalleryBtn.addEventListener('click', saveToAlbumGallery);
    }
    
    if (saveToGalleryBtnMobile) {
        saveToGalleryBtnMobile.addEventListener('click', saveToAlbumGallery);
    }
}