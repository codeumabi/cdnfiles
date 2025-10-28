// Meme Generator State Management
const memeState = {
    // Background
    backgroundColor: '#8ACE00', // Default green brat color
    backgroundColorEnabled: true, // New: Toggle for background color
    backgroundImage: null,
    backgroundImageData: null,
    backgroundImageOffset: { x: 0, y: 0 }, // New: Offset for dragging image
    blendMode: 'normal',
    imageOpacity: 100,
    
    // Text elements array for multiple text support
    textElements: [{
        id: 1,
        text: 'brat',
        fontSize: 128,
        fontFamily: 'fredoka-one',
        textColor: '#ff69b4',
        textAlignment: 'center',
        textStyle: 'bubble',
        x: 250,
        y: 250,
        selected: true
    }],
    currentTextId: 1,
    
    // Text outline
    outline: true,
    outlineWidth: 4,
    outlineColor: '#000000',
    
    // Text effects
    shadow: true,
    shadowX: 2,
    shadowY: 2,
    shadowBlur: 6,
    shadowColor: '#ff1493',
    
    // Brat aesthetics
    aesthetic: null,
    aestheticIntensity: 50,
    
    // Stickers with movement support
    stickers: [],
    activeStickerCategory: 'crowns',
    stickerSize: 50,
    selectedSticker: null,
    dragOffset: { x: 0, y: 0 },
    
    // Mood
    activeMood: null,
    activeMoodCategory: 'bratty',
    
    // Canvas settings
    canvasWidth: 500,
    canvasHeight: 500,
    
    // Export settings
    exportWidth: 500,
    exportHeight: 500,
    exportFormat: 'png'
};

// Brat color palettes
const bratColorPalettes = {
    text: [
        '#ff69b4', '#ff1493', '#ff00ff', '#da70d6', '#ba55d3',
        '#9370db', '#8a2be2', '#4b0082', '#00ffff', '#00fa9a',
        '#7fff00', '#ffff00', '#ffd700', '#ffa500', '#ff4500',
        '#ffffff', '#000000', '#c0c0c0', '#800080', '#ff0080'
    ],
    background: [
        '#8ACE00', '#ff69b4', '#ff1493', '#da70d6', '#9370db',
        '#00ffff', '#7fff00', '#ffff00', '#ffd700', '#ffa500',
        '#ff4500', '#ff0000', '#ffffff', '#000000', '#c0c0c0',
        '#800080', '#ff0080', '#00fa9a', '#4b0082', '#ba55d3'
    ]
};

// Brat aesthetics
const bratAesthetics = {
    glitter: { name: '✨ Glitter', effect: 'glitter' },
    sparkles: { name: '⭐ Sparkles', effect: 'sparkles' },
    rhinestones: { name: '💎 Rhinestones', effect: 'rhinestones' },
    neonPink: { name: '💗 Neon Pink', effect: 'neon-pink' },
    chrome: { name: '🪞 Chrome', effect: 'chrome' },
    holographic: { name: '🌈 Holographic', effect: 'holographic' },
    metallic: { name: '✨ Metallic', effect: 'metallic' },
    iridescent: { name: '🦄 Iridescent', effect: 'iridescent' },
    galaxy: { name: '🌌 Galaxy', effect: 'galaxy' },
    rainbow: { name: '🌈 Rainbow', effect: 'rainbow' }
};

// Sticker collections
const stickerCollections = {
    crowns: [
        '👑', '💎', '🏆', '🎯', '⭐', '🌟', '✨', '💫',
        '🔱', '🎭', '🎪', '🎨', '🎬', '🎤'
    ],
    bows: [
        '🎀', '🎗️', '🏹', '💝', '🎁', '🎊', '🎉', '🪅',
        '🎈', '🌺', '🌸', '🌷', '🌹', '💐'
    ],
    butterflies: [
        '🦋', '🌸', '🌺', '🌻', '🌷', '🏵️', '💮', '🌼',
        '🌿', '🍀', '🌱', '🌾', '🌵', '🌳'
    ],
    lipgloss: [
        '💄', '💋', '👄', '💅', '💆', '💇', '🪞', '💊',
        '🧴', '🧼', '🧽', '🪥', '🧲', '💡'
    ],
    memes: [
        '😭', '💀', '🤡', '👻', '🤠', '🤓', '😎', '🥺',
        '😈', '👿', '💩', '🤪', '😜', '🙃', '😵', '🤯',
        '🥴', '😴', '🤤', '😷', '🤢', '🤮', '🤧', '😇',
        '🥳', '🤩', '😍', '🥰', '😘', '😋', '😛', '🤑',
        '🤗', '🤭', '🤫', '🤥', '😏', '😒', '🙄', '😤',
        '😠', '🤬', '😡', '🥶', '🥵', '😰', '😨', '😱'
    ]
};

// Mood presets
const moodPresets = {
    bratty: [
        { name: '💅 Princess Energy', config: { textColor: '#ff69b4', aesthetic: 'glitter', shadowColor: '#ff1493' } },
        { name: '👑 Queen Vibes', config: { textColor: '#da70d6', aesthetic: 'rhinestones', shadowColor: '#8a2be2' } },
        { name: '💎 Diamond Status', config: { textColor: '#ffffff', aesthetic: 'chrome', shadowColor: '#c0c0c0' } },
        { name: '🔥 Hot Girl Summer', config: { textColor: '#ff4500', aesthetic: 'neon-pink', shadowColor: '#ff0000' } },
        { name: '✨ Main Character', config: { textColor: '#ffd700', aesthetic: 'sparkles', shadowColor: '#ffa500' } },
        { name: '💖 Baby Pink Dreams', config: { textColor: '#ffb6c1', aesthetic: 'glitter', shadowColor: '#ff69b4' } },
        { name: '🌟 Starlight Diva', config: { textColor: '#e6e6fa', aesthetic: 'holographic', shadowColor: '#9370db' } },
        { name: '💜 Purple Reign', config: { textColor: '#8a2be2', aesthetic: 'metallic', shadowColor: '#4b0082' } },
        { name: '🦄 Unicorn Magic', config: { textColor: '#ff00ff', aesthetic: 'iridescent', shadowColor: '#da70d6' } },
        { name: '🎀 Bow Down', config: { textColor: '#ff1493', aesthetic: 'sparkles', shadowColor: '#8b008b' } },
        { name: '💋 Kiss Kiss', config: { textColor: '#dc143c', aesthetic: 'glitter', shadowColor: '#b22222' } },
        { name: '🌈 Rainbow Royalty', config: { textColor: '#ff69b4', aesthetic: 'rainbow', shadowColor: '#ff1493' } }
    ],
    girly: [
        { name: '🌸 Cherry Blossom', config: { textColor: '#ffb6c1', aesthetic: 'sparkles', shadowColor: '#ff69b4' } },
        { name: '🍓 Strawberry Milk', config: { textColor: '#ff69b4', aesthetic: 'glitter', shadowColor: '#ff1493' } },
        { name: '🌺 Hibiscus Honey', config: { textColor: '#ff6347', aesthetic: 'rhinestones', shadowColor: '#ff4500' } },
        { name: '🦋 Butterfly Garden', config: { textColor: '#da70d6', aesthetic: 'iridescent', shadowColor: '#9370db' } },
        { name: '💐 Flower Power', config: { textColor: '#ffd1dc', aesthetic: 'sparkles', shadowColor: '#ffb6c1' } },
        { name: '🎀 Ribbon Candy', config: { textColor: '#ff1493', aesthetic: 'glitter', shadowColor: '#8b008b' } },
        { name: '🌷 Tulip Time', config: { textColor: '#ff69b4', aesthetic: 'holographic', shadowColor: '#da70d6' } },
        { name: '🧸 Teddy Bear Vibes', config: { textColor: '#dda0dd', aesthetic: 'sparkles', shadowColor: '#ba55d3' } },
        { name: '💕 Love Letter', config: { textColor: '#ff1493', aesthetic: 'chrome', shadowColor: '#8b008b' } },
        { name: '🍑 Peach Perfect', config: { textColor: '#ffdab9', aesthetic: 'glitter', shadowColor: '#ff8c69' } },
        { name: '🌙 Moon Child', config: { textColor: '#e6e6fa', aesthetic: 'metallic', shadowColor: '#9370db' } },
        { name: '⭐ Starry Eyes', config: { textColor: '#ffff00', aesthetic: 'sparkles', shadowColor: '#ffd700' } }
    ],
    maximalist: [
        { name: '🎪 Circus Chaos', config: { textColor: '#ff00ff', aesthetic: 'rainbow', shadowColor: '#ff1493' } },
        { name: '🌈 Rainbow Explosion', config: { textColor: '#ff69b4', aesthetic: 'holographic', shadowColor: '#da70d6' } },
        { name: '💥 Neon Overload', config: { textColor: '#00ffff', aesthetic: 'neon-pink', shadowColor: '#ff00ff' } },
        { name: '✨ Glitter Bomb', config: { textColor: '#ffd700', aesthetic: 'glitter', shadowColor: '#ffa500' } },
        { name: '🎨 Art Attack', config: { textColor: '#ff6347', aesthetic: 'galaxy', shadowColor: '#4b0082' } },
        { name: '🦄 Unicorn Vomit', config: { textColor: '#ff1493', aesthetic: 'iridescent', shadowColor: '#8a2be2' } },
        { name: '🌟 Cosmic Chaos', config: { textColor: '#9370db', aesthetic: 'galaxy', shadowColor: '#000080' } },
        { name: '💎 Diamond Dynasty', config: { textColor: '#ffffff', aesthetic: 'rhinestones', shadowColor: '#c0c0c0' } },
        { name: '🔥 Fire Festival', config: { textColor: '#ff4500', aesthetic: 'chrome', shadowColor: '#ff0000' } },
        { name: '⚡ Electric Energy', config: { textColor: '#00fa9a', aesthetic: 'metallic', shadowColor: '#008000' } },
        { name: '🌸 Kawaii Overload', config: { textColor: '#ff69b4', aesthetic: 'sparkles', shadowColor: '#ff1493' } },
        { name: '🎭 Drama Queen', config: { textColor: '#8a2be2', aesthetic: 'holographic', shadowColor: '#4b0082' } }
    ],
    social: [
        { name: '📸 Insta Ready', config: { textColor: '#ff69b4', aesthetic: 'glitter', shadowColor: '#ff1493' } },
        { name: '🎬 TikTok Famous', config: { textColor: '#00ffff', aesthetic: 'neon-pink', shadowColor: '#ff00ff' } },
        { name: '💫 Going Viral', config: { textColor: '#ffd700', aesthetic: 'sparkles', shadowColor: '#ffa500' } },
        { name: '👑 Influencer Mode', config: { textColor: '#da70d6', aesthetic: 'chrome', shadowColor: '#8a2be2' } },
        { name: '💎 Content Creator', config: { textColor: '#ffffff', aesthetic: 'rhinestones', shadowColor: '#c0c0c0' } },
        { name: '🌟 Story Time', config: { textColor: '#ff1493', aesthetic: 'holographic', shadowColor: '#8b008b' } },
        { name: '🔥 Trending Now', config: { textColor: '#ff4500', aesthetic: 'metallic', shadowColor: '#ff0000' } },
        { name: '💅 Selfie Queen', config: { textColor: '#ff69b4', aesthetic: 'iridescent', shadowColor: '#da70d6' } },
        { name: '🎀 Aesthetic Vibes', config: { textColor: '#e6e6fa', aesthetic: 'sparkles', shadowColor: '#9370db' } },
        { name: '✨ Feed Goals', config: { textColor: '#ffb6c1', aesthetic: 'glitter', shadowColor: '#ff69b4' } },
        { name: '🦋 Transformation', config: { textColor: '#ba55d3', aesthetic: 'galaxy', shadowColor: '#8a2be2' } },
        { name: '💖 Engagement Ring', config: { textColor: '#ff1493', aesthetic: 'rainbow', shadowColor: '#8b008b' } }
    ]
};

// Font mapping for bubble fonts
const bubbleFontMap = {
    'fredoka-one': 'Fredoka One',
    'bangers': 'Bangers',
    'bungee': 'Bungee',
    'comfortaa': 'Comfortaa',
    'righteous': 'Righteous',
    'permanent-marker': 'Permanent Marker',
    'bebas-neue': 'Bebas Neue',
    'anton': 'Anton',
    'alfa-slab-one': 'Alfa Slab One',
    'fugaz-one': 'Fugaz One',
    'bowlby-one': 'Bowlby One',
    'russo-one': 'Russo One',
    'concert-one': 'Concert One',
    'monoton': 'Monoton'
};

// Update state and trigger canvas redraw
function updateMemeState(property, value) {
    memeState[property] = value;
    drawMemeCanvas();
}

// Reset state to defaults
function resetMemeState() {
    memeState.backgroundColor = '#8ACE00';
    memeState.backgroundColorEnabled = true;
    memeState.backgroundImage = null;
    memeState.backgroundImageData = null;
    memeState.backgroundImageOffset = { x: 0, y: 0 };
    memeState.blendMode = 'normal';
    memeState.imageOpacity = 100;
    memeState.textElements = [{
        id: 1,
        text: 'brat',
        fontSize: 128,
        fontFamily: 'fredoka-one',
        textColor: '#ff69b4',
        textAlignment: 'center',
        textStyle: 'bubble',
        x: 250,
        y: 250,
        selected: true
    }];
    memeState.currentTextId = 1;
    memeState.outline = true;
    memeState.outlineWidth = 4;
    memeState.outlineColor = '#000000';
    memeState.shadow = true;
    memeState.shadowX = 2;
    memeState.shadowY = 2;
    memeState.shadowBlur = 6;
    memeState.shadowColor = '#ff1493';
    memeState.aesthetic = null;
    memeState.aestheticIntensity = 50;
    memeState.stickers = [];
    memeState.selectedSticker = null;
    memeState.activeMood = null;
}

// Helper functions for multiple text elements
function getCurrentTextElement() {
    return memeState.textElements.find(t => t.id === memeState.currentTextId) || memeState.textElements[0];
}

function addNewTextElement() {
    const newId = Math.max(...memeState.textElements.map(t => t.id)) + 1;
    const newText = {
        id: newId,
        text: 'new text',
        fontSize: 128,
        fontFamily: 'fredoka-one',
        textColor: '#ff69b4',
        textAlignment: 'center',
        textStyle: 'bubble',
        x: 250 + (Math.random() - 0.5) * 100,
        y: 250 + (Math.random() - 0.5) * 100,
        selected: false
    };
    
    // Deselect all other text elements
    memeState.textElements.forEach(t => t.selected = false);
    newText.selected = true;
    
    memeState.textElements.push(newText);
    memeState.currentTextId = newId;
    return newText;
}

function selectTextElement(id) {
    memeState.textElements.forEach(t => t.selected = (t.id === id));
    memeState.currentTextId = id;
}

function deleteTextElement(id) {
    if (memeState.textElements.length > 1) {
        memeState.textElements = memeState.textElements.filter(t => t.id !== id);
        if (memeState.currentTextId === id) {
            memeState.currentTextId = memeState.textElements[0].id;
            memeState.textElements[0].selected = true;
        }
    }
}