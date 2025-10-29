// Gallery management for the Brat Album Cover Generator

class AlbumGalleryManager {
  constructor(desktopContainer, mobileContainer) {
    this.desktopContainer = desktopContainer;
    this.mobileContainer = mobileContainer;
    this.storageKey = 'bratAlbumGeneratorGallery';
    this.maxItems = 16;
    this.gallery = [];
    
    // Event handlers
    this.onItemClick = this.onItemClick.bind(this);
    this.onItemDelete = this.onItemDelete.bind(this);
    
    // Initialize gallery
    this.loadGallery();
  }

  /**
   * Load gallery from localStorage
   */
  loadGallery() {
    try {
      const savedGallery = localStorage.getItem(this.storageKey);
      if (savedGallery) {
        this.gallery = JSON.parse(savedGallery);
        
        // Validate gallery items
        this.gallery = this.gallery.filter(item => this.validateGalleryItem(item));
        
        // Ensure max items limit
        if (this.gallery.length > this.maxItems) {
          this.gallery = this.gallery.slice(0, this.maxItems);
          this.saveGallery();
        }
      }
    } catch (error) {
      console.error('Failed to load album gallery from localStorage:', error);
      this.gallery = [];
    }
    
    // Always ensure we have sample presets for demonstration
    if (this.gallery.length === 0) {
      this.addSamplePresets();
    }
    
    this.renderGallery();
  }

  /**
   * Save gallery to localStorage
   */
  saveGallery() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.gallery));
    } catch (error) {
      console.error('Failed to save album gallery to localStorage:', error);
      
      // If storage is full, try to clear some space
      if (error.name === 'QuotaExceededError') {
        this.clearOldItems();
        try {
          localStorage.setItem(this.storageKey, JSON.stringify(this.gallery));
        } catch (retryError) {
          console.error('Failed to save album gallery after clearing space:', retryError);
        }
      }
    }
  }

  /**
   * Clear old gallery items to free space
   */
  clearOldItems() {
    // Keep only half the items (16 newest)
    this.gallery = this.gallery.slice(0, 16);
  }

  /**
   * Add item to gallery
   * @param {string} thumbnailDataUrl - Thumbnail image data URL
   * @param {Object} state - Album state snapshot
   */
  saveToGallery(thumbnailDataUrl, state) {
    const item = {
      id: this.generateId(),
      timestamp: Date.now(),
      thumbnail: thumbnailDataUrl,
      state: this.deepClone(state),
      title: this.generateItemTitle(state)
    };

    // Add to beginning of array
    this.gallery.unshift(item);

    // Maintain max items limit
    if (this.gallery.length > this.maxItems) {
      this.gallery = this.gallery.slice(0, this.maxItems);
    }

    // Save and re-render
    this.saveGallery();
    this.renderGallery();

    return item.id;
  }

  /**
   * Generate a title for gallery item
   * @param {Object} state - Album state
   * @returns {string} Generated title
   */
  generateItemTitle(state) {
    let title = 'Untitled Album';
    
    // Get text content
    if (state.text) {
      const text = state.text.length > 15 ? state.text.substring(0, 15) + '...' : state.text;
      title = text;
    }
    
    // Add background info
    if (state.backgroundImage) {
      title += ' - Photo';
    } else {
      title += ' - ' + (state.backgroundColor || 'Color');
    }
    
    return title;
  }

  /**
   * Load state from gallery item
   * @param {string} itemId - Gallery item ID
   * @returns {Object|null} State object or null if not found
   */
  loadFromGallery(itemId) {
    const item = this.gallery.find(item => item.id === itemId);
    return item ? this.deepClone(item.state) : null;
  }

  /**
   * Delete item from gallery
   * @param {string} itemId - Gallery item ID
   */
  deleteFromGallery(itemId) {
    const index = this.gallery.findIndex(item => item.id === itemId);
    if (index > -1) {
      this.gallery.splice(index, 1);
      this.saveGallery();
      this.renderGallery();
    }
  }

  /**
   * Clear all gallery items
   */
  clearGallery() {
    this.gallery = [];
    this.saveGallery();
    this.renderGallery();
  }

  /**
   * Add 20 diverse sample presets for demonstration
   */
  addSamplePresets() {
    const presets = [
      // 1. Classic Album
      {
        id: 'album_preset_1',
        title: 'brat - Classic Album',
        timestamp: Date.now() - 3600000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#8ACE00"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="#ffffff" text-anchor="middle" dy=".3em" font-weight="bold">brat</text></svg>')}`,
        state: {
          backgroundImage: null,
          backgroundImageData: null,
          imageBlur: 0,
          imageOpacity: 100,
          colorOverlay: true,
          overlayColor: '#8ACE00',
          overlayOpacity: 100,
          text: 'brat',
          fontSize: 128,
          fontFamily: 'inter',
          textColor: '#ffffff',
          textAlignment: 'center',
          letterSpacing: 0,
          outline: 'none',
          outlineColor: '#000000',
          shadow: false,
          shadowX: 0,
          shadowY: 0,
          shadowBlur: 10,
          shadowColor: '#000000',
          shadowOpacity: 40,
          effect: 'none',
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 2. Minimalist Black
      {
        id: 'album_preset_2',
        title: 'minimalist - Black',
        timestamp: Date.now() - 7200000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#000000"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="#ffffff" text-anchor="middle" dy=".3em">minimalist</text></svg>')}`,
        state: {
          backgroundImage: null,
          backgroundImageData: null,
          imageBlur: 0,
          imageOpacity: 100,
          colorOverlay: true,
          overlayColor: '#000000',
          overlayOpacity: 100,
          text: 'minimalist',
          fontSize: 64,
          fontFamily: 'poppins',
          textColor: '#ffffff',
          textAlignment: 'center',
          letterSpacing: 8,
          outline: 'none',
          outlineColor: '#000000',
          shadow: false,
          shadowX: 0,
          shadowY: 0,
          shadowBlur: 10,
          shadowColor: '#000000',
          shadowOpacity: 40,
          effect: 'none',
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 3. Neon Glow
      {
        id: 'album_preset_3',
        title: 'neon - Glow Effect',
        timestamp: Date.now() - 10800000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#1a1a1a"/><text x="50%" y="50%" font-family="Arial" font-size="22" fill="#00ffff" text-anchor="middle" dy=".3em" font-weight="bold">neon</text></svg>')}`,
        state: {
          backgroundImage: null,
          backgroundImageData: null,
          imageBlur: 0,
          imageOpacity: 100,
          colorOverlay: true,
          overlayColor: '#1a1a1a',
          overlayOpacity: 100,
          text: 'neon',
          fontSize: 96,
          fontFamily: 'orbitron',
          textColor: '#00ffff',
          textAlignment: 'center',
          letterSpacing: 4,
          outline: 'medium',
          outlineColor: '#ff00ff',
          shadow: true,
          shadowX: 0,
          shadowY: 0,
          shadowBlur: 20,
          shadowColor: '#00ffff',
          shadowOpacity: 80,
          effect: 'glow',
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 4. Vintage Sepia
      {
        id: 'album_preset_4',
        title: 'vintage - Sepia Tone',
        timestamp: Date.now() - 14400000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#8b7355"/><text x="50%" y="50%" font-family="Arial" font-size="18" fill="#f5deb3" text-anchor="middle" dy=".3em">vintage</text></svg>')}`,
        state: {
          backgroundImage: null,
          backgroundImageData: null,
          imageBlur: 0,
          imageOpacity: 100,
          colorOverlay: true,
          overlayColor: '#8b7355',
          overlayOpacity: 100,
          text: 'vintage',
          fontSize: 84,
          fontFamily: 'playfair-display',
          textColor: '#f5deb3',
          textAlignment: 'center',
          letterSpacing: 2,
          outline: 'thin',
          outlineColor: '#5d4e37',
          shadow: true,
          shadowX: 2,
          shadowY: 2,
          shadowBlur: 8,
          shadowColor: '#2f1b14',
          shadowOpacity: 60,
          effect: 'vintage',
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 5. Pastel Dream
      {
        id: 'album_preset_5',
        title: 'dream - Soft Pastel',
        timestamp: Date.now() - 18000000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#ffeef8"/><text x="50%" y="50%" font-family="Arial" font-size="20" fill="#d8bfd8" text-anchor="middle" dy=".3em">dream</text></svg>')}`,
        state: {
          backgroundImage: null,
          backgroundImageData: null,
          imageBlur: 0,
          imageOpacity: 100,
          colorOverlay: true,
          overlayColor: '#ffeef8',
          overlayOpacity: 100,
          text: 'dream',
          fontSize: 108,
          fontFamily: 'dancing-script',
          textColor: '#d8bfd8',
          textAlignment: 'center',
          letterSpacing: 0,
          outline: 'none',
          outlineColor: '#000000',
          shadow: true,
          shadowX: 1,
          shadowY: 1,
          shadowBlur: 6,
          shadowColor: '#dda0dd',
          shadowOpacity: 30,
          effect: 'soft',
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 6. Bold Impact
      {
        id: 'album_preset_6',
        title: 'impact - Bold Statement',
        timestamp: Date.now() - 21600000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#ff0000"/><text x="50%" y="50%" font-family="Arial" font-size="18" fill="#ffffff" text-anchor="middle" dy=".3em" font-weight="bold">IMPACT</text></svg>')}`,
        state: {
          backgroundImage: null,
          backgroundImageData: null,
          imageBlur: 0,
          imageOpacity: 100,
          colorOverlay: true,
          overlayColor: '#ff0000',
          overlayOpacity: 100,
          text: 'IMPACT',
          fontSize: 72,
          fontFamily: 'impact',
          textColor: '#ffffff',
          textAlignment: 'center',
          letterSpacing: 6,
          outline: 'thick',
          outlineColor: '#000000',
          shadow: true,
          shadowX: 4,
          shadowY: 4,
          shadowBlur: 12,
          shadowColor: '#800000',
          shadowOpacity: 70,
          effect: 'bold',
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 7. Cyber Future
      {
        id: 'album_preset_7',
        title: 'cyber - Future Tech',
        timestamp: Date.now() - 25200000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#0a0a0a"/><text x="50%" y="50%" font-family="Arial" font-size="20" fill="#00ff41" text-anchor="middle" dy=".3em">cyber</text></svg>')}`,
        state: {
          backgroundImage: null,
          backgroundImageData: null,
          imageBlur: 0,
          imageOpacity: 100,
          colorOverlay: true,
          overlayColor: '#0a0a0a',
          overlayOpacity: 100,
          text: 'cyber',
          fontSize: 88,
          fontFamily: 'jetbrains-mono',
          textColor: '#00ff41',
          textAlignment: 'center',
          letterSpacing: 3,
          outline: 'medium',
          outlineColor: '#ff00ff',
          shadow: true,
          shadowX: 0,
          shadowY: 0,
          shadowBlur: 15,
          shadowColor: '#00ff41',
          shadowOpacity: 60,
          effect: 'matrix',
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 8. Golden Elegance
      {
        id: 'album_preset_8',
        title: 'golden - Luxury',
        timestamp: Date.now() - 28800000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#1a1a1a"/><text x="50%" y="50%" font-family="Arial" font-size="18" fill="#ffd700" text-anchor="middle" dy=".3em">golden</text></svg>')}`,
        state: {
          backgroundImage: null,
          backgroundImageData: null,
          imageBlur: 0,
          imageOpacity: 100,
          colorOverlay: true,
          overlayColor: '#1a1a1a',
          overlayOpacity: 100,
          text: 'golden',
          fontSize: 92,
          fontFamily: 'lora',
          textColor: '#ffd700',
          textAlignment: 'center',
          letterSpacing: 1,
          outline: 'thin',
          outlineColor: '#b8860b',
          shadow: true,
          shadowX: 3,
          shadowY: 3,
          shadowBlur: 10,
          shadowColor: '#daa520',
          shadowOpacity: 50,
          effect: 'metallic',
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 9. Ocean Wave
      {
        id: 'album_preset_9',
        title: 'ocean - Deep Blue',
        timestamp: Date.now() - 32400000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#006994"/><text x="50%" y="50%" font-family="Arial" font-size="20" fill="#87ceeb" text-anchor="middle" dy=".3em">ocean</text></svg>')}`,
        state: {
          backgroundImage: null,
          backgroundImageData: null,
          imageBlur: 0,
          imageOpacity: 100,
          colorOverlay: true,
          overlayColor: '#006994',
          overlayOpacity: 100,
          text: 'ocean',
          fontSize: 104,
          fontFamily: 'lobster',
          textColor: '#87ceeb',
          textAlignment: 'center',
          letterSpacing: 0,
          outline: 'medium',
          outlineColor: '#191970',
          shadow: true,
          shadowX: 2,
          shadowY: 2,
          shadowBlur: 8,
          shadowColor: '#003d5c',
          shadowOpacity: 40,
          effect: 'wave',
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 10. Sunset Glow
      {
        id: 'album_preset_10',
        title: 'sunset - Orange Glow',
        timestamp: Date.now() - 36000000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#ff6347"/><text x="50%" y="50%" font-family="Arial" font-size="18" fill="#ffd700" text-anchor="middle" dy=".3em">sunset</text></svg>')}`,
        state: {
          backgroundImage: null,
          backgroundImageData: null,
          imageBlur: 0,
          imageOpacity: 100,
          colorOverlay: true,
          overlayColor: '#ff6347',
          overlayOpacity: 100,
          text: 'sunset',
          fontSize: 96,
          fontFamily: 'satisfy',
          textColor: '#ffd700',
          textAlignment: 'center',
          letterSpacing: 2,
          outline: 'thin',
          outlineColor: '#ff4500',
          shadow: true,
          shadowX: 2,
          shadowY: 2,
          shadowBlur: 12,
          shadowColor: '#dc143c',
          shadowOpacity: 50,
          effect: 'gradient',
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 11. Forest Green
      {
        id: 'album_preset_11',
        title: 'forest - Nature Green',
        timestamp: Date.now() - 39600000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#228b22"/><text x="50%" y="50%" font-family="Arial" font-size="18" fill="#90ee90" text-anchor="middle" dy=".3em">forest</text></svg>')}`,
        state: {
          backgroundImage: null,
          backgroundImageData: null,
          imageBlur: 0,
          imageOpacity: 100,
          colorOverlay: true,
          overlayColor: '#228b22',
          overlayOpacity: 100,
          text: 'forest',
          fontSize: 100,
          fontFamily: 'ubuntu',
          textColor: '#90ee90',
          textAlignment: 'center',
          letterSpacing: 1,
          outline: 'medium',
          outlineColor: '#006400',
          shadow: true,
          shadowX: 3,
          shadowY: 3,
          shadowBlur: 9,
          shadowColor: '#013220',
          shadowOpacity: 60,
          effect: 'natural',
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 12. Purple Haze
      {
        id: 'album_preset_12',
        title: 'purple - Mystical Haze',
        timestamp: Date.now() - 43200000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#663399"/><text x="50%" y="50%" font-family="Arial" font-size="18" fill="#dda0dd" text-anchor="middle" dy=".3em">purple</text></svg>')}`,
        state: {
          backgroundImage: null,
          backgroundImageData: null,
          imageBlur: 0,
          imageOpacity: 100,
          colorOverlay: true,
          overlayColor: '#663399',
          overlayOpacity: 100,
          text: 'purple',
          fontSize: 98,
          fontFamily: 'great-vibes',
          textColor: '#dda0dd',
          textAlignment: 'center',
          letterSpacing: 0,
          outline: 'thin',
          outlineColor: '#4b0082',
          shadow: true,
          shadowX: 2,
          shadowY: 2,
          shadowBlur: 10,
          shadowColor: '#8b008b',
          shadowOpacity: 45,
          effect: 'mystical',
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 13. Monospace Code
      {
        id: 'album_preset_13',
        title: 'code - Developer Style',
        timestamp: Date.now() - 46800000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#2d2d2d"/><text x="50%" y="50%" font-family="Arial" font-size="22" fill="#00ff00" text-anchor="middle" dy=".3em">code</text></svg>')}`,
        state: {
          backgroundImage: null,
          backgroundImageData: null,
          imageBlur: 0,
          imageOpacity: 100,
          colorOverlay: true,
          overlayColor: '#2d2d2d',
          overlayOpacity: 100,
          text: 'code',
          fontSize: 76,
          fontFamily: 'fira-code',
          textColor: '#00ff00',
          textAlignment: 'center',
          letterSpacing: 5,
          outline: 'none',
          outlineColor: '#000000',
          shadow: true,
          shadowX: 1,
          shadowY: 1,
          shadowBlur: 4,
          shadowColor: '#008000',
          shadowOpacity: 80,
          effect: 'terminal',
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 14. Art Deco
      {
        id: 'album_preset_14',
        title: 'deco - Art Style',
        timestamp: Date.now() - 50400000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#b8860b"/><text x="50%" y="50%" font-family="Arial" font-size="22" fill="#000000" text-anchor="middle" dy=".3em">deco</text></svg>')}`,
        state: {
          backgroundImage: null,
          backgroundImageData: null,
          imageBlur: 0,
          imageOpacity: 100,
          colorOverlay: true,
          overlayColor: '#b8860b',
          overlayOpacity: 100,
          text: 'deco',
          fontSize: 86,
          fontFamily: 'bebas-neue',
          textColor: '#000000',
          textAlignment: 'center',
          letterSpacing: 8,
          outline: 'medium',
          outlineColor: '#ffd700',
          shadow: true,
          shadowX: 4,
          shadowY: 4,
          shadowBlur: 8,
          shadowColor: '#8b7d6b',
          shadowOpacity: 50,
          effect: 'classic',
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 15. Ice Blue
      {
        id: 'album_preset_15',
        title: 'ice - Crystal Blue',
        timestamp: Date.now() - 54000000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#b0e0e6"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="#191970" text-anchor="middle" dy=".3em">ice</text></svg>')}`,
        state: {
          backgroundImage: null,
          backgroundImageData: null,
          imageBlur: 0,
          imageOpacity: 100,
          colorOverlay: true,
          overlayColor: '#b0e0e6',
          overlayOpacity: 100,
          text: 'ice',
          fontSize: 120,
          fontFamily: 'montserrat',
          textColor: '#191970',
          textAlignment: 'center',
          letterSpacing: 4,
          outline: 'thin',
          outlineColor: '#4682b4',
          shadow: true,
          shadowX: 2,
          shadowY: 2,
          shadowBlur: 6,
          shadowColor: '#6495ed',
          shadowOpacity: 30,
          effect: 'ice',
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 16. Grunge Rock
      {
        id: 'album_preset_16',
        title: 'grunge - Rock Style',
        timestamp: Date.now() - 57600000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#696969"/><text x="50%" y="50%" font-family="Arial" font-size="18" fill="#ffffff" text-anchor="middle" dy=".3em">grunge</text></svg>')}`,
        state: {
          backgroundImage: null,
          backgroundImageData: null,
          imageBlur: 0,
          imageOpacity: 100,
          colorOverlay: true,
          overlayColor: '#696969',
          overlayOpacity: 100,
          text: 'grunge',
          fontSize: 82,
          fontFamily: 'permanent-marker',
          textColor: '#ffffff',
          textAlignment: 'center',
          letterSpacing: 2,
          outline: 'thick',
          outlineColor: '#000000',
          shadow: true,
          shadowX: 3,
          shadowY: 3,
          shadowBlur: 8,
          shadowColor: '#2f2f2f',
          shadowOpacity: 70,
          effect: 'grunge',
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 17. Candy Pop
      {
        id: 'album_preset_17',
        title: 'candy - Sweet Pop',
        timestamp: Date.now() - 61200000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#ff69b4"/><text x="50%" y="50%" font-family="Arial" font-size="20" fill="#ffffff" text-anchor="middle" dy=".3em">candy</text></svg>')}`,
        state: {
          backgroundImage: null,
          backgroundImageData: null,
          imageBlur: 0,
          imageOpacity: 100,
          colorOverlay: true,
          overlayColor: '#ff69b4',
          overlayOpacity: 100,
          text: 'candy',
          fontSize: 102,
          fontFamily: 'fredoka-one',
          textColor: '#ffffff',
          textAlignment: 'center',
          letterSpacing: 0,
          outline: 'medium',
          outlineColor: '#ff1493',
          shadow: true,
          shadowX: 3,
          shadowY: 3,
          shadowBlur: 8,
          shadowColor: '#da70d6',
          shadowOpacity: 40,
          effect: 'bubblegum',
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 18. Space Cosmic
      {
        id: 'album_preset_18',
        title: 'cosmic - Space Theme',
        timestamp: Date.now() - 64800000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#191970"/><text x="50%" y="50%" font-family="Arial" font-size="18" fill="#9370db" text-anchor="middle" dy=".3em">cosmic</text></svg>')}`,
        state: {
          backgroundImage: null,
          backgroundImageData: null,
          imageBlur: 0,
          imageOpacity: 100,
          colorOverlay: true,
          overlayColor: '#191970',
          overlayOpacity: 100,
          text: 'cosmic',
          fontSize: 90,
          fontFamily: 'exo',
          textColor: '#9370db',
          textAlignment: 'center',
          letterSpacing: 3,
          outline: 'medium',
          outlineColor: '#483d8b',
          shadow: true,
          shadowX: 0,
          shadowY: 0,
          shadowBlur: 15,
          shadowColor: '#8a2be2',
          shadowOpacity: 60,
          effect: 'cosmic',
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 19. Retro Wave
      {
        id: 'album_preset_19',
        title: 'retro - 80s Wave',
        timestamp: Date.now() - 68400000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#800080"/><text x="50%" y="50%" font-family="Arial" font-size="20" fill="#00ffff" text-anchor="middle" dy=".3em">retro</text></svg>')}`,
        state: {
          backgroundImage: null,
          backgroundImageData: null,
          imageBlur: 0,
          imageOpacity: 100,
          colorOverlay: true,
          overlayColor: '#800080',
          overlayOpacity: 100,
          text: 'retro',
          fontSize: 94,
          fontFamily: 'rajdhani',
          textColor: '#00ffff',
          textAlignment: 'center',
          letterSpacing: 6,
          outline: 'medium',
          outlineColor: '#ff00ff',
          shadow: true,
          shadowX: 0,
          shadowY: 0,
          shadowBlur: 12,
          shadowColor: '#00ffff',
          shadowOpacity: 70,
          effect: 'retrowave',
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 20. Clean Modern
      {
        id: 'album_preset_20',
        title: 'modern - Clean Design',
        timestamp: Date.now() - 72000000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#f5f5f5"/><text x="50%" y="50%" font-family="Arial" font-size="18" fill="#333333" text-anchor="middle" dy=".3em">modern</text></svg>')}`,
        state: {
          backgroundImage: null,
          backgroundImageData: null,
          imageBlur: 0,
          imageOpacity: 100,
          colorOverlay: true,
          overlayColor: '#f5f5f5',
          overlayOpacity: 100,
          text: 'modern',
          fontSize: 88,
          fontFamily: 'roboto',
          textColor: '#333333',
          textAlignment: 'center',
          letterSpacing: 2,
          outline: 'none',
          outlineColor: '#000000',
          shadow: false,
          shadowX: 0,
          shadowY: 0,
          shadowBlur: 10,
          shadowColor: '#000000',
          shadowOpacity: 40,
          effect: 'none',
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      }
    ];
    
    // Take only first 16 presets
    this.gallery = presets.slice(0, 16);
  }

  /**
   * Get gallery items
   * @returns {Array} Gallery items
   */
  getGalleryItems() {
    return [...this.gallery];
  }

  /**
   * Get gallery item by ID
   * @param {string} itemId - Item ID
   * @returns {Object|null} Gallery item or null
   */
  getGalleryItem(itemId) {
    return this.gallery.find(item => item.id === itemId) || null;
  }

  /**
   * Validate gallery item structure
   * @param {Object} item - Gallery item to validate
   * @returns {boolean} Validation result
   */
  validateGalleryItem(item) {
    return (
      item &&
      typeof item.id === 'string' &&
      typeof item.timestamp === 'number' &&
      typeof item.thumbnail === 'string' &&
      typeof item.state === 'object' &&
      item.thumbnail.startsWith('data:image/') &&
      item.state.text !== undefined
    );
  }

  /**
   * Render gallery in the container
   */
  renderGallery() {
    this.renderToContainer(this.desktopContainer);
    this.renderToContainer(this.mobileContainer);
  }

  renderToContainer(container) {
    if (!container) return;

    container.innerHTML = '';

    // Create gallery items - always show all 16 slots  
    for (let i = 0; i < this.maxItems; i++) {
      const item = this.gallery[i];
      const galleryItem = this.createGalleryItemElement(item, i);
      container.appendChild(galleryItem);
    }

    // Add clear all button if gallery has real user-created items (not presets)
    const realItems = this.gallery.filter(item => item && !item.id.startsWith('sample') && !item.id.startsWith('album_preset_'));
    if (realItems.length > 0) {
      this.addClearAllButtonToContainer(container);
    }

    // Initialize Lucide icons after rendering
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  /**
   * Create gallery item element
   * @param {Object|null} item - Gallery item data
   * @param {number} index - Item index
   * @returns {HTMLElement} Gallery item element
   */
  createGalleryItemElement(item, index) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    
    if (item) {
      // Item with content
      galleryItem.innerHTML = `
        <img src="${item.thumbnail}" alt="${item.title}" loading="lazy">
        <div class="gallery-item-info">
          <div class="gallery-item-title">${this.truncateText(item.title, 20)}</div>
          <div class="gallery-item-date">${this.formatDate(item.timestamp)}</div>
        </div>
        <div class="gallery-item-actions">
          <button class="gallery-item-action preview" data-id="${item.id}" title="Load to canvas">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24"></path></svg>
          </button>
          <button class="gallery-item-action delete" data-id="${item.id}" title="Delete">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c0 1 1 2 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
          </button>
        </div>
      `;

      // Add event listeners
      const previewBtn = galleryItem.querySelector('.preview');
      const deleteBtn = galleryItem.querySelector('.delete');
      
      if (previewBtn) {
        previewBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.onItemPreview(item.id);
        });
      }

      if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.onItemDelete(item.id);
        });
      }

      // Click on item to load (but not on action buttons)
      galleryItem.addEventListener('click', (e) => {
        if (!e.target.closest('.gallery-item-action')) {
          this.onItemClick(item.id);
        }
      });
      
    } else {
      // Empty slot
      galleryItem.classList.add('empty');
      galleryItem.innerHTML = `
        <div class="gallery-empty-content">
          <i data-lucide="plus"></i>
          <span>Empty Slot</span>
        </div>
      `;
    }

    return galleryItem;
  }

  addClearAllButtonToContainer(container) {
    if (!container) return;
    
    // Check if clear all button already exists for this container
    const existingClearAll = container.parentElement.querySelector('.gallery-clear-all');
    if (existingClearAll) {
      return; // Don't add another one
    }

    const clearAllContainer = document.createElement('div');
    clearAllContainer.className = 'gallery-clear-all';
    clearAllContainer.innerHTML = `
      <button class="btn btn-outline btn-sm clear-gallery-btn">
        <i data-lucide="trash-2"></i>
        Clear All
      </button>
    `;

    const clearBtn = clearAllContainer.querySelector('.clear-gallery-btn');
    clearBtn.addEventListener('click', () => this.confirmClearAll());

    container.parentElement.appendChild(clearAllContainer);

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  /**
   * Handle gallery item click
   * @param {string} itemId - Item ID
   */
  onItemClick(itemId) {
    this.onItemPreview(itemId); // Use the same logic as preview button
  }

  /**
   * Handle gallery item preview (load to canvas)
   * @param {string} itemId - Item ID
   */
  onItemPreview(itemId) {
    const item = this.gallery.find(g => g.id === itemId);
    console.log('Loading album from gallery:', itemId, item);
    
    if (item && item.state) {
      try {
        console.log('Loading album state:', item.state);
        
        // Clear any invalid background image from preset
        if (item.state.backgroundImage && typeof item.state.backgroundImage !== 'object') {
          item.state.backgroundImage = null;
          item.state.backgroundImageData = null;
        }
        
        // Ensure canvas dimensions are synced with export dimensions
        const stateToLoad = { ...item.state };
        if (stateToLoad.canvasWidth && stateToLoad.canvasHeight) {
          stateToLoad.exportWidth = stateToLoad.canvasWidth;
          stateToLoad.exportHeight = stateToLoad.canvasHeight;
          console.log(`✓ Syncing album canvas size: ${stateToLoad.canvasWidth}x${stateToLoad.canvasHeight}`);
        }
        
        // Load the item's state to album state
        Object.assign(albumState, stateToLoad);
        
        // Ensure all elements are editable with proper IDs
        if (albumState.textElements) {
          albumState.textElements.forEach(t => {
            if (!t.id) t.id = Date.now() + Math.random();
            t.selected = false;
          });
        }
        if (albumState.stickers) {
          albumState.stickers.forEach(s => {
            if (!s.id) s.id = Date.now() + Math.random();
          });
        }
        
        // Ensure editing capabilities are preserved
        albumState.backgroundImage = null; // Clear any invalid background image references
        albumState.backgroundImageData = null;
        
        // Update canvas size if it changed
        if (stateToLoad.canvasWidth && stateToLoad.canvasHeight) {
          if (typeof resizeCanvas === 'function') {
            resizeCanvas(stateToLoad.canvasWidth, stateToLoad.canvasHeight);
          } else {
            // Fallback if resizeCanvas not available
            if (canvas) {
              canvas.width = stateToLoad.canvasWidth;
              canvas.height = stateToLoad.canvasHeight;
            }
            if (typeof drawCanvas === 'function') {
              drawCanvas();
            }
          }
        } else {
          // Update the canvas
          if (typeof drawCanvas === 'function') {
            drawCanvas();
          }
        }
        
        // Update UI controls to reflect the loaded state (including export size controls)
        this.updateUIFromState(stateToLoad);
        
        // Show success message
        
        console.log('Album gallery item loaded successfully!');
      } catch (error) {
        console.error('Failed to load album from gallery:', error);
      }
    } else {
      console.error('Album gallery item not found or invalid');
    }
  }

  /**
   * Update UI controls from loaded state
   * @param {Object} state - Loaded state
   */
  updateUIFromState(state) {
    // Update text input
    if (state.text) {
      const textInput = document.getElementById('textInput');
      if (textInput) {
        textInput.value = state.text;
      }
    }

    // Update font selection
    if (state.fontKey) {
      const fontSelect = document.getElementById('fontSelect');
      if (fontSelect) {
        fontSelect.value = state.fontKey;
      }
    }

    // Update font size
    if (state.fontSize) {
      const fontSizeSlider = document.getElementById('fontSizeSlider');
      const fontSizeValue = document.getElementById('fontSizeValue');
      if (fontSizeSlider) {
        fontSizeSlider.value = state.fontSize;
      }
      if (fontSizeValue) {
        fontSizeValue.textContent = state.fontSize;
      }
    }

    // Update text color
    if (state.textColor) {
      const textColorPicker = document.getElementById('textColorPicker');
      if (textColorPicker) {
        textColorPicker.value = state.textColor;
      }
    }

    // Update background color
    if (state.backgroundColor) {
      const bgColorPicker = document.getElementById('backgroundColorPicker');
      if (bgColorPicker) {
        bgColorPicker.value = state.backgroundColor;
      }
    }

    // Update background image if present
    if (state.backgroundImage && state.backgroundImage.src) {
      // Restore background image
      const img = new Image();
      img.onload = () => {
        if (typeof albumState !== 'undefined') {
          albumState.backgroundImage = img;
          if (typeof drawCanvas === 'function') {
            drawCanvas();
          }
        }
      };
      img.src = state.backgroundImage.src;
    }

    // Update outline settings
    if (state.outline) {
      const outlineSelect = document.getElementById('outlineSelect');
      const outlineColorPicker = document.getElementById('outlineColorPicker');
      if (outlineSelect) {
        outlineSelect.value = state.outline.type || 'none';
      }
      if (outlineColorPicker) {
        outlineColorPicker.value = state.outline.color || '#ffffff';
      }
    }

    // Update letter spacing
    if (state.letterSpacing !== undefined) {
      const letterSpacingSlider = document.getElementById('letterSpacingSlider');
      const letterSpacingValue = document.getElementById('letterSpacingValue');
      if (letterSpacingSlider) {
        letterSpacingSlider.value = state.letterSpacing;
      }
      if (letterSpacingValue) {
        letterSpacingValue.textContent = state.letterSpacing;
      }
    }

    // Update alignment
    if (state.textAlignment) {
      const alignButtons = document.querySelectorAll('#alignLeft, #alignCenter, #alignRight');
      alignButtons.forEach(btn => btn.classList.remove('active'));
      
      const alignButton = document.getElementById('align' + state.textAlignment.charAt(0).toUpperCase() + state.textAlignment.slice(1));
      if (alignButton) {
        alignButton.classList.add('active');
      }
    }

    // Update shadow settings
    if (state.shadow !== undefined) {
      const shadowToggle = document.getElementById('shadowToggle');
      if (shadowToggle) {
        shadowToggle.checked = state.shadow;
      }
    }

    // Update effect settings
    if (state.effect) {
      const effectSelect = document.getElementById('effectSelect');
      if (effectSelect) {
        effectSelect.value = state.effect;
      }
    }

    // Update canvas size controls to match loaded state
    if (state.canvasWidth && state.canvasHeight) {
      // Update export size controls
      const customExportWidthDesktop = document.getElementById('customExportWidthDesktop');
      const customExportHeightDesktop = document.getElementById('customExportHeightDesktop');
      const customExportWidth = document.getElementById('customExportWidth');
      const customExportHeight = document.getElementById('customExportHeight');
      
      if (customExportWidthDesktop) customExportWidthDesktop.value = state.canvasWidth;
      if (customExportHeightDesktop) customExportHeightDesktop.value = state.canvasHeight;
      if (customExportWidth) customExportWidth.value = state.canvasWidth;
      if (customExportHeight) customExportHeight.value = state.canvasHeight;
      
      // Update state to match loaded canvas size
      albumState.exportWidth = state.canvasWidth;
      albumState.exportHeight = state.canvasHeight;
      albumState.canvasWidth = state.canvasWidth;
      albumState.canvasHeight = state.canvasHeight;
      
      // Check if canvas size matches any preset, otherwise use custom
      const currentSize = `${state.canvasWidth}x${state.canvasHeight}`;
      const exportSizePresetDesktop = document.getElementById('exportSizePresetDesktop');
      const exportSizePreset = document.getElementById('exportSizePreset');
      
      // Check desktop preset dropdown
      if (exportSizePresetDesktop) {
        const desktopOptions = Array.from(exportSizePresetDesktop.options);
        const matchingDesktopOption = desktopOptions.find(opt => opt.value === currentSize);
        if (matchingDesktopOption) {
          exportSizePresetDesktop.value = currentSize;
          const customGroupDesktop = document.getElementById('customExportSizeGroupDesktop');
          if (customGroupDesktop) customGroupDesktop.style.display = 'none';
        } else {
          exportSizePresetDesktop.value = 'custom';
          const customGroupDesktop = document.getElementById('customExportSizeGroupDesktop');
          if (customGroupDesktop) customGroupDesktop.style.display = 'block';
        }
      }
      
      // Check mobile preset dropdown
      if (exportSizePreset) {
        const mobileOptions = Array.from(exportSizePreset.options);
        const matchingMobileOption = mobileOptions.find(opt => opt.value === currentSize);
        if (matchingMobileOption) {
          exportSizePreset.value = currentSize;
          const customGroup = document.getElementById('customExportSizeGroup');
          if (customGroup) customGroup.style.display = 'none';
        } else {
          exportSizePreset.value = 'custom';
          const customGroup = document.getElementById('customExportSizeGroup');
          if (customGroup) customGroup.style.display = 'block';
        }
      }
    }

    // Clear any background image references to allow new uploads
    const bgUploadBtn = document.getElementById('backgroundUpload');
    if (bgUploadBtn) {
      bgUploadBtn.value = '';
    }

    // Redraw canvas
    if (typeof drawCanvas === 'function') {
      drawCanvas();
    }
  }

  /**
   * Handle gallery item delete
   * @param {string} itemId - Item ID
   */
  onItemDelete(itemId) {
    const item = this.getGalleryItem(itemId);
    if (item) {
      const confirmed = confirm(`Delete "${item.title}" from gallery?`);
      if (confirmed) {
        this.deleteFromGallery(itemId);
      }
    }
  }

  /**
   * Confirm clear all action
   */
  confirmClearAll() {
    const confirmed = confirm('Clear all items from gallery? This action cannot be undone.');
    if (confirmed) {
      this.clearGallery();
      
      // Remove clear all buttons from both containers
      [this.desktopContainer, this.mobileContainer].forEach(container => {
        if (container && container.parentElement) {
          const clearAllContainer = container.parentElement.querySelector('.gallery-clear-all');
          if (clearAllContainer) {
            clearAllContainer.remove();
          }
        }
      });
      
    }
  }

  /**
   * Truncate text to specified length
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @returns {string} Truncated text
   */
  truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }

  /**
   * Format timestamp for display
   * @param {number} timestamp - Timestamp to format
   * @returns {string} Formatted date
   */
  formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  /**
   * Generate unique ID
   * @returns {string} Unique ID
   */
  generateId() {
    return 'album_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Deep clone object
   * @param {Object} obj - Object to clone
   * @returns {Object} Cloned object
   */
  deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj);
    if (obj instanceof Array) return obj.map(item => this.deepClone(item));
    
    const cloned = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Skip functions and complex objects like HTMLImageElement
        if (typeof obj[key] === 'function' || obj[key] instanceof HTMLElement) {
          continue;
        }
        cloned[key] = this.deepClone(obj[key]);
      }
    }
    return cloned;
  }
}

