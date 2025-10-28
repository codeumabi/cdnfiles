// Album Cover Generator State Management
const albumState = {
    // Background image
    backgroundImage: null,
    backgroundImageData: null,
    imageBlur: 0,
    imageOpacity: 100,
    
    // Color overlay
    colorOverlay: false,
    overlayColor: '#8ACE00',
    overlayOpacity: 30,
    
    // Text properties
    text: 'brat',
    fontSize: 128,
    fontFamily: 'inter',
    textColor: '#ffffff',
    textAlignment: 'center',
    letterSpacing: 0,
    
    // Text outline
    outline: 'none',
    outlineColor: '#000000',
    
    // Text effects
    shadow: false,
    shadowX: 0,
    shadowY: 0,
    shadowBlur: 10,
    shadowColor: '#000000',
    shadowOpacity: 40,
    effect: 'none',
    
    // Canvas settings
    canvasWidth: 500,
    canvasHeight: 500,
    
    // Export settings
    exportWidth: 500,
    exportHeight: 500,
    exportFormat: 'png'
};

// Color palettes
const colorPalettes = {
    text: [
        '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff',
        '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080',
        '#ffc0cb', '#a52a2a', '#808080', '#008000', '#000080'
    ],
    overlay: [
        '#8ACE00', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4',
        '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3',
        '#ff9f43', '#10ac84', '#ee5a24', '#0abde3', '#f368e0'
    ]
};

// Font mapping
const fontMap = {
    'inter': 'Inter',
    'poppins': 'Poppins',
    'jetbrains-mono': 'JetBrains Mono',
    'space-mono': 'Space Mono',
    'bebas-neue': 'Bebas Neue',
    'oswald': 'Oswald',
    'anton': 'Anton',
    'barlow': 'Barlow',
    'playfair-display': 'Playfair Display',
    'lobster': 'Lobster',
    'dancing-script': 'Dancing Script',
    'amatic-sc': 'Amatic SC',
    'orbitron': 'Orbitron',
    'exo': 'Exo',
    'rajdhani': 'Rajdhani',
    'montserrat': 'Montserrat',
    'roboto': 'Roboto',
    'open-sans': 'Open Sans',
    'lato': 'Lato',
    'nunito': 'Nunito',
    'source-sans-pro': 'Source Sans Pro',
    'raleway': 'Raleway',
    'ubuntu': 'Ubuntu',
    'pt-sans': 'PT Sans',
    'merriweather': 'Merriweather',
    'lora': 'Lora',
    'pt-serif': 'PT Serif',
    'crimson-text': 'Crimson Text',
    'libre-baskerville': 'Libre Baskerville',
    'source-serif-pro': 'Source Serif Pro',
    'vollkorn': 'Vollkorn',
    'cormorant-garamond': 'Cormorant Garamond',
    'fira-code': 'Fira Code',
    'source-code-pro': 'Source Code Pro',
    'roboto-mono': 'Roboto Mono',
    'inconsolata': 'Inconsolata',
    'ubuntu-mono': 'Ubuntu Mono',
    'cousine': 'Cousine',
    'pt-mono': 'PT Mono',
    'overpass-mono': 'Overpass Mono',
    'permanent-marker': 'Permanent Marker',
    'indie-flower': 'Indie Flower',
    'kalam': 'Kalam',
    'caveat': 'Caveat',
    'shadows-into-light': 'Shadows Into Light',
    'satisfy': 'Satisfy',
    'great-vibes': 'Great Vibes',
    'pacifico': 'Pacifico',
    'comfortaa': 'Comfortaa',
    'righteous': 'Righteous',
    'fredoka-one': 'Fredoka One',
    'bangers': 'Bangers',
    'creepster': 'Creepster',
    'monoton': 'Monoton',
    'bungee': 'Bungee',
    'alfa-slab-one': 'Alfa Slab One',
    'fugaz-one': 'Fugaz One',
    'bowlby-one': 'Bowlby One',
    'russo-one': 'Russo One',
    'impact': 'Impact',
    'concert-one': 'Concert One'
};

// Update state and trigger canvas redraw
function updateState(property, value) {
    albumState[property] = value;
    drawCanvas();
}

// Reset state to defaults
function resetState() {
    albumState.backgroundImage = null;
    albumState.backgroundImageData = null;
    albumState.imageBlur = 0;
    albumState.imageOpacity = 100;
    albumState.colorOverlay = false;
    albumState.overlayColor = '#8ACE00';
    albumState.overlayOpacity = 30;
    albumState.text = 'brat';
    albumState.fontSize = 128;
    albumState.fontFamily = 'inter';
    albumState.textColor = '#ffffff';
    albumState.textAlignment = 'center';
    albumState.letterSpacing = 0;
    albumState.outline = 'none';
    albumState.outlineColor = '#000000';
    albumState.shadow = false;
    albumState.shadowX = 0;
    albumState.shadowY = 0;
    albumState.shadowBlur = 10;
    albumState.shadowColor = '#000000';
    albumState.shadowOpacity = 40;
    albumState.effect = 'none';
}