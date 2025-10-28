    // Immediate dark mode application - no FOUC (Flash of Unstyled Content)
            (function() {
                try {
                    const savedState = localStorage.getItem('bratGeneratorState');
                    if (savedState) {
                        const state = JSON.parse(savedState);
                        if (state.darkMode) {
                            document.documentElement.setAttribute('data-theme', 'dark');
                            document.documentElement.style.colorScheme = 'dark';
                        } else {
                            document.documentElement.setAttribute('data-theme', 'light');
                            document.documentElement.style.colorScheme = 'light';
                        }
                    } else {
                        // Default to light mode if no saved state
                        document.documentElement.setAttribute('data-theme', 'light');
                        document.documentElement.style.colorScheme = 'light';
                    }
                } catch (e) {
                    // Fallback to light mode if localStorage is not available
                    document.documentElement.setAttribute('data-theme', 'light');
                    document.documentElement.style.colorScheme = 'light';
                }
            })();


// Font Loader Utility
// Ensures all Google Fonts are loaded before rendering

const FontLoader = {
    fontsLoaded: false,
    loadingPromise: null,
    
    // List of all fonts used across the application
    allFonts: [
        'Inter',
        'Poppins',
        'JetBrains Mono',
        'Space Mono',
        'Bebas Neue',
        'Oswald',
        'Anton',
        'Barlow',
        'Playfair Display',
        'Lobster',
        'Dancing Script',
        'Amatic SC',
        'Orbitron',
        'Exo',
        'Rajdhani',
        'Montserrat',
        'Roboto',
        'Open Sans',
        'Lato',
        'Nunito',
        'Source Sans Pro',
        'Raleway',
        'Ubuntu',
        'PT Sans',
        'Merriweather',
        'Lora',
        'PT Serif',
        'Crimson Text',
        'Libre Baskerville',
        'Source Serif Pro',
        'Vollkorn',
        'Cormorant Garamond',
        'Fira Code',
        'Source Code Pro',
        'Roboto Mono',
        'Inconsolata',
        'Ubuntu Mono',
        'Cousine',
        'PT Mono',
        'Overpass Mono',
        'Permanent Marker',
        'Indie Flower',
        'Kalam',
        'Caveat',
        'Shadows Into Light',
        'Satisfy',
        'Great Vibes',
        'Pacifico',
        'Comfortaa',
        'Righteous',
        'Fredoka One',
        'Bangers',
        'Creepster',
        'Monoton',
        'Bungee',
        'Alfa Slab One',
        'Fugaz One',
        'Bowlby One',
        'Russo One',
        'Concert One'
    ],
    
    // Load all fonts
    async loadFonts() {
        if (this.fontsLoaded) {
            return true;
        }
        
        if (this.loadingPromise) {
            return this.loadingPromise;
        }
        
        this.loadingPromise = this._loadAllFonts();
        return this.loadingPromise;
    },
    
    async _loadAllFonts() {
        try {
            // Use Font Loading API if available
            if ('fonts' in document) {
                const loadPromises = this.allFonts.map(async (font) => {
                    try {
                        await document.fonts.load(`16px "${font}"`);
                    } catch (e) {
                        console.warn(`Failed to load font: ${font}`, e);
                    }
                });
                
                await Promise.all(loadPromises);
                
                // Wait for fonts to be ready
                await document.fonts.ready;
            } else {
                // Fallback: wait for a short delay
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            this.fontsLoaded = true;
            console.log('All fonts loaded successfully');
            return true;
        } catch (error) {
            console.error('Error loading fonts:', error);
            this.fontsLoaded = true; // Continue anyway
            return false;
        }
    },
    
    // Check if fonts are loaded
    areFontsLoaded() {
        return this.fontsLoaded;
    },
    
    // Execute callback when fonts are loaded
    async whenLoaded(callback) {
        await this.loadFonts();
        if (callback && typeof callback === 'function') {
            callback();
        }
    }
};

// Auto-start loading fonts when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        FontLoader.loadFonts();
    });
} else {
    FontLoader.loadFonts();
}
