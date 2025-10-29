// Canvas rendering for Album Cover Generator

let canvas, ctx;

function initCanvas() {
    canvas = document.getElementById('previewCanvas');
    ctx = canvas.getContext('2d');
    
    // Set initial canvas size
    canvas.width = albumState.canvasWidth;
    canvas.height = albumState.canvasHeight;
    
    // Initial draw
    drawCanvas();
}

function drawCanvas() {
    if (!canvas || !ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Save context
    ctx.save();
    
    // Draw background
    drawBackground();
    
    // Draw text
    drawText();
    
    // Restore context
    ctx.restore();
}

function drawBackground() {
    // If no background image or invalid image, draw solid color or default
    if (!albumState.backgroundImage || !isValidImageObject(albumState.backgroundImage)) {
        ctx.fillStyle = albumState.colorOverlay ? albumState.overlayColor : '#8ACE00';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return;
    }
    
    // Calculate image dimensions to fit canvas while maintaining aspect ratio
    const img = albumState.backgroundImage;
    const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    const x = (canvas.width - scaledWidth) / 2;
    const y = (canvas.height - scaledHeight) / 2;
    
    // Create temporary canvas for image processing
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    
    // Draw image with opacity
    tempCtx.globalAlpha = albumState.imageOpacity / 100;
    
    // Apply blur if needed
    if (albumState.imageBlur > 0) {
        tempCtx.filter = `blur(${albumState.imageBlur}px)`;
    }
    
    tempCtx.drawImage(img, x, y, scaledWidth, scaledHeight);
    
    // Draw the processed image to main canvas
    ctx.drawImage(tempCanvas, 0, 0);
    
    // Apply color overlay if enabled
    if (albumState.colorOverlay) {
        const rgb = hexToRgb(albumState.overlayColor);
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${albumState.overlayOpacity / 100})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// Helper function to check if an object is a valid image for canvas drawing
function isValidImageObject(obj) {
    return obj instanceof HTMLImageElement || 
           obj instanceof HTMLCanvasElement || 
           obj instanceof HTMLVideoElement || 
           obj instanceof ImageBitmap ||
           (obj && obj.complete !== false && obj.naturalWidth > 0);
}

function wrapText(text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const testLine = currentLine ? currentLine + ' ' + word : word;
        const testWidth = ctx.measureText(testLine).width;
        
        if (testWidth > maxWidth && currentLine !== '') {
            lines.push(currentLine);
            
            if (ctx.measureText(word).width > maxWidth) {
                let wordLine = '';
                for (let char of word) {
                    const testChar = wordLine + char;
                    if (ctx.measureText(testChar).width > maxWidth && wordLine !== '') {
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
            let wordLine = '';
            for (let char of word) {
                const testChar = wordLine + char;
                if (ctx.measureText(testChar).width > maxWidth && wordLine !== '') {
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
    
    return lines.length > 0 ? lines : [text];
}

function drawText() {
    if (!albumState.text.trim()) return;
    
    ctx.save();
    
    // Set font
    const fontFamily = fontMap[albumState.fontFamily] || 'Inter';
    ctx.font = `${albumState.fontSize}px "${fontFamily}"`;
    
    // Set text alignment
    if (albumState.textAlignment === 'center') {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
    } else if (albumState.textAlignment === 'left') {
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
    } else {
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
    }
    
    // Calculate text position with padding
    const padding = 40;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let x;
    
    if (albumState.textAlignment === 'center') {
        x = centerX;
    } else if (albumState.textAlignment === 'left') {
        x = padding;
    } else {
        x = canvas.width - padding;
    }
    
    // Calculate max width for text wrapping
    const maxWidth = canvas.width - (padding * 2);
    const lines = wrapText(albumState.text, maxWidth);
    
    // Calculate line height and total text height
    const lineHeight = albumState.fontSize * 1.2;
    const totalHeight = lineHeight * lines.length;
    
    // Calculate starting Y position with padding constraints
    let startY = centerY - (totalHeight / 2) + (lineHeight / 2);
    
    // Ensure text doesn't overflow top or bottom with padding
    const minY = padding + (lineHeight / 2);
    const maxY = canvas.height - padding - totalHeight + (lineHeight / 2);
    
    // Constrain startY within bounds
    if (startY < minY) {
        startY = minY;
    } else if (startY > maxY && maxY > minY) {
        startY = maxY;
    }
    
    // Apply letter spacing
    if (albumState.letterSpacing !== 0) {
        drawTextWithLetterSpacingWrapped(lines, x, startY, lineHeight);
    } else {
        drawTextNormalWrapped(lines, x, startY, lineHeight);
    }
    
    ctx.restore();
}

function drawTextNormalWrapped(lines, x, startY, lineHeight) {
    let currentY = startY;
    
    lines.forEach(line => {
        // Apply text shadow if enabled
        if (albumState.shadow) {
            ctx.save();
            const shadowRgb = hexToRgb(albumState.shadowColor);
            ctx.shadowColor = `rgba(${shadowRgb.r}, ${shadowRgb.g}, ${shadowRgb.b}, ${albumState.shadowOpacity / 100})`;
            ctx.shadowOffsetX = albumState.shadowX;
            ctx.shadowOffsetY = albumState.shadowY;
            ctx.shadowBlur = albumState.shadowBlur;
        }
        
        // Apply special effects
        applyTextEffect(ctx, albumState.effect, albumState.textColor);
        
        // Draw outline if enabled
        if (albumState.outline !== 'none') {
            const outlineWidth = getOutlineWidth(albumState.outline);
            if (outlineWidth > 0) {
                ctx.strokeStyle = albumState.outlineColor;
                ctx.lineWidth = outlineWidth;
                
                if (albumState.outline === 'dashed') {
                    ctx.setLineDash([5, 5]);
                } else if (albumState.outline === 'double') {
                    // Draw double outline
                    ctx.lineWidth = outlineWidth;
                    ctx.strokeText(line, x, currentY);
                    ctx.lineWidth = outlineWidth / 2;
                    ctx.strokeStyle = albumState.textColor;
                    ctx.strokeText(line, x, currentY);
                } else {
                    ctx.strokeText(line, x, currentY);
                }
            }
        }
        
        // Draw text fill
        if (albumState.effect === 'none') {
            ctx.fillStyle = albumState.textColor;
        }
        ctx.fillText(line, x, currentY);
        
        if (albumState.shadow) {
            ctx.restore();
        }
        
        currentY += lineHeight;
    });
}

function drawTextNormal(text, x, y) {
    // Apply text shadow if enabled
    if (albumState.shadow) {
        ctx.save();
        const shadowRgb = hexToRgb(albumState.shadowColor);
        ctx.shadowColor = `rgba(${shadowRgb.r}, ${shadowRgb.g}, ${shadowRgb.b}, ${albumState.shadowOpacity / 100})`;
        ctx.shadowOffsetX = albumState.shadowX;
        ctx.shadowOffsetY = albumState.shadowY;
        ctx.shadowBlur = albumState.shadowBlur;
    }
    
    // Apply special effects
    applyTextEffect(ctx, albumState.effect, albumState.textColor);
    
    // Draw outline if enabled
    if (albumState.outline !== 'none') {
        const outlineWidth = getOutlineWidth(albumState.outline);
        if (outlineWidth > 0) {
            ctx.strokeStyle = albumState.outlineColor;
            ctx.lineWidth = outlineWidth;
            
            if (albumState.outline === 'dashed') {
                ctx.setLineDash([5, 5]);
            } else if (albumState.outline === 'double') {
                // Draw double outline
                ctx.lineWidth = outlineWidth;
                ctx.strokeText(text, x, y);
                ctx.lineWidth = outlineWidth / 2;
                ctx.strokeStyle = albumState.textColor;
                ctx.strokeText(text, x, y);
            } else {
                ctx.strokeText(text, x, y);
            }
        }
    }
    
    // Draw text fill
    if (albumState.effect === 'none') {
        ctx.fillStyle = albumState.textColor;
    }
    ctx.fillText(text, x, y);
    
    if (albumState.shadow) {
        ctx.restore();
    }
}

function drawTextWithLetterSpacingWrapped(lines, x, startY, lineHeight) {
    let currentY = startY;
    const spacing = albumState.letterSpacing;
    
    lines.forEach(line => {
        let currentX = x;
        
        // Adjust starting position for alignment
        if (albumState.textAlignment === 'center') {
            const totalWidth = getTextWidthWithSpacing(line, spacing);
            currentX = x - totalWidth / 2;
        } else if (albumState.textAlignment === 'right') {
            const totalWidth = getTextWidthWithSpacing(line, spacing);
            currentX = x - totalWidth;
        }
        
        // Draw each character
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            // Apply effects and draw character
            ctx.save();
            
            if (albumState.shadow) {
                const shadowRgb = hexToRgb(albumState.shadowColor);
                ctx.shadowColor = `rgba(${shadowRgb.r}, ${shadowRgb.g}, ${shadowRgb.b}, ${albumState.shadowOpacity / 100})`;
                ctx.shadowOffsetX = albumState.shadowX;
                ctx.shadowOffsetY = albumState.shadowY;
                ctx.shadowBlur = albumState.shadowBlur;
            }
            
            applyTextEffect(ctx, albumState.effect, albumState.textColor);
            
            // Draw outline
            if (albumState.outline !== 'none') {
                const outlineWidth = getOutlineWidth(albumState.outline);
                if (outlineWidth > 0) {
                    ctx.strokeStyle = albumState.outlineColor;
                    ctx.lineWidth = outlineWidth;
                    ctx.strokeText(char, currentX, currentY);
                }
            }
            
            // Draw character
            if (albumState.effect === 'none') {
                ctx.fillStyle = albumState.textColor;
            }
            ctx.fillText(char, currentX, currentY);
            
            ctx.restore();
            
            // Move to next character position
            const charWidth = ctx.measureText(char).width;
            currentX += charWidth + spacing;
        }
        
        currentY += lineHeight;
    });
}

function drawTextWithLetterSpacing(text, startX, y) {
    let currentX = startX;
    const spacing = albumState.letterSpacing;
    
    // Adjust starting position for alignment
    if (albumState.textAlignment === 'center') {
        const totalWidth = getTextWidthWithSpacing(text, spacing);
        currentX = startX - totalWidth / 2;
    } else if (albumState.textAlignment === 'right') {
        const totalWidth = getTextWidthWithSpacing(text, spacing);
        currentX = startX - totalWidth;
    }
    
    // Draw each character
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        
        // Apply effects and draw character
        ctx.save();
        
        if (albumState.shadow) {
            const shadowRgb = hexToRgb(albumState.shadowColor);
            ctx.shadowColor = `rgba(${shadowRgb.r}, ${shadowRgb.g}, ${shadowRgb.b}, ${albumState.shadowOpacity / 100})`;
            ctx.shadowOffsetX = albumState.shadowX;
            ctx.shadowOffsetY = albumState.shadowY;
            ctx.shadowBlur = albumState.shadowBlur;
        }
        
        applyTextEffect(ctx, albumState.effect, albumState.textColor);
        
        // Draw outline
        if (albumState.outline !== 'none') {
            const outlineWidth = getOutlineWidth(albumState.outline);
            if (outlineWidth > 0) {
                ctx.strokeStyle = albumState.outlineColor;
                ctx.lineWidth = outlineWidth;
                ctx.strokeText(char, currentX, y);
            }
        }
        
        // Draw character
        if (albumState.effect === 'none') {
            ctx.fillStyle = albumState.textColor;
        }
        ctx.fillText(char, currentX, y);
        
        ctx.restore();
        
        // Move to next character position
        const charWidth = ctx.measureText(char).width;
        currentX += charWidth + spacing;
    }
}

function getTextWidthWithSpacing(text, spacing) {
    let totalWidth = 0;
    for (let i = 0; i < text.length; i++) {
        const charWidth = ctx.measureText(text[i]).width;
        totalWidth += charWidth;
        if (i < text.length - 1) {
            totalWidth += spacing;
        }
    }
    return totalWidth;
}

function getOutlineWidth(outlineType) {
    switch (outlineType) {
        case 'thin': return 2;
        case 'medium': return 4;
        case 'thick': return 8;
        case 'double': return 6;
        case 'dashed': return 3;
        default: return 0;
    }
}

// Handle canvas resizing
function resizeCanvas(width, height) {
    albumState.canvasWidth = width;
    albumState.canvasHeight = height;
    canvas.width = width;
    canvas.height = height;
    drawCanvas();
}