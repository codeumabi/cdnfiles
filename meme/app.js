// Main application file for Meme Generator

document.addEventListener('DOMContentLoaded', function() {
    console.log('Brat Meme Generator initialized');
    
    // Initialize components
    initMemeCanvas();
    initMemeControls();
    initMemeExport();
    initMemeColorPalettes();
    initMemeAesthetics();
    initMemeStickers();
    initMemeMoods();
    initMemeGallery();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

function initMemeControls() {
    // Image upload controls
    initMemeImageUpload();
    
    // Text controls
    initMemeTextControls();
    
    // Effect controls
    initMemeEffectControls();
    
    // Layout controls
    initMemeLayoutControls();
    
    // Canvas interaction handlers
    initCanvasInteractions();
    
    // Keyboard controls
    initKeyboardControls();
}

function initMemeImageUpload() {
    const imageUpload = document.getElementById('imageUpload');
    const uploadArea = document.getElementById('uploadArea');
    const blendModeSelect = document.getElementById('blendModeSelect');
    const imageOpacitySlider = document.getElementById('imageOpacitySlider');
    const backgroundColorPicker = document.getElementById('backgroundColorPicker');
    const removeImageBtn = document.getElementById('removeImageBtn');
    
    // File input change handler
    if (imageUpload) {
        imageUpload.addEventListener('change', handleMemeImageUpload);
    }
    
    // Upload area click handler
    if (uploadArea) {
        uploadArea.addEventListener('click', () => {
            imageUpload.click();
        });
        
        // Setup drag and drop
        setupDragAndDrop(uploadArea, handleMemeImageFile);
    }
    
    // Remove image button handler
    if (removeImageBtn) {
        removeImageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeBackgroundImage();
        });
    }
    
    // Blend mode selector
    if (blendModeSelect) {
        blendModeSelect.addEventListener('change', (e) => {
            updateMemeState('blendMode', e.target.value);
        });
    }
    
    // Image opacity slider
    if (imageOpacitySlider) {
        imageOpacitySlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('imageOpacityValue').textContent = value;
            updateMemeState('imageOpacity', value);
        });
    }
    
    // Background color toggle
    const backgroundColorToggle = document.getElementById('backgroundColorToggle');
    const backgroundColorControls = document.getElementById('backgroundColorControls');
    
    if (backgroundColorToggle) {
        backgroundColorToggle.addEventListener('change', (e) => {
            memeState.backgroundColorEnabled = e.target.checked;
            if (backgroundColorControls) {
                backgroundColorControls.style.display = e.target.checked ? 'block' : 'none';
            }
            drawMemeCanvas();
        });
    }
    
    // Background color picker
    if (backgroundColorPicker) {
        backgroundColorPicker.addEventListener('input', (e) => {
            updateMemeState('backgroundColor', e.target.value);
        });
    }
}

function initMemeTextControls() {
    const textInput = document.getElementById('textInput');
    const fontSelect = document.getElementById('fontSelect');
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const textColorPicker = document.getElementById('textColorPicker');
    const outlineToggle = document.getElementById('outlineToggle');
    const outlineWidthSlider = document.getElementById('outlineWidthSlider');
    const outlineColorPicker = document.getElementById('outlineColorPicker');
    
    // Text input
    if (textInput) {
        textInput.addEventListener('input', (e) => {
            const currentText = getCurrentTextElement();
            if (currentText) {
                currentText.text = e.target.value;
                drawMemeCanvas();
            }
        });
    }
    
    // Font selection
    if (fontSelect) {
        fontSelect.addEventListener('change', (e) => {
            const currentText = getCurrentTextElement();
            if (currentText) {
                currentText.fontFamily = e.target.value;
                drawMemeCanvas();
            }
        });
    }
    
    // Font size slider
    if (fontSizeSlider) {
        fontSizeSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('fontSizeValue').textContent = value;
            const currentText = getCurrentTextElement();
            if (currentText) {
                currentText.fontSize = value;
                drawMemeCanvas();
            }
        });
    }
    
    // Text color picker
    if (textColorPicker) {
        textColorPicker.addEventListener('input', (e) => {
            const currentText = getCurrentTextElement();
            if (currentText) {
                currentText.textColor = e.target.value;
                drawMemeCanvas();
            }
        });
    }
    
    // Text style buttons
    const bubbleTextBtn = document.getElementById('bubbleTextBtn');
    const glossyTextBtn = document.getElementById('glossyTextBtn');
    const gradientTextBtn = document.getElementById('gradientTextBtn');
    const chromeTextBtn = document.getElementById('chromeTextBtn');
    
    if (bubbleTextBtn) {
        bubbleTextBtn.addEventListener('click', () => {
            setActiveTextStyle('bubble');
            const currentText = getCurrentTextElement();
            if (currentText) {
                currentText.textStyle = 'bubble';
                drawMemeCanvas();
            }
        });
    }
    if (glossyTextBtn) {
        glossyTextBtn.addEventListener('click', () => {
            setActiveTextStyle('glossy');
            const currentText = getCurrentTextElement();
            if (currentText) {
                currentText.textStyle = 'glossy';
                drawMemeCanvas();
            }
        });
    }
    if (gradientTextBtn) {
        gradientTextBtn.addEventListener('click', () => {
            setActiveTextStyle('gradient');
            const currentText = getCurrentTextElement();
            if (currentText) {
                currentText.textStyle = 'gradient';
                drawMemeCanvas();
            }
        });
    }
    if (chromeTextBtn) {
        chromeTextBtn.addEventListener('click', () => {
            setActiveTextStyle('chrome');
            const currentText = getCurrentTextElement();
            if (currentText) {
                currentText.textStyle = 'chrome';
                drawMemeCanvas();
            }
        });
    }
    
    // Outline controls
    if (outlineToggle) {
        outlineToggle.addEventListener('change', (e) => {
            const outlineControls = document.getElementById('outlineControls');
            if (e.target.checked) {
                outlineControls.style.display = 'block';
                updateMemeState('outline', true);
            } else {
                outlineControls.style.display = 'none';
                updateMemeState('outline', false);
            }
        });
    }
    
    if (outlineWidthSlider) {
        outlineWidthSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('outlineWidthValue').textContent = value;
            updateMemeState('outlineWidth', value);
        });
    }
    
    if (outlineColorPicker) {
        outlineColorPicker.addEventListener('input', (e) => {
            updateMemeState('outlineColor', e.target.value);
        });
    }
}

function initMemeEffectControls() {
    const shadowToggle = document.getElementById('shadowToggle');
    const shadowControls = document.getElementById('shadowControls');
    const shadowXSlider = document.getElementById('shadowXSlider');
    const shadowYSlider = document.getElementById('shadowYSlider');
    const shadowBlurSlider = document.getElementById('shadowBlurSlider');
    const shadowColorPicker = document.getElementById('shadowColorPicker');
    const aestheticIntensitySlider = document.getElementById('aestheticIntensitySlider');
    
    // Shadow toggle
    if (shadowToggle) {
        shadowToggle.addEventListener('change', (e) => {
            if (e.target.checked) {
                shadowControls.style.display = 'block';
                updateMemeState('shadow', true);
            } else {
                shadowControls.style.display = 'none';
                updateMemeState('shadow', false);
            }
        });
    }
    
    // Shadow controls
    if (shadowXSlider) {
        shadowXSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('shadowXValue').textContent = value;
            updateMemeState('shadowX', value);
        });
    }
    
    if (shadowYSlider) {
        shadowYSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('shadowYValue').textContent = value;
            updateMemeState('shadowY', value);
        });
    }
    
    if (shadowBlurSlider) {
        shadowBlurSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('shadowBlurValue').textContent = value;
            updateMemeState('shadowBlur', value);
        });
    }
    
    if (shadowColorPicker) {
        shadowColorPicker.addEventListener('input', (e) => {
            updateMemeState('shadowColor', e.target.value);
        });
    }
    
    // Aesthetic intensity slider
    if (aestheticIntensitySlider) {
        aestheticIntensitySlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('aestheticIntensityValue').textContent = value;
            updateMemeState('aestheticIntensity', value);
        });
    }
}

function initMemeLayoutControls() {
    const alignLeft = document.getElementById('alignLeft');
    const alignCenter = document.getElementById('alignCenter');
    const alignRight = document.getElementById('alignRight');
    
    // Text alignment buttons
    if (alignLeft) {
        alignLeft.addEventListener('click', () => {
            setActiveAlignment('left');
            updateMemeState('textAlignment', 'left');
        });
    }
    
    if (alignCenter) {
        alignCenter.addEventListener('click', () => {
            setActiveAlignment('center');
            updateMemeState('textAlignment', 'center');
        });
    }
    
    if (alignRight) {
        alignRight.addEventListener('click', () => {
            setActiveAlignment('right');
            updateMemeState('textAlignment', 'right');
        });
    }
}

function initMemeColorPalettes() {
    // Initialize text color palette
    const textColorPalette = document.getElementById('textColorPalette');
    if (textColorPalette) {
        createMemeColorPalette(textColorPalette, bratColorPalettes.text, (color) => {
            document.getElementById('textColorPicker').value = color;
            const currentText = getCurrentTextElement();
            if (currentText) {
                currentText.textColor = color;
                drawMemeCanvas();
            }
        });
    }
    
    // Initialize background color palette
    const backgroundColorPalette = document.getElementById('backgroundColorPalette');
    if (backgroundColorPalette) {
        createMemeColorPalette(backgroundColorPalette, bratColorPalettes.background, (color) => {
            document.getElementById('backgroundColorPicker').value = color;
            updateMemeState('backgroundColor', color);
        });
    }
}

function initMemeAesthetics() {
    const aestheticSelect = document.getElementById('aestheticSelect');
    if (!aestheticSelect) return;
    
    aestheticSelect.addEventListener('change', (e) => {
        memeState.aesthetic = e.target.value || null;
        drawMemeCanvas();
    });
}

function initMemeStickers() {
    const stickerCategorySelect = document.getElementById('stickerCategorySelect');
    const stickerSelect = document.getElementById('stickerSelect');
    
    // Sticker category dropdown
    if (stickerCategorySelect) {
        stickerCategorySelect.addEventListener('change', (e) => {
            memeState.activeStickerCategory = e.target.value;
            updateStickerOptions(e.target.value);
        });
    }
    
    // Sticker selection dropdown
    if (stickerSelect) {
        stickerSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                addSticker(e.target.value);
                e.target.value = ''; // Reset selection
            }
        });
    }
    
    // Sticker size slider
    const stickerSizeSlider = document.getElementById('stickerSizeSlider');
    if (stickerSizeSlider) {
        stickerSizeSlider.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            document.getElementById('stickerSizeValue').textContent = value;
            updateMemeState('stickerSize', value);
        });
    }
    
    // Clear stickers button
    const clearStickersBtn = document.getElementById('clearStickersBtn');
    if (clearStickersBtn) {
        clearStickersBtn.addEventListener('click', () => {
            clearAllStickers();
            memeState.selectedSticker = null;
        });
    }
    
    // Initialize with crowns
    updateStickerOptions('crowns');
}

function initMemeMoods() {
    const moodCategorySelect = document.getElementById('moodCategorySelect');
    const moodSelect = document.getElementById('moodSelect');
    
    // Mood category dropdown
    if (moodCategorySelect) {
        moodCategorySelect.addEventListener('change', (e) => {
            memeState.activeMoodCategory = e.target.value;
            updateMoodOptions(e.target.value);
        });
    }
    
    // Mood selection dropdown
    if (moodSelect) {
        moodSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                const selectedMood = getCurrentMoodByName(e.target.value);
                if (selectedMood) {
                    memeState.activeMood = selectedMood;
                    applyMoodPreset(selectedMood);
                }
                e.target.value = ''; // Reset selection
            }
        });
    }
    
    // Initialize with bratty moods
    updateMoodOptions('bratty');
}

// Helper functions
function createMemeColorPalette(container, colors, onColorSelect) {
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

function setActiveTextStyle(style) {
    const buttons = document.querySelectorAll('[id$="TextBtn"]');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    const button = document.getElementById(`${style}TextBtn`);
    if (button) button.classList.add('active');
}

function setActiveAlignment(alignment) {
    document.querySelectorAll('[id^="align"]').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const button = document.getElementById(`align${alignment.charAt(0).toUpperCase() + alignment.slice(1)}`);
    if (button) button.classList.add('active');
}


// New helper functions for dropdown interfaces
function updateStickerOptions(category) {
    const stickerSelect = document.getElementById('stickerSelect');
    if (!stickerSelect) return;
    
    const stickers = stickerCollections[category] || [];
    stickerSelect.innerHTML = '<option value="">Choose a sticker...</option>';
    
    stickers.forEach(emoji => {
        const option = document.createElement('option');
        option.value = emoji;
        option.textContent = `${emoji} ${emoji}`;
        stickerSelect.appendChild(option);
    });
}

function updateMoodOptions(category) {
    const moodSelect = document.getElementById('moodSelect');
    if (!moodSelect) return;
    
    const moods = moodPresets[category] || [];
    moodSelect.innerHTML = '<option value="">Choose a mood...</option>';
    
    moods.forEach(mood => {
        const option = document.createElement('option');
        option.value = mood.name;
        option.textContent = mood.name;
        moodSelect.appendChild(option);
    });
}

function getCurrentMoodByName(name) {
    const category = memeState.activeMoodCategory;
    const moods = moodPresets[category] || [];
    return moods.find(mood => mood.name === name);
}

function updateTextControls() {
    const currentText = getCurrentTextElement();
    if (!currentText) return;
    
    const textInput = document.getElementById('textInput');
    const fontSelect = document.getElementById('fontSelect');
    const fontSizeSlider = document.getElementById('fontSizeSlider');
    const textColorPicker = document.getElementById('textColorPicker');
    
    if (textInput) textInput.value = currentText.text;
    if (fontSelect) fontSelect.value = currentText.fontFamily;
    if (fontSizeSlider) {
        fontSizeSlider.value = currentText.fontSize;
        document.getElementById('fontSizeValue').textContent = currentText.fontSize;
    }
    if (textColorPicker) textColorPicker.value = currentText.textColor;
    
    // Update text style buttons
    setActiveTextStyle(currentText.textStyle);
    
    // Update text list
    updateTextList();
}

// Hide text editing controls when element is selected
function hideTextEditingControls() {
    const textControls = document.querySelectorAll('#textInput, #fontSelect, #fontSizeSlider, #textColorPicker, .button-group, #outlineControls, #shadowControls, .color-palette');
    textControls.forEach(control => {
        if (control) {
            control.style.opacity = '0.3';
            control.style.pointerEvents = 'none';
        }
    });
    
    // Show selection hint
    showSelectionHint();
}

// Show text editing controls when no element is selected
function showTextEditingControls() {
    const textControls = document.querySelectorAll('#textInput, #fontSelect, #fontSizeSlider, #textColorPicker, .button-group, #outlineControls, #shadowControls, .color-palette');
    textControls.forEach(control => {
        if (control) {
            control.style.opacity = '1';
            control.style.pointerEvents = 'auto';
        }
    });
    
    // Hide selection hint
    hideSelectionHint();
}

// Show hint about selected element
function showSelectionHint() {
    // Disabled: No longer show selection hints
}

// Hide selection hint
function hideSelectionHint() {
    const hint = document.getElementById('selectionHint');
    if (hint) {
        hint.style.display = 'none';
    }
}

// Canvas interaction functions
function initCanvasInteractions() {
    if (!memeCanvas) return;
    
    // Mouse events
    memeCanvas.addEventListener('click', handleCanvasClick);
    memeCanvas.addEventListener('mousedown', handleMouseDown);
    memeCanvas.addEventListener('mousemove', handleMouseMove);
    memeCanvas.addEventListener('mouseup', handleMouseUp);
    
    // Touch events
    memeCanvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    memeCanvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    memeCanvas.addEventListener('touchend', handleTouchEnd);
}

function initKeyboardControls() {
    document.addEventListener('keydown', handleKeyDown);
    
    // Add buttons for adding/removing text and stickers
    addTextManagementButtons();
}

let isDragging = false;
let isResizing = false;
let dragTarget = null;
let resizeTarget = null;
let lastMousePos = { x: 0, y: 0 };
let initialSize = 0;

function handleMouseDown(event) {
    const pos = getCanvasPosition(event);
    
    // Check if clicking on background image for dragging (only when no elements are selected)
    if (memeState.backgroundImage && !memeState.selectedSticker && 
        !memeState.textElements.some(t => t.selected)) {
        isDragging = true;
        dragTarget = { type: 'backgroundImage' };
        lastMousePos = pos;
        return;
    }
    
    // Check if clicking on selected sticker
    if (memeState.selectedSticker) {
        const sticker = memeState.stickers.find(s => s.id === memeState.selectedSticker);
        if (sticker) {
            // Check resize handle first (circular)
            const handleRadius = 6;
            const handleX = sticker.x + sticker.size/2 + 5;
            const handleY = sticker.y + sticker.size/2 + 5;
            const handleDistance = Math.sqrt(
                Math.pow(pos.x - handleX, 2) + Math.pow(pos.y - handleY, 2)
            );
            
            if (handleDistance <= handleRadius) {
                isResizing = true;
                resizeTarget = { type: 'sticker', id: sticker.id };
                initialSize = sticker.size;
                lastMousePos = pos;
                return;
            }
            
            // Check if clicking on sticker body
            const distance = Math.sqrt(
                Math.pow(pos.x - sticker.x, 2) + Math.pow(pos.y - sticker.y, 2)
            );
            if (distance < sticker.size / 2) {
                isDragging = true;
                dragTarget = { type: 'sticker', id: sticker.id };
                memeState.dragOffset = { x: pos.x - sticker.x, y: pos.y - sticker.y };
                lastMousePos = pos;
                return;
            }
        }
    }
    
    // Check if clicking on selected text
    const currentText = getCurrentTextElement();
    if (currentText && currentText.selected) {
        memeCtx.font = `${currentText.fontSize}px "${bubbleFontMap[currentText.fontFamily] || 'Fredoka One'}"`;
        const dims = getWrappedTextDimensions(memeCtx, currentText);
        
        // Check resize handle first (circular)
        const handleRadius = 8;
        const handleX = currentText.x + dims.width/2 + 10;
        const handleY = currentText.y + dims.height/2 + 10;
        const handleDistance = Math.sqrt(
            Math.pow(pos.x - handleX, 2) + Math.pow(pos.y - handleY, 2)
        );
        
        if (handleDistance <= handleRadius + 5) {
            isResizing = true;
            resizeTarget = { type: 'text', id: currentText.id };
            initialSize = currentText.fontSize;
            lastMousePos = pos;
            return;
        }
        
        // Check if clicking on text body - allow dragging anywhere on the text
        if (pos.x >= currentText.x - dims.width/2 - 10 && 
            pos.x <= currentText.x + dims.width/2 + 10 &&
            pos.y >= currentText.y - dims.height/2 - 10 && 
            pos.y <= currentText.y + dims.height/2 + 10) {
            
            isDragging = true;
            dragTarget = { type: 'text', id: currentText.id };
            memeState.dragOffset = { x: pos.x - currentText.x, y: pos.y - currentText.y };
            lastMousePos = pos;
            memeCanvas.style.cursor = 'grabbing';
            return;
        }
    }
}

function handleMouseMove(event) {
    const pos = getCanvasPosition(event);
    
    // Update cursor based on hover
    if (!isDragging && !isResizing) {
        const currentText = getCurrentTextElement();
        if (currentText && currentText.selected) {
            memeCtx.font = `${currentText.fontSize}px "${bubbleFontMap[currentText.fontFamily] || 'Fredoka One'}"`;
            const dims = getWrappedTextDimensions(memeCtx, currentText);
            
            // Check if hovering over text
            if (pos.x >= currentText.x - dims.width/2 - 10 && 
                pos.x <= currentText.x + dims.width/2 + 10 &&
                pos.y >= currentText.y - dims.height/2 - 10 && 
                pos.y <= currentText.y + dims.height/2 + 10) {
                memeCanvas.style.cursor = 'grab';
            } else {
                memeCanvas.style.cursor = 'default';
            }
        } else {
            memeCanvas.style.cursor = 'default';
        }
    }
    
    // Handle background image dragging
    if (isDragging && dragTarget && dragTarget.type === 'backgroundImage') {
        const deltaX = pos.x - lastMousePos.x;
        const deltaY = pos.y - lastMousePos.y;
        memeState.backgroundImageOffset.x += deltaX;
        memeState.backgroundImageOffset.y += deltaY;
        lastMousePos = pos;
        drawMemeCanvas();
        return;
    }
    
    if (isResizing && resizeTarget) {
        const deltaX = pos.x - lastMousePos.x;
        const deltaY = pos.y - lastMousePos.y;
        const delta = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const scaleFactor = deltaX > 0 || deltaY > 0 ? 1 : -1;
        
        if (resizeTarget.type === 'sticker') {
            const sticker = memeState.stickers.find(s => s.id === resizeTarget.id);
            if (sticker) {
                sticker.size = Math.max(0, Math.min(300, initialSize + (delta * scaleFactor * 0.5)));
                drawMemeCanvas();
            }
        } else if (resizeTarget.type === 'text') {
            const textElement = memeState.textElements.find(t => t.id === resizeTarget.id);
            if (textElement) {
                textElement.fontSize = Math.max(12, Math.min(400, initialSize + (delta * scaleFactor * 0.3)));
                // Update the UI slider if this is the current text
                if (textElement.id === memeState.currentTextId) {
                    const fontSizeSlider = document.getElementById('fontSizeSlider');
                    if (fontSizeSlider) {
                        fontSizeSlider.value = textElement.fontSize;
                        document.getElementById('fontSizeValue').textContent = textElement.fontSize;
                    }
                }
                drawMemeCanvas();
            }
        }
        return;
    }
    
    if (isDragging && dragTarget) {
        if (dragTarget.type === 'sticker') {
            const sticker = memeState.stickers.find(s => s.id === dragTarget.id);
            if (sticker) {
                sticker.x = pos.x - memeState.dragOffset.x;
                sticker.y = pos.y - memeState.dragOffset.y;
                drawMemeCanvas();
            }
        } else if (dragTarget.type === 'text') {
            const textElement = memeState.textElements.find(t => t.id === dragTarget.id);
            if (textElement) {
                memeCtx.font = `${textElement.fontSize}px "${bubbleFontMap[textElement.fontFamily] || 'Fredoka One'}"`;
                const dims = getWrappedTextDimensions(memeCtx, textElement);
                
                const halfWidth = dims.width / 2 + 10;
                const halfHeight = dims.height / 2 + 10;
                
                const minX = Math.min(halfWidth, memeCanvas.width / 2);
                const maxX = Math.max(memeCanvas.width - halfWidth, memeCanvas.width / 2);
                const minY = Math.min(halfHeight, memeCanvas.height / 2);
                const maxY = Math.max(memeCanvas.height - halfHeight, memeCanvas.height / 2);
                
                textElement.x = Math.max(minX, Math.min(maxX, pos.x - memeState.dragOffset.x));
                textElement.y = Math.max(minY, Math.min(maxY, pos.y - memeState.dragOffset.y));
                drawMemeCanvas();
            }
        }
    }
    
    lastMousePos = pos;
}

function handleMouseUp() {
    // Show notification if background image was dragged
    if (isDragging && dragTarget && dragTarget.type === 'backgroundImage') {
    }
    
    // Reset cursor
    if (memeCanvas) {
        memeCanvas.style.cursor = 'default';
    }
    
    isDragging = false;
    isResizing = false;
    dragTarget = null;
    resizeTarget = null;
}

function handleTouchStart(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    handleMouseDown(mouseEvent);
}

function handleTouchMove(event) {
    event.preventDefault();
    const touch = event.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    handleMouseMove(mouseEvent);
}

function handleTouchEnd(event) {
    event.preventDefault();
    handleMouseUp();
}

function handleKeyDown(event) {
    const moveDistance = event.shiftKey ? 10 : 1;
    
    // Arrow key movement for selected elements
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
        
        if (memeState.selectedSticker) {
            const sticker = memeState.stickers.find(s => s.id === memeState.selectedSticker);
            if (sticker) {
                switch (event.key) {
                    case 'ArrowUp': sticker.y -= moveDistance; break;
                    case 'ArrowDown': sticker.y += moveDistance; break;
                    case 'ArrowLeft': sticker.x -= moveDistance; break;
                    case 'ArrowRight': sticker.x += moveDistance; break;
                }
                drawMemeCanvas();
            }
        } else {
            const currentText = getCurrentTextElement();
            if (currentText && currentText.selected) {
                memeCtx.font = `${currentText.fontSize}px "${bubbleFontMap[currentText.fontFamily] || 'Fredoka One'}"`;
                const dims = getWrappedTextDimensions(memeCtx, currentText);
                
                const halfWidth = dims.width / 2 + 10;
                const halfHeight = dims.height / 2 + 10;
                
                const minX = Math.min(halfWidth, memeCanvas.width / 2);
                const maxX = Math.max(memeCanvas.width - halfWidth, memeCanvas.width / 2);
                const minY = Math.min(halfHeight, memeCanvas.height / 2);
                const maxY = Math.max(memeCanvas.height - halfHeight, memeCanvas.height / 2);
                
                switch (event.key) {
                    case 'ArrowUp': currentText.y = Math.max(minY, currentText.y - moveDistance); break;
                    case 'ArrowDown': currentText.y = Math.min(maxY, currentText.y + moveDistance); break;
                    case 'ArrowLeft': currentText.x = Math.max(minX, currentText.x - moveDistance); break;
                    case 'ArrowRight': currentText.x = Math.min(maxX, currentText.x + moveDistance); break;
                }
                drawMemeCanvas();
            }
        }
    }
    
    // Delete key for removing elements
    if (event.key === 'Delete' || event.key === 'Backspace') {
        if (memeState.selectedSticker) {
            memeState.stickers = memeState.stickers.filter(s => s.id !== memeState.selectedSticker);
            memeState.selectedSticker = null;
            drawMemeCanvas();
        }
    }
}

function getCanvasPosition(event) {
    const rect = memeCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Scale coordinates to canvas size
    const scaleX = memeCanvas.width / rect.width;
    const scaleY = memeCanvas.height / rect.height;
    
    return {
        x: x * scaleX,
        y: y * scaleY
    };
}

function addTextManagementButtons() {
    // Add buttons for text management near the text controls
    const textSection = document.querySelector('#textInput').closest('.control-group');
    if (textSection && !document.getElementById('addTextBtn')) {
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';
        buttonGroup.style.marginTop = '10px';
        
        const addTextBtn = document.createElement('button');
        addTextBtn.id = 'addTextBtn';
        addTextBtn.className = 'btn btn-primary btn-sm';
        addTextBtn.innerHTML = '<i data-lucide="plus"></i> Add Text';
        addTextBtn.addEventListener('click', () => {
            addNewTextElement();
            updateTextControls();
            drawMemeCanvas();
        });
        
        buttonGroup.appendChild(addTextBtn);
        textSection.appendChild(buttonGroup);
        
        // Add text list container
        const textListContainer = document.createElement('div');
        textListContainer.id = 'textListContainer';
        textListContainer.style.marginTop = '15px';
        textSection.appendChild(textListContainer);
        
        // Initialize text list
        updateTextList();
        
        // Recreate icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }
}

function updateTextList() {
    const textListContainer = document.getElementById('textListContainer');
    if (!textListContainer) return;
    
    textListContainer.innerHTML = '';
    
    // Add a label
    const label = document.createElement('label');
    label.textContent = 'Text Elements';
    label.style.display = 'block';
    label.style.marginBottom = '8px';
    label.style.fontWeight = '500';
    textListContainer.appendChild(label);
    
    // Create list of text elements
    memeState.textElements.forEach((textElement, index) => {
        const textItem = document.createElement('div');
        textItem.className = 'text-list-item';
        textItem.style.display = 'flex';
        textItem.style.alignItems = 'center';
        textItem.style.gap = '8px';
        textItem.style.padding = '8px';
        textItem.style.marginBottom = '6px';
        textItem.style.borderRadius = '6px';
        textItem.style.cursor = 'pointer';
        textItem.style.transition = 'all 0.2s';
        
        if (textElement.selected) {
            textItem.style.backgroundColor = 'var(--color-primary-alpha)';
            textItem.style.border = '2px solid var(--color-primary)';
        } else {
            textItem.style.backgroundColor = 'var(--color-surface)';
            textItem.style.border = '2px solid transparent';
        }
        
        // Text preview
        const textPreview = document.createElement('div');
        textPreview.style.flex = '1';
        textPreview.style.overflow = 'hidden';
        textPreview.style.textOverflow = 'ellipsis';
        textPreview.style.whiteSpace = 'nowrap';
        textPreview.textContent = textElement.text || 'Empty text';
        textPreview.style.fontSize = '14px';
        
        // Click to select
        textItem.addEventListener('click', () => {
            selectTextElement(textElement.id);
            updateTextControls();
            drawMemeCanvas();
        });
        
        textItem.appendChild(textPreview);
        
        // Drag handle button
        const dragBtn = document.createElement('button');
        dragBtn.className = 'btn-icon-small';
        dragBtn.innerHTML = '<i data-lucide="grip-vertical" style="width: 16px; height: 16px;"></i>';
        dragBtn.style.padding = '4px';
        dragBtn.style.minWidth = '28px';
        dragBtn.style.height = '28px';
        dragBtn.style.backgroundColor = '#4CAF50';
        dragBtn.style.color = 'white';
        dragBtn.style.border = 'none';
        dragBtn.style.borderRadius = '4px';
        dragBtn.style.cursor = 'move';
        dragBtn.style.display = 'flex';
        dragBtn.style.alignItems = 'center';
        dragBtn.style.justifyContent = 'center';
        dragBtn.title = 'Click and drag to reorder';
        
        // Store text element reference
        dragBtn.dataset.textId = textElement.id;
        
        let isDraggingList = false;
        let dragStartY = 0;
        let draggedItem = null;
        let placeholder = null;
        
        // Mouse down - start dragging
        dragBtn.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            e.preventDefault();
            isDraggingList = true;
            dragStartY = e.clientY;
            draggedItem = textItem;
            
            // Create placeholder
            placeholder = textItem.cloneNode(true);
            placeholder.style.opacity = '0.3';
            placeholder.style.pointerEvents = 'none';
            
            // Make item float
            textItem.style.position = 'relative';
            textItem.style.zIndex = '1000';
            textItem.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            textItem.style.transform = 'scale(1.05)';
            textItem.style.transition = 'transform 0.1s, box-shadow 0.1s';
            
            const handleMouseMove = (e) => {
                if (!isDraggingList) return;
                
                const deltaY = e.clientY - dragStartY;
                textItem.style.transform = `translateY(${deltaY}px) scale(1.05)`;
                
                // Find the item we're hovering over
                const items = Array.from(textListContainer.querySelectorAll('.text-list-item:not([style*="position: relative"])'));
                const afterElement = items.reduce((closest, child) => {
                    const box = child.getBoundingClientRect();
                    const offset = e.clientY - box.top - box.height / 2;
                    
                    if (offset < 0 && offset > closest.offset) {
                        return { offset: offset, element: child };
                    } else {
                        return closest;
                    }
                }, { offset: Number.NEGATIVE_INFINITY }).element;
                
                if (afterElement) {
                    textListContainer.insertBefore(placeholder, afterElement);
                } else {
                    textListContainer.appendChild(placeholder);
                }
            };
            
            const handleMouseUp = (e) => {
                if (!isDraggingList) return;
                isDraggingList = false;
                
                // Reset styles
                textItem.style.position = '';
                textItem.style.zIndex = '';
                textItem.style.boxShadow = '';
                textItem.style.transform = '';
                
                // Reorder in state
                const items = Array.from(textListContainer.querySelectorAll('.text-list-item'));
                const newIndex = items.indexOf(placeholder);
                const oldIndex = memeState.textElements.findIndex(t => t.id === textElement.id);
                
                if (newIndex !== -1 && oldIndex !== -1 && newIndex !== oldIndex) {
                    const [movedElement] = memeState.textElements.splice(oldIndex, 1);
                    memeState.textElements.splice(newIndex, 0, movedElement);
                    updateTextList();
                    drawMemeCanvas();
                }
                
                // Remove placeholder
                if (placeholder && placeholder.parentNode) {
                    placeholder.parentNode.removeChild(placeholder);
                }
                placeholder = null;
                
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });
        
        textItem.appendChild(dragBtn);
        
        // Delete button (only if not the last element)
        if (memeState.textElements.length > 1) {
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-icon-small';
            deleteBtn.innerHTML = '<i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>';
            deleteBtn.style.padding = '4px';
            deleteBtn.style.minWidth = '28px';
            deleteBtn.style.height = '28px';
            deleteBtn.style.backgroundColor = '#ff4444';
            deleteBtn.style.color = 'white';
            deleteBtn.style.border = 'none';
            deleteBtn.style.borderRadius = '4px';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.style.display = 'flex';
            deleteBtn.style.alignItems = 'center';
            deleteBtn.style.justifyContent = 'center';
            deleteBtn.title = 'Delete text';
            
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTextElement(textElement.id);
                updateTextControls();
                drawMemeCanvas();
            });
            
            textItem.appendChild(deleteBtn);
        }
        
        textListContainer.appendChild(textItem);
    });
    
    // Recreate icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

async function handleMemeImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        await handleMemeImageFile(file);
    }
}

async function handleMemeImageFile(file) {
    try {
        const img = await loadImage(file);
        memeState.backgroundImage = img;
        memeState.backgroundImageData = file;
        // Reset image offset when new image is uploaded
        memeState.backgroundImageOffset = { x: 0, y: 0 };
        
        // Resize canvas to match image dimensions
        const imageWidth = img.naturalWidth || img.width;
        const imageHeight = img.naturalHeight || img.height;
        
        memeState.canvasWidth = imageWidth;
        memeState.canvasHeight = imageHeight;
        memeState.exportWidth = imageWidth;
        memeState.exportHeight = imageHeight;
        
        // Update canvas element size
        if (memeCanvas) {
            memeCanvas.width = imageWidth;
            memeCanvas.height = imageHeight;
        }
        
        // Update text element positions to be centered in new canvas
        memeState.textElements.forEach(textElement => {
            textElement.x = imageWidth / 2;
            textElement.y = imageHeight / 2;
        });
        
        // Add or update custom size option in export preset dropdowns
        updateExportPresetWithImageSize(imageWidth, imageHeight);
        
        // Show remove button
        const removeImageBtn = document.getElementById('removeImageBtn');
        if (removeImageBtn) {
            removeImageBtn.style.display = 'block';
            // Recreate icon
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
        
        // Update upload area to show success with text overflow handling
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
        
        drawMemeCanvas();
    } catch (error) {
        console.error('Error loading image:', error);
    }
}

function removeBackgroundImage() {
    // Clear background image
    memeState.backgroundImage = null;
    memeState.backgroundImageData = null;
    memeState.backgroundImageOffset = { x: 0, y: 0 };
    
    // Reset canvas to default size
    const defaultWidth = 500;
    const defaultHeight = 500;
    
    memeState.canvasWidth = defaultWidth;
    memeState.canvasHeight = defaultHeight;
    memeState.exportWidth = defaultWidth;
    memeState.exportHeight = defaultHeight;
    
    if (memeCanvas) {
        memeCanvas.width = defaultWidth;
        memeCanvas.height = defaultHeight;
    }
    
    // Update text element positions to be centered
    memeState.textElements.forEach(textElement => {
        textElement.x = defaultWidth / 2;
        textElement.y = defaultHeight / 2;
    });
    
    // Reset export preset to default
    const presetSelects = [
        document.getElementById('exportSizePreset'),
        document.getElementById('exportSizePresetDesktop'),
        document.getElementById('exportSizePresetMobile')
    ];
    
    presetSelects.forEach(select => {
        if (!select) return;
        
        // Remove image size option if it exists
        const imageOption = select.querySelector('option[data-image-size="true"]');
        if (imageOption) {
            imageOption.remove();
        }
        
        // Select default size
        select.value = '500x500';
    });
    
    // Hide remove button
    const removeImageBtn = document.getElementById('removeImageBtn');
    if (removeImageBtn) {
        removeImageBtn.style.display = 'none';
    }
    
    // Reset upload area
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
    
    // Reset file input
    const imageUpload = document.getElementById('imageUpload');
    if (imageUpload) {
        imageUpload.value = '';
    }
    
    // Redraw canvas
    drawMemeCanvas();
}

function updateExportPresetWithImageSize(width, height) {
    const sizeValue = `${width}x${height}`;
    const sizeLabel = `${width}×${height} (Image Size)`;
    
    // Update all export size preset dropdowns
    const presetSelects = [
        document.getElementById('exportSizePreset'),
        document.getElementById('exportSizePresetDesktop'),
        document.getElementById('exportSizePresetMobile')
    ];
    
    presetSelects.forEach(select => {
        if (!select) return;
        
        // Remove previous "Image Size" option if it exists
        const existingOption = select.querySelector('option[data-image-size="true"]');
        if (existingOption) {
            existingOption.remove();
        }
        
        // Add new image size option at the top (after "Custom Size")
        const option = document.createElement('option');
        option.value = sizeValue;
        option.textContent = sizeLabel;
        option.setAttribute('data-image-size', 'true');
        
        // Insert after the custom option (position 1)
        if (select.options.length > 1) {
            select.insertBefore(option, select.options[1]);
        } else {
            select.appendChild(option);
        }
        
        // Select this option
        select.value = sizeValue;
    });
    
    // Update custom width/height inputs
    const widthInputs = [
        document.getElementById('customExportWidth'),
        document.getElementById('customExportWidthDesktop'),
        document.getElementById('customExportWidthMobile')
    ];
    
    const heightInputs = [
        document.getElementById('customExportHeight'),
        document.getElementById('customExportHeightDesktop'),
        document.getElementById('customExportHeightMobile')
    ];
    
    widthInputs.forEach(input => {
        if (input) input.value = width;
    });
    
    heightInputs.forEach(input => {
        if (input) input.value = height;
    });
}

// Gallery functions
function saveToMemeGallery() {
    if (!memeGalleryManager) {
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
        thumbnailCtx.drawImage(memeCanvas, 0, 0, thumbnailSize, thumbnailSize);
        const thumbnailDataUrl = thumbnailCanvas.toDataURL('image/png');
        
        // Prepare state for saving
        const stateToSave = {
            textElements: memeState.textElements.map(t => ({...t})),
            stickers: memeState.stickers.map(s => ({...s})),
            backgroundColor: memeState.backgroundColor,
            backgroundImage: memeState.backgroundImage ? {
                src: memeState.backgroundImage.src,
                width: memeState.backgroundImage.width,
                height: memeState.backgroundImage.height
            } : null,
            backgroundImageData: memeState.backgroundImageData,
            canvasWidth: memeState.canvasWidth,
            canvasHeight: memeState.canvasHeight,
            imageOpacity: memeState.imageOpacity,
            blendMode: memeState.blendMode,
            aesthetic: memeState.aesthetic,
            aestheticIntensity: memeState.aestheticIntensity
        };
        
        // Save to gallery
        const itemId = memeGalleryManager.saveToGallery(thumbnailDataUrl, stateToSave);
        
        console.log('Meme saved to gallery with ID:', itemId);
    } catch (error) {
        console.error('Failed to save meme to gallery:', error);
    }
}

function initMemeGallery() {
    // Initialize gallery manager with mobile and desktop containers
    const mobileGalleryContainer = document.getElementById('galleryGrid');
    const desktopGalleryContainer = document.getElementById('galleryGridDesktop');
    
    // Initialize gallery manager with correct parameter order (mobile, desktop)
    if (typeof MemeGalleryManager !== 'undefined' && (mobileGalleryContainer || desktopGalleryContainer)) {
        window.memeGalleryManager = new MemeGalleryManager(desktopGalleryContainer, mobileGalleryContainer);
    } else {
        console.error('MemeGalleryManager not found or gallery containers not found');
    }
    
    // Initialize save buttons (desktop and mobile)
    const saveToGalleryBtn = document.getElementById('saveToGalleryBtn');
    const saveToGalleryBtnMobile = document.getElementById('saveToGalleryBtnMobile');
    
    if (saveToGalleryBtn) {
        saveToGalleryBtn.addEventListener('click', saveToMemeGallery);
    }
    
    if (saveToGalleryBtnMobile) {
        saveToGalleryBtnMobile.addEventListener('click', saveToMemeGallery);
    }
}