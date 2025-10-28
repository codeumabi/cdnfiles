// Canvas rendering for Meme Generator

let memeCanvas, memeCtx;

function initMemeCanvas() {
    memeCanvas = document.getElementById('previewCanvas');
    memeCtx = memeCanvas.getContext('2d');
    
    // Set initial canvas size
    memeCanvas.width = memeState.canvasWidth;
    memeCanvas.height = memeState.canvasHeight;
    
    // Initial draw
    drawMemeCanvas();
}

function drawMemeCanvas() {
    if (!memeCanvas || !memeCtx) return;
    
    // Clear canvas
    memeCtx.clearRect(0, 0, memeCanvas.width, memeCanvas.height);
    
    // Save context
    memeCtx.save();
    
    // Draw background
    drawMemeBackground();
    
    // Apply aesthetic effects
    applyAestheticEffect();
    
    // Draw text
    drawMemeText();
    
    // Draw stickers
    drawStickers();
    
    // Restore context
    memeCtx.restore();
}

function drawMemeBackground() {
    // Draw background color first (only if enabled)
    if (memeState.backgroundColorEnabled) {
        memeCtx.fillStyle = memeState.backgroundColor;
        memeCtx.fillRect(0, 0, memeCanvas.width, memeCanvas.height);
    } else {
        // Clear to transparent if background color is disabled
        memeCtx.clearRect(0, 0, memeCanvas.width, memeCanvas.height);
    }
    
    // If no background image or invalid image, just show the color
    if (!memeState.backgroundImage || !isValidImageObject(memeState.backgroundImage)) {
        return;
    }
    
    // Calculate image dimensions to fit canvas while maintaining aspect ratio
    const img = memeState.backgroundImage;
    const scale = Math.max(memeCanvas.width / img.width, memeCanvas.height / img.height);
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    
    // Apply image offset for dragging functionality
    const x = (memeCanvas.width - scaledWidth) / 2 + memeState.backgroundImageOffset.x;
    const y = (memeCanvas.height - scaledHeight) / 2 + memeState.backgroundImageOffset.y;
    
    // Apply blend mode and opacity
    memeCtx.globalAlpha = memeState.imageOpacity / 100;
    memeCtx.globalCompositeOperation = memeState.blendMode;
    
    memeCtx.drawImage(img, x, y, scaledWidth, scaledHeight);
    
    // Reset composition
    memeCtx.globalAlpha = 1;
    memeCtx.globalCompositeOperation = 'source-over';
}

// Helper function to check if an object is a valid image for canvas drawing
function isValidImageObject(obj) {
    return obj instanceof HTMLImageElement || 
           obj instanceof HTMLCanvasElement || 
           obj instanceof HTMLVideoElement || 
           obj instanceof ImageBitmap ||
           (obj && obj.complete !== false && obj.naturalWidth > 0);
}

function applyAestheticEffect() {
    if (!memeState.aesthetic) return;
    
    const aesthetic = bratAesthetics[memeState.aesthetic];
    if (!aesthetic) return;
    
    switch (aesthetic.effect) {
        case 'glitter':
            applyGlitterEffect(memeCtx, memeCanvas.width, memeCanvas.height, memeState.aestheticIntensity);
            break;
        case 'sparkles':
            applySparklesEffect(memeCtx, memeCanvas.width, memeCanvas.height, memeState.aestheticIntensity);
            break;
        case 'rhinestones':
            applyRhinestonesEffect(memeCtx, memeCanvas.width, memeCanvas.height, memeState.aestheticIntensity);
            break;
        case 'neon-pink':
            applyNeonPinkEffect(memeCtx, memeCanvas.width, memeCanvas.height, memeState.aestheticIntensity);
            break;
        case 'holographic':
            applyHolographicEffect(memeCtx, memeCanvas.width, memeCanvas.height, memeState.aestheticIntensity);
            break;
        case 'chrome':
        case 'metallic':
        case 'iridescent':
        case 'galaxy':
        case 'rainbow':
            // These effects are applied to text, not background
            break;
    }
}

function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
        let word = words[i];
        
        // Check if the word itself is too long to fit on one line
        while (ctx.measureText(word).width > maxWidth) {
            // Break the word into chunks that fit
            let chunk = '';
            for (let char of word) {
                const testChunk = chunk + char;
                if (ctx.measureText(testChunk).width <= maxWidth) {
                    chunk += char;
                } else {
                    // Push the chunk as a line if we have content
                    if (chunk) {
                        if (currentLine) {
                            lines.push(currentLine);
                            currentLine = '';
                        }
                        lines.push(chunk);
                    }
                    chunk = char;
                }
            }
            // Set the remaining chunk as the word
            word = chunk;
        }
        
        // Now handle the word (or remaining chunk) normally
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const width = ctx.measureText(testLine).width;
        
        if (width <= maxWidth || !currentLine) {
            currentLine = testLine;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    
    if (currentLine) {
        lines.push(currentLine);
    }
    
    return lines;
}

function getWrappedTextDimensions(ctx, textElement) {
    const maxWidth = memeCanvas.width - 40;
    const lines = wrapText(ctx, textElement.text, maxWidth);
    const lineHeight = textElement.fontSize * 1.2;
    
    let maxLineWidth = 0;
    lines.forEach(line => {
        const lineWidth = ctx.measureText(line).width;
        if (lineWidth > maxLineWidth) maxLineWidth = lineWidth;
    });
    
    return {
        width: maxLineWidth,
        height: lines.length * lineHeight,
        lines: lines,
        lineHeight: lineHeight
    };
}

function drawMemeText() {
    [...memeState.textElements].reverse().forEach(textElement => {
        if (!textElement.text.trim()) return;
        
        memeCtx.save();
        
        // Set font
        const fontFamily = bubbleFontMap[textElement.fontFamily] || 'Fredoka One';
        memeCtx.font = `${textElement.fontSize}px "${fontFamily}"`;
        
        // Set text alignment
        memeCtx.textAlign = 'center';
        memeCtx.textBaseline = 'middle';
        
        // Use text element position
        const x = textElement.x;
        const y = textElement.y;
        
        // Calculate max width for wrapping (canvas width minus padding)
        const maxWidth = memeCanvas.width - 40;
        const lines = wrapText(memeCtx, textElement.text, maxWidth);
        const lineHeight = textElement.fontSize * 1.2;
        
        // Calculate total text height
        const totalHeight = lines.length * lineHeight;
        const startY = y - (totalHeight / 2) + (lineHeight / 2);
        
        // Apply text shadow if enabled
        if (memeState.shadow) {
            memeCtx.shadowColor = memeState.shadowColor;
            memeCtx.shadowOffsetX = memeState.shadowX;
            memeCtx.shadowOffsetY = memeState.shadowY;
            memeCtx.shadowBlur = memeState.shadowBlur;
        }
        
        // Draw each line
        lines.forEach((line, index) => {
            const lineY = startY + (index * lineHeight);
            
            // Draw outline if enabled
            if (memeState.outline && memeState.outlineWidth > 0) {
                memeCtx.strokeStyle = memeState.outlineColor;
                memeCtx.lineWidth = memeState.outlineWidth;
                memeCtx.lineJoin = 'round';
                memeCtx.strokeText(line, x, lineY);
            }
            
            // Apply text style for each line
            applyTextStyleForElement(memeCtx, textElement, x, lineY);
            
            // Draw text fill
            memeCtx.fillText(line, x, lineY);
        });
        
        // Draw selection indicator if selected (using wrapped text dimensions)
        if (textElement.selected) {
            drawSelectionBoxWrapped(x, y, textElement, lines, lineHeight);
        }
        
        memeCtx.restore();
    });
}

function applyTextStyleForElement(ctx, textElement, x, y) {
    const textMetrics = ctx.measureText(textElement.text);
    const textWidth = textMetrics.width;
    const textHeight = textElement.fontSize;
    
    switch (textElement.textStyle) {
        case 'bubble':
            ctx.fillStyle = createBubbleTextGradient(ctx, textElement.textColor, textWidth, textHeight);
            break;
        case 'glossy':
            ctx.fillStyle = createGlossyTextGradient(ctx, textElement.textColor, textWidth, textHeight);
            break;
        case 'gradient':
            ctx.fillStyle = createRainbowGradient(ctx, textWidth);
            break;
        case 'chrome':
            ctx.fillStyle = createChromeTextGradient(ctx, textWidth, textHeight);
            break;
        default:
            ctx.fillStyle = textElement.textColor;
            break;
    }
}

function drawSelectionBox(x, y, textElement) {
    const textMetrics = memeCtx.measureText(textElement.text);
    const textWidth = textMetrics.width;
    const textHeight = textElement.fontSize;
    
    memeCtx.save();
    memeCtx.strokeStyle = '#00ffff';
    memeCtx.lineWidth = 2;
    memeCtx.setLineDash([5, 5]);
    memeCtx.strokeRect(
        x - textWidth/2 - 10, 
        y - textHeight/2 - 10, 
        textWidth + 20, 
        textHeight + 20
    );
    
    memeCtx.setLineDash([]);
    
    // Draw resize handle as a circle/dot at bottom-right
    const handleRadius = 6;
    memeCtx.fillStyle = '#00ffff';
    memeCtx.beginPath();
    memeCtx.arc(
        x + textWidth/2 + 10,
        y + textHeight/2 + 10,
        handleRadius,
        0,
        Math.PI * 2
    );
    memeCtx.fill();
    
    // Draw delete button (X) at top-right corner
    const deleteButtonSize = 20;
    const deleteX = x + textWidth/2 + 10;
    const deleteY = y - textHeight/2 - 10;
    
    // Delete button background
    memeCtx.fillStyle = '#ff4444';
    memeCtx.fillRect(
        deleteX - deleteButtonSize/2,
        deleteY - deleteButtonSize/2,
        deleteButtonSize,
        deleteButtonSize
    );
    
    // Delete button X
    memeCtx.strokeStyle = '#ffffff';
    memeCtx.lineWidth = 3;
    memeCtx.beginPath();
    memeCtx.moveTo(deleteX - 6, deleteY - 6);
    memeCtx.lineTo(deleteX + 6, deleteY + 6);
    memeCtx.moveTo(deleteX + 6, deleteY - 6);
    memeCtx.lineTo(deleteX - 6, deleteY + 6);
    memeCtx.stroke();
    
    memeCtx.restore();
}

function drawSelectionBoxWrapped(x, y, textElement, lines, lineHeight) {
    // Calculate the widest line
    let maxWidth = 0;
    lines.forEach(line => {
        const lineWidth = memeCtx.measureText(line).width;
        if (lineWidth > maxWidth) maxWidth = lineWidth;
    });
    
    const totalHeight = lines.length * lineHeight;
    
    memeCtx.save();
    memeCtx.strokeStyle = '#00ffff';
    memeCtx.lineWidth = 2;
    memeCtx.setLineDash([5, 5]);
    memeCtx.strokeRect(
        x - maxWidth/2 - 10, 
        y - totalHeight/2 - 10, 
        maxWidth + 20, 
        totalHeight + 20
    );
    
    memeCtx.setLineDash([]);
    
    // Draw resize handle as a circle/dot at bottom-right
    const handleRadius = 6;
    memeCtx.fillStyle = '#00ffff';
    memeCtx.beginPath();
    memeCtx.arc(
        x + maxWidth/2 + 10,
        y + totalHeight/2 + 10,
        handleRadius,
        0,
        Math.PI * 2
    );
    memeCtx.fill();
    
    // Draw delete button (X) at top-right corner
    const deleteButtonSize = 20;
    const deleteX = x + maxWidth/2 + 10;
    const deleteY = y - totalHeight/2 - 10;
    
    // Delete button background
    memeCtx.fillStyle = '#ff4444';
    memeCtx.fillRect(
        deleteX - deleteButtonSize/2,
        deleteY - deleteButtonSize/2,
        deleteButtonSize,
        deleteButtonSize
    );
    
    // Delete button X
    memeCtx.strokeStyle = '#ffffff';
    memeCtx.lineWidth = 3;
    memeCtx.beginPath();
    memeCtx.moveTo(deleteX - 6, deleteY - 6);
    memeCtx.lineTo(deleteX + 6, deleteY + 6);
    memeCtx.moveTo(deleteX + 6, deleteY - 6);
    memeCtx.lineTo(deleteX - 6, deleteY + 6);
    memeCtx.stroke();
    
    memeCtx.restore();
}

function drawStickers() {
    memeState.stickers.forEach(sticker => {
        drawEmojiSticker(memeCtx, sticker.emoji, sticker.x, sticker.y, sticker.size);
        
        // Draw selection indicator if selected
        if (sticker.id === memeState.selectedSticker) {
            memeCtx.save();
            memeCtx.strokeStyle = '#00ffff';
            memeCtx.lineWidth = 2;
            memeCtx.setLineDash([3, 3]);
            memeCtx.beginPath();
            memeCtx.arc(sticker.x, sticker.y, sticker.size/2 + 5, 0, Math.PI * 2);
            memeCtx.stroke();
            
            memeCtx.setLineDash([]);
            
            // Draw resize handle as a circle/dot at bottom-right
            const handleRadius = 6;
            memeCtx.fillStyle = '#00ffff';
            memeCtx.beginPath();
            memeCtx.arc(
                sticker.x + sticker.size/2 + 5,
                sticker.y + sticker.size/2 + 5,
                handleRadius,
                0,
                Math.PI * 2
            );
            memeCtx.fill();
            
            // Draw delete button (X) at top-right
            const deleteButtonSize = 20;
            const deleteX = sticker.x + sticker.size/2 + 10;
            const deleteY = sticker.y - sticker.size/2 - 10;
            
            // Delete button background
            memeCtx.fillStyle = '#ff4444';
            memeCtx.fillRect(
                deleteX - deleteButtonSize/2,
                deleteY - deleteButtonSize/2,
                deleteButtonSize,
                deleteButtonSize
            );
            
            // Delete button X
            memeCtx.strokeStyle = '#ffffff';
            memeCtx.lineWidth = 3;
            memeCtx.beginPath();
            memeCtx.moveTo(deleteX - 6, deleteY - 6);
            memeCtx.lineTo(deleteX + 6, deleteY + 6);
            memeCtx.moveTo(deleteX + 6, deleteY - 6);
            memeCtx.lineTo(deleteX - 6, deleteY + 6);
            memeCtx.stroke();
            
            memeCtx.restore();
        }
    });
}

function addSticker(emoji) {
    const sticker = {
        emoji: emoji,
        x: memeCanvas.width / 2 + (Math.random() - 0.5) * 200,
        y: memeCanvas.height / 2 + (Math.random() - 0.5) * 200,
        size: memeState.stickerSize,
        id: Date.now() + Math.random()
    };
    
    memeState.stickers.push(sticker);
    drawMemeCanvas();
}

function clearAllStickers() {
    memeState.stickers = [];
    drawMemeCanvas();
}

// Handle canvas interactions
function handleCanvasClick(event) {
    const rect = memeCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Scale coordinates to canvas size
    const scaleX = memeCanvas.width / rect.width;
    const scaleY = memeCanvas.height / rect.height;
    const canvasX = x * scaleX;
    const canvasY = y * scaleY;
    
    // First check if clicking on delete buttons for selected sticker
    if (memeState.selectedSticker) {
        const sticker = memeState.stickers.find(s => s.id === memeState.selectedSticker);
        if (sticker) {
            const deleteButtonSize = 20;
            const deleteX = sticker.x + sticker.size/2 + 10;
            const deleteY = sticker.y - sticker.size/2 - 10;
            
            // Make delete button area larger for easier clicking
            const clickPadding = 5;
            if (canvasX >= deleteX - deleteButtonSize/2 - clickPadding && 
                canvasX <= deleteX + deleteButtonSize/2 + clickPadding &&
                canvasY >= deleteY - deleteButtonSize/2 - clickPadding && 
                canvasY <= deleteY + deleteButtonSize/2 + clickPadding) {
                // Delete sticker from canvas
                const stickerIndex = memeState.stickers.findIndex(s => s.id === memeState.selectedSticker);
                if (stickerIndex !== -1) {
                    memeState.stickers.splice(stickerIndex, 1);
                    memeState.selectedSticker = null;
                    showTextEditingControls();
                    drawMemeCanvas();
                    return;
                }
            }
        }
    }
    
    // Check if clicking on delete button for selected text
    const selectedText = memeState.textElements.find(t => t.selected);
    if (selectedText) {
        memeCtx.font = `${selectedText.fontSize}px "${bubbleFontMap[selectedText.fontFamily] || 'Fredoka One'}"`;
        const dims = getWrappedTextDimensions(memeCtx, selectedText);
        
        const deleteButtonSize = 20;
        const deleteX = selectedText.x + dims.width/2 + 10;
        const deleteY = selectedText.y - dims.height/2 - 10;
        
        // Make delete button area larger for easier clicking
        const clickPadding = 5;
        if (canvasX >= deleteX - deleteButtonSize/2 - clickPadding && 
            canvasX <= deleteX + deleteButtonSize/2 + clickPadding &&
            canvasY >= deleteY - deleteButtonSize/2 - clickPadding && 
            canvasY <= deleteY + deleteButtonSize/2 + clickPadding) {
            // Delete text element from canvas
            deleteTextElement(selectedText.id);
            updateTextControls();
            showTextEditingControls();
            drawMemeCanvas();
            return;
        }
    }
    
    // Check if clicking on a sticker
    for (let i = memeState.stickers.length - 1; i >= 0; i--) {
        const sticker = memeState.stickers[i];
        const distance = Math.sqrt(
            Math.pow(canvasX - sticker.x, 2) + Math.pow(canvasY - sticker.y, 2)
        );
        
        if (distance < sticker.size / 2) {
            // Deselect all stickers first
            memeState.selectedSticker = null;
            // Select only this sticker
            memeState.selectedSticker = sticker.id;
            // Deselect text
            memeState.textElements.forEach(t => t.selected = false);
            hideTextEditingControls();
            drawMemeCanvas();
            return;
        }
    }
    
    // Check if clicking on text
    for (let i = memeState.textElements.length - 1; i >= 0; i--) {
        const textElement = memeState.textElements[i];
        memeCtx.font = `${textElement.fontSize}px "${bubbleFontMap[textElement.fontFamily] || 'Fredoka One'}"`;
        const dims = getWrappedTextDimensions(memeCtx, textElement);
        
        if (canvasX >= textElement.x - dims.width/2 - 10 && 
            canvasX <= textElement.x + dims.width/2 + 10 &&
            canvasY >= textElement.y - dims.height/2 - 10 && 
            canvasY <= textElement.y + dims.height/2 + 10) {
            
            selectTextElement(textElement.id);
            // Deselect stickers
            memeState.selectedSticker = null;
            updateTextControls();
            hideTextEditingControls();
            drawMemeCanvas();
            return;
        }
    }
    
    // Deselect everything if clicking empty space
    memeState.selectedSticker = null;
    memeState.textElements.forEach(t => t.selected = false);
    showTextEditingControls();
    drawMemeCanvas();
}

// Mood preset application
function applyMoodPreset(mood) {
    if (!mood || !mood.config) return;
    
    const config = mood.config;
    
    if (config.textColor) {
        memeState.textColor = config.textColor;
        const textColorPicker = document.getElementById('textColorPicker');
        if (textColorPicker) textColorPicker.value = config.textColor;
    }
    
    if (config.aesthetic) {
        memeState.aesthetic = config.aesthetic;
        // Update aesthetic UI
        const aestheticButtons = document.querySelectorAll('.aesthetic-item');
        aestheticButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.aesthetic === config.aesthetic) {
                btn.classList.add('active');
            }
        });
    }
    
    if (config.shadowColor) {
        memeState.shadowColor = config.shadowColor;
        const shadowColorPicker = document.getElementById('shadowColorPicker');
        if (shadowColorPicker) shadowColorPicker.value = config.shadowColor;
    }
    
    drawMemeCanvas();
}

// Handle canvas resizing
function resizeMemeCanvas(width, height) {
    memeState.canvasWidth = width;
    memeState.canvasHeight = height;
    memeCanvas.width = width;
    memeCanvas.height = height;
    drawMemeCanvas();
}