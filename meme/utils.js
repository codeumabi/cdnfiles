// Utility functions for Meme Generator

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

// Text utilities for brat aesthetics
function createBubbleTextGradient(ctx, color, width, height) {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    const rgb = hexToRgb(color);
    
    // Create glossy bubble effect
    gradient.addColorStop(0, `rgba(${rgb.r + 50}, ${rgb.g + 50}, ${rgb.b + 50}, 1)`);
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, `rgba(${Math.max(0, rgb.r - 50)}, ${Math.max(0, rgb.g - 50)}, ${Math.max(0, rgb.b - 50)}, 1)`);
    
    return gradient;
}

function createGlossyTextGradient(ctx, color, width, height) {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    const rgb = hexToRgb(color);
    
    // Create glossy effect
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.3, color);
    gradient.addColorStop(0.7, color);
    gradient.addColorStop(1, `rgba(${Math.max(0, rgb.r - 80)}, ${Math.max(0, rgb.g - 80)}, ${Math.max(0, rgb.b - 80)}, 1)`);
    
    return gradient;
}

function createChromeTextGradient(ctx, width, height) {
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    
    // Chrome effect
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.2, '#e0e0e0');
    gradient.addColorStop(0.4, '#c0c0c0');
    gradient.addColorStop(0.6, '#a0a0a0');
    gradient.addColorStop(0.8, '#808080');
    gradient.addColorStop(1, '#606060');
    
    return gradient;
}

function createRainbowGradient(ctx, width) {
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    
    gradient.addColorStop(0, '#ff0000');
    gradient.addColorStop(1/6, '#ff8000');
    gradient.addColorStop(2/6, '#ffff00');
    gradient.addColorStop(3/6, '#00ff00');
    gradient.addColorStop(4/6, '#0080ff');
    gradient.addColorStop(5/6, '#8000ff');
    gradient.addColorStop(1, '#ff0080');
    
    return gradient;
}

// Aesthetic effect utilities
function applyGlitterEffect(ctx, width, height, intensity) {
    const particles = Math.floor((intensity / 100) * 200);
    
    for (let i = 0; i < particles; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 3 + 1;
        const opacity = Math.random() * 0.8 + 0.2;
        
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

function applySparklesEffect(ctx, width, height, intensity) {
    const sparkles = Math.floor((intensity / 100) * 50);
    
    for (let i = 0; i < sparkles; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 8 + 4;
        const rotation = Math.random() * Math.PI * 2;
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size * 0.3, -size * 0.3);
        ctx.lineTo(size, 0);
        ctx.lineTo(size * 0.3, size * 0.3);
        ctx.lineTo(0, size);
        ctx.lineTo(-size * 0.3, size * 0.3);
        ctx.lineTo(-size, 0);
        ctx.lineTo(-size * 0.3, -size * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

function applyRhinestonesEffect(ctx, width, height, intensity) {
    const stones = Math.floor((intensity / 100) * 30);
    
    for (let i = 0; i < stones; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.random() * 6 + 3;
        
        // Create rhinestone gradient
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.7, '#e0e0e0');
        gradient.addColorStop(1, '#808080');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function applyNeonPinkEffect(ctx, width, height, intensity) {
    const overlay = document.createElement('canvas');
    const overlayCtx = overlay.getContext('2d');
    overlay.width = width;
    overlay.height = height;
    
    // Create neon pink overlay
    const gradient = overlayCtx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height));
    gradient.addColorStop(0, `rgba(255, 20, 147, ${intensity / 200})`);
    gradient.addColorStop(1, `rgba(255, 105, 180, ${intensity / 400})`);
    
    overlayCtx.fillStyle = gradient;
    overlayCtx.fillRect(0, 0, width, height);
    
    ctx.drawImage(overlay, 0, 0);
}

function applyHolographicEffect(ctx, width, height, intensity) {
    const overlay = document.createElement('canvas');
    const overlayCtx = overlay.getContext('2d');
    overlay.width = width;
    overlay.height = height;
    
    // Create holographic rainbow effect
    const gradient = overlayCtx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, `rgba(255, 0, 255, ${intensity / 300})`);
    gradient.addColorStop(0.2, `rgba(0, 255, 255, ${intensity / 300})`);
    gradient.addColorStop(0.4, `rgba(255, 255, 0, ${intensity / 300})`);
    gradient.addColorStop(0.6, `rgba(255, 0, 0, ${intensity / 300})`);
    gradient.addColorStop(0.8, `rgba(0, 255, 0, ${intensity / 300})`);
    gradient.addColorStop(1, `rgba(0, 0, 255, ${intensity / 300})`);
    
    overlayCtx.fillStyle = gradient;
    overlayCtx.fillRect(0, 0, width, height);
    
    ctx.globalCompositeOperation = 'screen';
    ctx.drawImage(overlay, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
}

// Sticker utilities
function drawEmojiSticker(ctx, emoji, x, y, size) {
    ctx.save();
    ctx.font = `${size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, x, y);
    ctx.restore();
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

// Notification utility (removed)