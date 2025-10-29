// Color and gradient presets for the Brat Generator
const PRESETS = {
  // Background color presets
  backgroundColors: [
    '#8ACE00', // Brat Green (default)
    '#111827', // Dark Gray
    '#ffffff', // White
    '#F59E0B', // Amber
    '#06B6D4', // Cyan
    '#EF4444', // Red
    '#10B981', // Emerald
    '#7C3AED', // Violet
    '#EC4899', // Pink
    '#0EA5E9', // Sky
    '#22C55E', // Green
    '#F97316', // Orange
    '#E11D48', // Rose
    '#FDE047', // Yellow
    '#9CA3AF', // Gray
    '#1E293B'  // Slate
  ],

  // Text color presets
  textColors: [
    '#000000', // Black
    '#FFFFFF', // White
    '#EF4444', // Red
    '#3B82F6', // Blue
    '#10B981', // Green
    '#8B5CF6', // Purple
    '#F59E0B', // Yellow
    '#EC4899', // Pink
    '#6B7280', // Gray
    '#F97316'  // Orange
  ],

  // Premium gradient presets
  gradients: {
    'brat-classic': ['#8ACE00', '#6366F1'],
    'sunset-vibes': ['#F59E0B', '#EC4899'],
    'ocean-dreams': ['#06B6D4', '#6366F1'],
    'dark-mode': ['#1E1E1E', '#4B5563'],
    'rainbow': ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'],
    'fire': ['#FF416C', '#FF4B2B'],
    'ice': ['#667EEA', '#764BA2'],
    'gold': ['#FFD700', '#FFA500'],
    'chrome': ['#C0C0C0', '#808080', '#404040'],
    'neon': ['#00FF87', '#60EFFF'],
    'lime-punch': ['#A8E063', '#56AB2F'],
    'tropical': ['#FAD961', '#F76B1C'],
    'aurora': ['#00C6FF', '#0072FF'],
    'cotton-candy': ['#F6D365', '#FDA085'],
    'sakura': ['#FA709A', '#FEE140'],
    'grape-soda': ['#892CDC', '#BC6FF1'],
    'minty': ['#3EB489', '#A8FF78'],
    'twilight': ['#0F2027', '#203A43', '#2C5364'],
    'night-sky': ['#141E30', '#243B55'],
    'fuchsia-pop': ['#F953C6', '#B91D73'],
    'lagoon': ['#43C6AC', '#191654'],
    'melon-sunset': ['#FF9A9E', '#FAD0C4'],
    'horizon': ['#E0EAFC', '#CFDEF3'],
    'royal': ['#8360C3', '#2EBF91'],
    'cyberpunk': ['#A1FFCE', '#FAFFD1'],
    'mango': ['#FDC830', '#F37335'],
    'arctic': ['#4CA1AF', '#C4E0E5'],
    'berry': ['#642B73', '#C6426E'],
    'flamingo': ['#FECFEF', '#F68084'],
    'deep-sea': ['#2C3E50', '#4CA1AF'],
    'sky-glow': ['#36D1DC', '#5B86E5'],
    'citrus': ['#DCE35B', '#45B649'],
    'orchid': ['#DA22FF', '#9733EE'],
    'ember': ['#EB5757', '#000000'],
    'azure': ['#00B4DB', '#0083B0'],
    'blush': ['#B24592', '#F15F79'],
    'forest': ['#5A3F37', '#2C7744'],
    'steel': ['#757F9A', '#D7DDE8'],
    'sunlit': ['#FBD786', '#C6FFDD'],
    'peacock': ['#00C9FF', '#92FE9D'],
    'volt': ['#FFE53B', '#FF2525'],
    'orchid-sky': ['#1FA2FF', '#12D8FA', '#A6FFCB'],
    'sour-apple': ['#C6EA8D', '#FE90AF'],
    'mint-fizz': ['#00DBDE', '#FC00FF'],
    'sapphire': ['#355C7D', '#6C5B7B', '#C06C84'],
    'dusk': ['#A8C0FF', '#3F2B96'],
    'spice': ['#E65C00', '#F9D423'],
    'reef': ['#11998E', '#38EF7D'],
    'cocoa': ['#D1913C', '#FFD194'],
    'luxe': ['#434343', '#000000']
  },

  // Font mappings for CSS font-family
  fonts: {
    'inter': '"Inter", sans-serif',
    'poppins': '"Poppins", sans-serif',
    'jetbrains-mono': '"JetBrains Mono", monospace',
    'space-mono': '"Space Mono", monospace',
    'bebas-neue': '"Bebas Neue", cursive',
    'oswald': '"Oswald", sans-serif',
    'anton': '"Anton", cursive',
    'barlow': '"Barlow", sans-serif',
    'playfair-display': '"Playfair Display", serif',
    'lobster': '"Lobster", cursive',
    'dancing-script': '"Dancing Script", cursive',
    'amatic-sc': '"Amatic SC", cursive',
    'orbitron': '"Orbitron", sans-serif',
    'exo': '"Exo", sans-serif',
    'rajdhani': '"Rajdhani", sans-serif',
    'montserrat': '"Montserrat", sans-serif',
    'roboto': '"Roboto", sans-serif',
    'open-sans': '"Open Sans", sans-serif',
    'lato': '"Lato", sans-serif',
    'nunito': '"Nunito", sans-serif',
    'source-sans-pro': '"Source Sans Pro", sans-serif',
    'raleway': '"Raleway", sans-serif',
    'ubuntu': '"Ubuntu", sans-serif',
    'pt-sans': '"PT Sans", sans-serif',
    'merriweather': '"Merriweather", serif',
    'lora': '"Lora", serif',
    'pt-serif': '"PT Serif", serif',
    'crimson-text': '"Crimson Text", serif',
    'libre-baskerville': '"Libre Baskerville", serif',
    'source-serif-pro': '"Source Serif Pro", serif',
    'vollkorn': '"Vollkorn", serif',
    'cormorant-garamond': '"Cormorant Garamond", serif',
    'fira-code': '"Fira Code", monospace',
    'source-code-pro': '"Source Code Pro", monospace',
    'roboto-mono': '"Roboto Mono", monospace',
    'inconsolata': '"Inconsolata", monospace',
    'ubuntu-mono': '"Ubuntu Mono", monospace',
    'cousine': '"Cousine", monospace',
    'pt-mono': '"PT Mono", monospace',
    'overpass-mono': '"Overpass Mono", monospace',
    'permanent-marker': '"Permanent Marker", cursive',
    'indie-flower': '"Indie Flower", cursive',
    'kalam': '"Kalam", cursive',
    'caveat': '"Caveat", cursive',
    'shadows-into-light': '"Shadows Into Light", cursive',
    'satisfy': '"Satisfy", cursive',
    'great-vibes': '"Great Vibes", cursive',
    'pacifico': '"Pacifico", cursive',
    'comfortaa': '"Comfortaa", cursive',
    'righteous': '"Righteous", cursive',
    'fredoka-one': '"Fredoka One", cursive',
    'bangers': '"Bangers", cursive',
    'creepster': '"Creepster", cursive',
    'monoton': '"Monoton", cursive',
    'bungee': '"Bungee", cursive',
    'alfa-slab-one': '"Alfa Slab One", cursive',
    'fugaz-one': '"Fugaz One", cursive',
    'bowlby-one': '"Bowlby One", cursive',
    'russo-one': '"Russo One", sans-serif',
    'impact': '"Impact", cursive',
    'concert-one': '"Concert One", cursive'
  },

  // Text effects definitions
  effects: {
    none: {
      filter: '',
      shadowColor: '',
      shadowBlur: 0,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      fillStyle: null
    },
    glow: {
      filter: '',
      shadowColor: '#00FF87',
      shadowBlur: 20,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      fillStyle: null
    },
    neon: {
      filter: '',
      shadowColor: '#60EFFF',
      shadowBlur: 30,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      fillStyle: '#00FF87'
    },
    vintage: {
      filter: 'sepia(1) contrast(1.2) brightness(0.9)',
      shadowColor: 'rgba(139, 69, 19, 0.5)',
      shadowBlur: 5,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      fillStyle: null
    },
    metallic: {
      filter: '',
      shadowColor: 'rgba(0, 0, 0, 0.5)',
      shadowBlur: 10,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      fillStyle: 'linear-gradient(0deg, #C0C0C0, #E8E8E8, #C0C0C0)'
    },
    glass: {
      filter: '',
      shadowColor: 'rgba(255, 255, 255, 0.5)',
      shadowBlur: 15,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      fillStyle: 'linear-gradient(0deg, rgba(255,255,255,0.7), rgba(255,255,255,0.3))'
    },
    fire: {
      filter: '',
      shadowColor: '#FF4B2B',
      shadowBlur: 25,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      fillStyle: 'linear-gradient(0deg, #FF416C, #FF4B2B, #FFD700)'
    },
    ice: {
      filter: '',
      shadowColor: '#667EEA',
      shadowBlur: 20,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      fillStyle: 'linear-gradient(0deg, #667EEA, #764BA2, #E6F3FF)'
    },
    grunge: {
      filter: 'contrast(1.3) brightness(0.8) saturate(1.2)',
      shadowColor: 'rgba(0, 0, 0, 0.8)',
      shadowBlur: 8,
      shadowOffsetX: 3,
      shadowOffsetY: 3,
      fillStyle: null
    },
    pixel: {
      filter: 'contrast(2) brightness(1.2) saturate(1.5)',
      shadowColor: 'rgba(0, 0, 0, 0.9)',
      shadowBlur: 0,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      fillStyle: null
    },
    rainbow: {
      filter: 'hue-rotate(45deg) saturate(2)',
      shadowColor: 'rgba(255, 0, 255, 0.6)',
      shadowBlur: 15,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      fillStyle: 'linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #80ff00, #00ff00, #00ff80, #00ffff, #0080ff, #0000ff, #8000ff, #ff00ff, #ff0080)'
    },
    chrome: {
      filter: 'contrast(1.5) brightness(1.1)',
      shadowColor: 'rgba(0, 0, 0, 0.7)',
      shadowBlur: 8,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
      fillStyle: 'linear-gradient(0deg, #C0C0C0, #E8E8E8, #F5F5F5, #E8E8E8, #C0C0C0)'
    },
    plasma: {
      filter: 'hue-rotate(90deg) saturate(3) brightness(1.2)',
      shadowColor: 'rgba(255, 0, 255, 0.8)',
      shadowBlur: 20,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      fillStyle: 'linear-gradient(45deg, #ff00ff, #8000ff, #0080ff, #00ffff)'
    },
    hologram: {
      filter: 'hue-rotate(180deg) saturate(2.5)',
      shadowColor: 'rgba(0, 255, 255, 0.7)',
      shadowBlur: 25,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      fillStyle: 'linear-gradient(90deg, #00ffff, #ff00ff, #00ff00, #ffff00)'
    },
    electric: {
      filter: 'contrast(2) brightness(1.3) saturate(2)',
      shadowColor: 'rgba(0, 255, 255, 1)',
      shadowBlur: 30,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      fillStyle: '#00FFFF'
    },
    cosmic: {
      filter: 'hue-rotate(270deg) contrast(1.8) brightness(0.9)',
      shadowColor: 'rgba(138, 43, 226, 0.8)',
      shadowBlur: 20,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      fillStyle: 'linear-gradient(135deg, #8A2BE2, #4B0082, #9932CC, #BA55D3)'
    },
    lava: {
      filter: 'contrast(1.5) brightness(1.1)',
      shadowColor: 'rgba(255, 69, 0, 0.9)',
      shadowBlur: 25,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      fillStyle: 'linear-gradient(0deg, #FF4500, #FF6347, #FF8C00, #FFD700)'
    },
    toxic: {
      filter: 'hue-rotate(120deg) saturate(2.2) brightness(1.1)',
      shadowColor: 'rgba(50, 205, 50, 0.8)',
      shadowBlur: 18,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      fillStyle: 'linear-gradient(45deg, #32CD32, #ADFF2F, #00FF7F, #00FF00)'
    },
    diamond: {
      filter: 'brightness(1.4) contrast(1.2)',
      shadowColor: 'rgba(255, 255, 255, 0.9)',
      shadowBlur: 20,
      shadowOffsetX: 0,
      shadowOffsetY: 0,
      fillStyle: 'linear-gradient(45deg, #FFFFFF, #F0F8FF, #E6E6FA, #F5F5F5)'
    }
  },

  // Outline styles
  outlineStyles: {
    none: { width: 0, style: 'solid' },
    thin: { width: 1, style: 'solid' },
    medium: { width: 2, style: 'solid' },
    thick: { width: 4, style: 'solid' },
    double: { width: 3, style: 'double' },
    dashed: { width: 2, style: 'dashed' }
  },

  // Export size options
  exportSizes: {
    '400x400': { width: 400, height: 400 },
    '800x800': { width: 800, height: 800 },
    '1080x1080': { width: 1080, height: 1080 },
    '1920x1080': { width: 1920, height: 1080 },
    '1080x1920': { width: 1080, height: 1920 }
  }
};

// Utility functions for working with presets
const PresetUtils = {
  /**
   * Get CSS linear gradient string from gradient key
   * @param {string} gradientKey - Key from PRESETS.gradients
   * @returns {string} CSS linear-gradient string
   */
  getGradientCSS(gradientKey) {
    const stops = PRESETS.gradients[gradientKey];
    if (!stops) return '';
    
    return `linear-gradient(135deg, ${stops.join(', ')})`;
  },

  /**
   * Create canvas gradient from gradient key
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} gradientKey - Key from PRESETS.gradients
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   * @returns {CanvasGradient} Canvas gradient object
   */
  createCanvasGradient(ctx, gradientKey, width, height) {
    const stops = PRESETS.gradients[gradientKey];
    if (!stops) return null;

    // Create linear gradient from top-left to bottom-right
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    
    stops.forEach((color, index) => {
      const position = index / (stops.length - 1);
      gradient.addColorStop(position, color);
    });

    return gradient;
  },

  /**
   * Get font family string from font key
   * @param {string} fontKey - Key from PRESETS.fonts
   * @returns {string} CSS font-family string
   */
  getFontFamily(fontKey) {
    return PRESETS.fonts[fontKey] || PRESETS.fonts.inter;
  },

  /**
   * Get effect configuration
   * @param {string} effectKey - Key from PRESETS.effects
   * @returns {Object} Effect configuration object
   */
  getEffect(effectKey) {
    return PRESETS.effects[effectKey] || PRESETS.effects.none;
  },

  /**
   * Get outline style configuration
   * @param {string} outlineKey - Key from PRESETS.outlineStyles
   * @returns {Object} Outline style configuration
   */
  getOutlineStyle(outlineKey) {
    return PRESETS.outlineStyles[outlineKey] || PRESETS.outlineStyles.none;
  },

  /**
   * Get export size configuration
   * @param {string} sizeKey - Key from PRESETS.exportSizes
   * @returns {Object} Size configuration with width and height
   */
  getExportSize(sizeKey) {
    return PRESETS.exportSizes[sizeKey] || PRESETS.exportSizes['800x800'];
  },

  /**
   * Get all gradient keys for UI population
   * @returns {Array} Array of gradient keys
   */
  getGradientKeys() {
    return Object.keys(PRESETS.gradients);
  },

  /**
   * Get gradient name in readable format
   * @param {string} gradientKey - Gradient key
   * @returns {string} Formatted gradient name
   */
  getGradientName(gradientKey) {
    return gradientKey
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PRESETS, PresetUtils };
}
