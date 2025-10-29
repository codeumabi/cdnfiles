// Utility functions for Album Cover Generator

// Color utilities
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Image utilities
function loadImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                resolve(img);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Canvas utilities
function applyBlur(canvas, amount) {
    if (amount === 0) return canvas;
    
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    
    tempCtx.filter = `blur(${amount}px)`;
    tempCtx.drawImage(canvas, 0, 0);
    
    return tempCanvas;
}

function createColorOverlay(width, height, color, opacity) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    
    const rgb = hexToRgb(color);
    ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity / 100})`;
    ctx.fillRect(0, 0, width, height);
    
    return canvas;
}

// Text effect utilities
function applyTextEffect(ctx, effect, color) {
    switch (effect) {
        case 'glow':
            ctx.shadowColor = color;
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            break;
        case 'neon':
            ctx.shadowColor = '#00ffff';
            ctx.shadowBlur = 30;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            break;
        case 'vintage':
            ctx.shadowColor = '#8B4513';
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
            break;
        case 'metallic':
            // Create gradient for metallic effect
            const gradient = ctx.createLinearGradient(0, 0, 0, 100);
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(0.5, color);
            gradient.addColorStop(1, '#000000');
            ctx.fillStyle = gradient;
            break;
        case 'fire':
            const fireGradient = ctx.createLinearGradient(0, 0, 0, 100);
            fireGradient.addColorStop(0, '#ffff00');
            fireGradient.addColorStop(0.5, '#ff6600');
            fireGradient.addColorStop(1, '#ff0000');
            ctx.fillStyle = fireGradient;
            break;
        case 'ice':
            const iceGradient = ctx.createLinearGradient(0, 0, 0, 100);
            iceGradient.addColorStop(0, '#ffffff');
            iceGradient.addColorStop(0.5, '#87ceeb');
            iceGradient.addColorStop(1, '#0000ff');
            ctx.fillStyle = iceGradient;
            break;
        case 'rainbow':
            const rainbowGradient = ctx.createLinearGradient(0, 0, 200, 0);
            rainbowGradient.addColorStop(0, '#ff0000');
            rainbowGradient.addColorStop(1/6, '#ff8000');
            rainbowGradient.addColorStop(2/6, '#ffff00');
            rainbowGradient.addColorStop(3/6, '#00ff00');
            rainbowGradient.addColorStop(4/6, '#0080ff');
            rainbowGradient.addColorStop(5/6, '#8000ff');
            rainbowGradient.addColorStop(1, '#ff0080');
            ctx.fillStyle = rainbowGradient;
            break;
        default:
            ctx.fillStyle = color;
            break;
    }
}

// Text outline utilities
function drawTextWithOutline(ctx, text, x, y, fillStyle, outlineStyle, outlineWidth) {
    // Draw outline
    if (outlineWidth > 0) {
        ctx.strokeStyle = outlineStyle;
        ctx.lineWidth = outlineWidth;
        ctx.strokeText(text, x, y);
    }
    
    // Draw fill
    ctx.fillStyle = fillStyle;
    ctx.fillText(text, x, y);
}

// File download utility
function downloadCanvas(canvas, filename, format) {
    const link = document.createElement('a');
    link.download = filename;
    
    if (format === 'jpg') {
        link.href = canvas.toDataURL('image/jpeg', 0.9);
    } else if (format === 'webp') {
        link.href = canvas.toDataURL('image/webp', 0.9);
    } else {
        link.href = canvas.toDataURL('image/png');
    }
    
    link.click();
}

// Copy to clipboard utility
async function copyCanvasToClipboard(canvas) {
    try {
        const blob = await new Promise(resolve => {
            canvas.toBlob(resolve, 'image/png');
        });
        
        await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
        ]);
        
        return true;
    } catch (error) {
        console.error('Failed to copy image to clipboard:', error);
        return false;
    }
}

// Drag and drop utilities
function setupDragAndDrop(element, onFileDropped) {
    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        element.classList.add('drag-over');
    });

    element.addEventListener('dragleave', (e) => {
        e.preventDefault();
        element.classList.remove('drag-over');
    });

    element.addEventListener('drop', (e) => {
        e.preventDefault();
        element.classList.remove('drag-over');
        
        const files = Array.from(e.dataTransfer.files);
        const imageFile = files.find(file => file.type.startsWith('image/'));
        
        if (imageFile) {
            onFileDropped(imageFile);
        }
    });
}