// Gallery management for the Brat Meme Generator

class MemeGalleryManager {
  constructor(desktopContainer, mobileContainer) {
    this.desktopContainer = desktopContainer;
    this.mobileContainer = mobileContainer;
    this.storageKey = 'bratMemeGeneratorGallery';
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
      console.error('Failed to load meme gallery from localStorage:', error);
      this.gallery = [];
    }
    
    // Always ensure we have sample presets for demonstration
    // Force reset gallery to have only 16 presets (so deletions are visible)
    if (this.gallery.length === 0 || this.gallery.length > 16) {
      this.gallery = [];
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
      console.error('Failed to save meme gallery to localStorage:', error);
      
      // If storage is full, try to clear some space
      if (error.name === 'QuotaExceededError') {
        this.clearOldItems();
        try {
          localStorage.setItem(this.storageKey, JSON.stringify(this.gallery));
        } catch (retryError) {
          console.error('Failed to save meme gallery after clearing space:', retryError);
        }
      }
    }
  }

  /**
   * Clear old gallery items to free space
   */
  clearOldItems() {
    // Keep only half the items (8 newest)
    this.gallery = this.gallery.slice(0, 8);
  }

  /**
   * Add item to gallery
   * @param {string} thumbnailDataUrl - Thumbnail image data URL
   * @param {Object} state - Meme state snapshot
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
   * @param {Object} state - Meme state
   * @returns {string} Generated title
   */
  generateItemTitle(state) {
    let title = 'Untitled Meme';
    
    // Get main text from first text element
    if (state.textElements && state.textElements.length > 0) {
      const mainText = state.textElements[0].text || 'Untitled';
      title = mainText.length > 15 ? mainText.substring(0, 15) + '...' : mainText;
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
    console.log('🗑️ DELETE FROM GALLERY: Looking for ID =', itemId);
    const index = this.gallery.findIndex(item => item.id === itemId);
    console.log('🗑️ Found at index:', index);
    if (index > -1) {
      console.log('🗑️ Removing item from index:', index);
      this.gallery.splice(index, 1);
      console.log('🗑️ New gallery length after splice:', this.gallery.length);
      this.saveGallery();
      console.log('🗑️ Saved to localStorage');
      this.renderGallery();
      console.log('🗑️ Re-rendered gallery');
    } else {
      console.log('🗑️ ERROR: Index not found for item ID:', itemId);
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
      // 1. Classic Brat
      {
        id: 'preset_1',
        title: 'brat - Classic Green',
        timestamp: Date.now() - 3600000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#8ACE00"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="#ff69b4" text-anchor="middle" dy=".3em" font-weight="bold">brat</text></svg>')}`,
        state: {
          backgroundColor: '#8ACE00',
          backgroundImage: null,
          backgroundImageData: null,
          blendMode: 'normal',
          imageOpacity: 100,
          textElements: [{ id: 1, text: 'brat', fontSize: 128, fontFamily: 'fredoka-one', textColor: '#ff69b4', textAlignment: 'center', textStyle: 'bubble', x: 250, y: 250, selected: true }],
          currentTextId: 1,
          outline: true,
          outlineWidth: 4,
          outlineColor: '#000000',
          shadow: true,
          shadowX: 2,
          shadowY: 2,
          shadowBlur: 6,
          shadowColor: '#ff1493',
          aesthetic: 'glitter',
          aestheticIntensity: 50,
          stickers: [],
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 2. Summer Vibes
      {
        id: 'preset_2',
        title: 'summer - Neon Pink',
        timestamp: Date.now() - 7200000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#ff1493"/><text x="50%" y="50%" font-family="Arial" font-size="18" fill="#00ffff" text-anchor="middle" dy=".3em" font-weight="bold">summer</text></svg>')}`,
        state: {
          backgroundColor: '#ff1493',
          backgroundImage: null,
          backgroundImageData: null,
          blendMode: 'normal',
          imageOpacity: 100,
          textElements: [{ id: 1, text: 'summer', fontSize: 120, fontFamily: 'bebas-neue', textColor: '#00ffff', textAlignment: 'center', textStyle: 'neon', x: 250, y: 250, selected: true }],
          currentTextId: 1,
          outline: true,
          outlineWidth: 6,
          outlineColor: '#000000',
          shadow: true,
          shadowX: 4,
          shadowY: 4,
          shadowBlur: 10,
          shadowColor: '#ff69b4',
          aesthetic: 'neonPink',
          aestheticIntensity: 75,
          stickers: [{ emoji: '☀️', x: 100, y: 100, size: 40 }, { emoji: '🌴', x: 400, y: 150, size: 35 }],
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 3. Princess Energy
      {
        id: 'preset_3',
        title: 'princess - Crown Vibes',
        timestamp: Date.now() - 10800000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#ff69b4"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="#ffd700" text-anchor="middle" dy=".3em" font-weight="bold">princess</text></svg>')}`,
        state: {
          backgroundColor: '#ff69b4',
          backgroundImage: null,
          backgroundImageData: null,
          blendMode: 'normal',
          imageOpacity: 100,
          textElements: [{ id: 1, text: 'princess', fontSize: 110, fontFamily: 'dancing-script', textColor: '#ffd700', textAlignment: 'center', textStyle: 'glossy', x: 250, y: 250, selected: true }],
          currentTextId: 1,
          outline: true,
          outlineWidth: 3,
          outlineColor: '#ffffff',
          shadow: true,
          shadowX: 3,
          shadowY: 3,
          shadowBlur: 8,
          shadowColor: '#da70d6',
          aesthetic: 'rhinestones',
          aestheticIntensity: 80,
          stickers: [{ emoji: '👑', x: 250, y: 150, size: 50 }, { emoji: '💎', x: 150, y: 350, size: 30 }, { emoji: '✨', x: 350, y: 350, size: 25 }],
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 4. Dark Mode
      {
        id: 'preset_4',
        title: 'mood - Dark Aesthetic',
        timestamp: Date.now() - 14400000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#000000"/><text x="50%" y="50%" font-family="Arial" font-size="22" fill="#8a2be2" text-anchor="middle" dy=".3em" font-weight="bold">mood</text></svg>')}`,
        state: {
          backgroundColor: '#000000',
          backgroundImage: null,
          backgroundImageData: null,
          blendMode: 'normal',
          imageOpacity: 100,
          textElements: [{ id: 1, text: 'mood', fontSize: 140, fontFamily: 'anton', textColor: '#8a2be2', textAlignment: 'center', textStyle: 'chrome', x: 250, y: 250, selected: true }],
          currentTextId: 1,
          outline: true,
          outlineWidth: 5,
          outlineColor: '#ffffff',
          shadow: true,
          shadowX: 5,
          shadowY: 5,
          shadowBlur: 12,
          shadowColor: '#4b0082',
          aesthetic: 'chrome',
          aestheticIntensity: 60,
          stickers: [{ emoji: '🌙', x: 100, y: 100, size: 35 }, { emoji: '⭐', x: 400, y: 120, size: 25 }],
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 5. Rainbow Energy
      {
        id: 'preset_5',
        title: 'rainbow - Holographic',
        timestamp: Date.now() - 18000000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#ff0000;stop-opacity:1" /><stop offset="16%" style="stop-color:#ff8000;stop-opacity:1" /><stop offset="33%" style="stop-color:#ffff00;stop-opacity:1" /><stop offset="50%" style="stop-color:#00ff00;stop-opacity:1" /><stop offset="66%" style="stop-color:#0080ff;stop-opacity:1" /><stop offset="83%" style="stop-color:#8000ff;stop-opacity:1" /><stop offset="100%" style="stop-color:#ff00ff;stop-opacity:1" /></linearGradient></defs><rect width="100" height="100" fill="url(#rainbow)"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="#ffffff" text-anchor="middle" dy=".3em" font-weight="bold">rainbow</text></svg>')}`,
        state: {
          backgroundColor: '#ff00ff',
          backgroundImage: null,
          backgroundImageData: null,
          blendMode: 'normal',
          imageOpacity: 100,
          textElements: [{ id: 1, text: 'rainbow', fontSize: 115, fontFamily: 'bungee', textColor: '#ffffff', textAlignment: 'center', textStyle: 'gradient', x: 250, y: 250, selected: true }],
          currentTextId: 1,
          outline: true,
          outlineWidth: 4,
          outlineColor: '#000000',
          shadow: true,
          shadowX: 3,
          shadowY: 3,
          shadowBlur: 8,
          shadowColor: '#ff1493',
          aesthetic: 'rainbow',
          aestheticIntensity: 90,
          stickers: [{ emoji: '🌈', x: 250, y: 150, size: 45 }, { emoji: '🦄', x: 120, y: 350, size: 40 }, { emoji: '✨', x: 380, y: 370, size: 30 }],
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 6. Retro Vibes
      {
        id: 'preset_6',
        title: 'retro - 80s Aesthetic',
        timestamp: Date.now() - 21600000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#ff6347"/><text x="50%" y="50%" font-family="Arial" font-size="20" fill="#00ffff" text-anchor="middle" dy=".3em" font-weight="bold">retro</text></svg>')}`,
        state: {
          backgroundColor: '#ff6347',
          backgroundImage: null,
          backgroundImageData: null,
          blendMode: 'normal',
          imageOpacity: 100,
          textElements: [{ id: 1, text: 'retro', fontSize: 135, fontFamily: 'orbitron', textColor: '#00ffff', textAlignment: 'center', textStyle: 'chrome', x: 250, y: 250, selected: true }],
          currentTextId: 1,
          outline: true,
          outlineWidth: 6,
          outlineColor: '#ff00ff',
          shadow: true,
          shadowX: 4,
          shadowY: 4,
          shadowBlur: 10,
          shadowColor: '#8a2be2',
          aesthetic: 'metallic',
          aestheticIntensity: 70,
          stickers: [{ emoji: '📼', x: 100, y: 400, size: 35 }, { emoji: '🎵', x: 400, y: 100, size: 30 }],
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 7. Cute Overload
      {
        id: 'preset_7',
        title: 'cute - Kawaii Pink',
        timestamp: Date.now() - 25200000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#ffb6c1"/><text x="50%" y="50%" font-family="Arial" font-size="22" fill="#ff1493" text-anchor="middle" dy=".3em" font-weight="bold">cute</text></svg>')}`,
        state: {
          backgroundColor: '#ffb6c1',
          backgroundImage: null,
          backgroundImageData: null,
          blendMode: 'normal',
          imageOpacity: 100,
          textElements: [{ id: 1, text: 'cute', fontSize: 125, fontFamily: 'comfortaa', textColor: '#ff1493', textAlignment: 'center', textStyle: 'bubble', x: 250, y: 250, selected: true }],
          currentTextId: 1,
          outline: true,
          outlineWidth: 3,
          outlineColor: '#ffffff',
          shadow: true,
          shadowX: 2,
          shadowY: 2,
          shadowBlur: 6,
          shadowColor: '#ff69b4',
          aesthetic: 'sparkles',
          aestheticIntensity: 85,
          stickers: [{ emoji: '🎀', x: 150, y: 150, size: 40 }, { emoji: '💕', x: 350, y: 150, size: 35 }, { emoji: '🧸', x: 250, y: 380, size: 45 }],
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 8. Fire Energy
      {
        id: 'preset_8',
        title: 'fire - Hot Red',
        timestamp: Date.now() - 28800000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#ff0000"/><text x="50%" y="50%" font-family="Arial" font-size="22" fill="#ffd700" text-anchor="middle" dy=".3em" font-weight="bold">fire</text></svg>')}`,
        state: {
          backgroundColor: '#ff0000',
          backgroundImage: null,
          backgroundImageData: null,
          blendMode: 'normal',
          imageOpacity: 100,
          textElements: [{ id: 1, text: 'fire', fontSize: 150, fontFamily: 'bangers', textColor: '#ffd700', textAlignment: 'center', textStyle: 'gradient', x: 250, y: 250, selected: true }],
          currentTextId: 1,
          outline: true,
          outlineWidth: 7,
          outlineColor: '#000000',
          shadow: true,
          shadowX: 6,
          shadowY: 6,
          shadowBlur: 15,
          shadowColor: '#ff4500',
          aesthetic: 'metallic',
          aestheticIntensity: 95,
          stickers: [{ emoji: '🔥', x: 100, y: 100, size: 50 }, { emoji: '🔥', x: 400, y: 100, size: 50 }, { emoji: '💥', x: 250, y: 400, size: 45 }],
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 9. Ocean Vibes
      {
        id: 'preset_9',
        title: 'ocean - Deep Blue',
        timestamp: Date.now() - 32400000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#0080ff"/><text x="50%" y="50%" font-family="Arial" font-size="20" fill="#00ffff" text-anchor="middle" dy=".3em" font-weight="bold">ocean</text></svg>')}`,
        state: {
          backgroundColor: '#0080ff',
          backgroundImage: null,
          backgroundImageData: null,
          blendMode: 'normal',
          imageOpacity: 100,
          textElements: [{ id: 1, text: 'ocean', fontSize: 120, fontFamily: 'lobster', textColor: '#00ffff', textAlignment: 'center', textStyle: 'glossy', x: 250, y: 250, selected: true }],
          currentTextId: 1,
          outline: true,
          outlineWidth: 4,
          outlineColor: '#ffffff',
          shadow: true,
          shadowX: 3,
          shadowY: 3,
          shadowBlur: 8,
          shadowColor: '#000080',
          aesthetic: 'iridescent',
          aestheticIntensity: 65,
          stickers: [{ emoji: '🌊', x: 100, y: 400, size: 40 }, { emoji: '🐚', x: 400, y: 380, size: 35 }, { emoji: '🐙', x: 350, y: 120, size: 30 }],
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 10. Cosmic Galaxy
      {
        id: 'preset_10',
        title: 'cosmic - Space Vibes',
        timestamp: Date.now() - 36000000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#4b0082"/><text x="50%" y="50%" font-family="Arial" font-size="18" fill="#da70d6" text-anchor="middle" dy=".3em" font-weight="bold">cosmic</text></svg>')}`,
        state: {
          backgroundColor: '#4b0082',
          backgroundImage: null,
          backgroundImageData: null,
          blendMode: 'normal',
          imageOpacity: 100,
          textElements: [{ id: 1, text: 'cosmic', fontSize: 115, fontFamily: 'exo', textColor: '#da70d6', textAlignment: 'center', textStyle: 'chrome', x: 250, y: 250, selected: true }],
          currentTextId: 1,
          outline: true,
          outlineWidth: 5,
          outlineColor: '#ffffff',
          shadow: true,
          shadowX: 4,
          shadowY: 4,
          shadowBlur: 12,
          shadowColor: '#8a2be2',
          aesthetic: 'galaxy',
          aestheticIntensity: 85,
          stickers: [{ emoji: '🌌', x: 150, y: 100, size: 40 }, { emoji: '🛸', x: 350, y: 150, size: 35 }, { emoji: '👽', x: 250, y: 400, size: 30 }],
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 11. Love Energy
      {
        id: 'preset_11',
        title: 'love - Heart Vibes',
        timestamp: Date.now() - 39600000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#dc143c"/><text x="50%" y="50%" font-family="Arial" font-size="22" fill="#ffffff" text-anchor="middle" dy=".3em" font-weight="bold">love</text></svg>')}`,
        state: {
          backgroundColor: '#dc143c',
          backgroundImage: null,
          backgroundImageData: null,
          blendMode: 'normal',
          imageOpacity: 100,
          textElements: [{ id: 1, text: 'love', fontSize: 130, fontFamily: 'great-vibes', textColor: '#ffffff', textAlignment: 'center', textStyle: 'glossy', x: 250, y: 250, selected: true }],
          currentTextId: 1,
          outline: true,
          outlineWidth: 3,
          outlineColor: '#ffd700',
          shadow: true,
          shadowX: 3,
          shadowY: 3,
          shadowBlur: 8,
          shadowColor: '#8b0000',
          aesthetic: 'glitter',
          aestheticIntensity: 75,
          stickers: [{ emoji: '💖', x: 150, y: 150, size: 45 }, { emoji: '💕', x: 350, y: 150, size: 40 }, { emoji: '💋', x: 250, y: 380, size: 35 }],
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 12. Neon City
      {
        id: 'preset_12',
        title: 'neon - City Lights',
        timestamp: Date.now() - 43200000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#000000"/><text x="50%" y="50%" font-family="Arial" font-size="22" fill="#00ff87" text-anchor="middle" dy=".3em" font-weight="bold">neon</text></svg>')}`,
        state: {
          backgroundColor: '#000000',
          backgroundImage: null,
          backgroundImageData: null,
          blendMode: 'normal',
          imageOpacity: 100,
          textElements: [{ id: 1, text: 'neon', fontSize: 140, fontFamily: 'rajdhani', textColor: '#00ff87', textAlignment: 'center', textStyle: 'chrome', x: 250, y: 250, selected: true }],
          currentTextId: 1,
          outline: true,
          outlineWidth: 6,
          outlineColor: '#60efff',
          shadow: true,
          shadowX: 5,
          shadowY: 5,
          shadowBlur: 15,
          shadowColor: '#00ff87',
          aesthetic: 'neonPink',
          aestheticIntensity: 100,
          stickers: [{ emoji: '🌃', x: 100, y: 100, size: 40 }, { emoji: '⚡', x: 400, y: 120, size: 35 }],
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 13. Dreamy Pastel
      {
        id: 'preset_13',
        title: 'dream - Soft Pastels',
        timestamp: Date.now() - 46800000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#e6e6fa"/><text x="50%" y="50%" font-family="Arial" font-size="20" fill="#9370db" text-anchor="middle" dy=".3em" font-weight="bold">dream</text></svg>')}`,
        state: {
          backgroundColor: '#e6e6fa',
          backgroundImage: null,
          backgroundImageData: null,
          blendMode: 'normal',
          imageOpacity: 100,
          textElements: [{ id: 1, text: 'dream', fontSize: 125, fontFamily: 'caveat', textColor: '#9370db', textAlignment: 'center', textStyle: 'bubble', x: 250, y: 250, selected: true }],
          currentTextId: 1,
          outline: true,
          outlineWidth: 2,
          outlineColor: '#ffffff',
          shadow: true,
          shadowX: 2,
          shadowY: 2,
          shadowBlur: 5,
          shadowColor: '#dda0dd',
          aesthetic: 'iridescent',
          aestheticIntensity: 50,
          stickers: [{ emoji: '☁️', x: 120, y: 120, size: 35 }, { emoji: '🌙', x: 380, y: 140, size: 30 }, { emoji: '✨', x: 200, y: 380, size: 25 }],
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 14. Golden Hour
      {
        id: 'preset_14',
        title: 'golden - Sunset Vibes',
        timestamp: Date.now() - 50400000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#ffd700"/><text x="50%" y="50%" font-family="Arial" font-size="18" fill="#ff4500" text-anchor="middle" dy=".3em" font-weight="bold">golden</text></svg>')}`,
        state: {
          backgroundColor: '#ffd700',
          backgroundImage: null,
          backgroundImageData: null,
          blendMode: 'normal',
          imageOpacity: 100,
          textElements: [{ id: 1, text: 'golden', fontSize: 118, fontFamily: 'playfair-display', textColor: '#ff4500', textAlignment: 'center', textStyle: 'gradient', x: 250, y: 250, selected: true }],
          currentTextId: 1,
          outline: true,
          outlineWidth: 4,
          outlineColor: '#8b4513',
          shadow: true,
          shadowX: 3,
          shadowY: 3,
          shadowBlur: 8,
          shadowColor: '#ffa500',
          aesthetic: 'metallic',
          aestheticIntensity: 80,
          stickers: [{ emoji: '🌅', x: 150, y: 100, size: 40 }, { emoji: '✨', x: 350, y: 120, size: 30 }, { emoji: '🏆', x: 250, y: 400, size: 35 }],
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 15. Electric Purple
      {
        id: 'preset_15',
        title: 'electric - Purple Power',
        timestamp: Date.now() - 54000000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#8a2be2"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="#00ffff" text-anchor="middle" dy=".3em" font-weight="bold">electric</text></svg>')}`,
        state: {
          backgroundColor: '#8a2be2',
          backgroundImage: null,
          backgroundImageData: null,
          blendMode: 'normal',
          imageOpacity: 100,
          textElements: [{ id: 1, text: 'electric', fontSize: 105, fontFamily: 'monoton', textColor: '#00ffff', textAlignment: 'center', textStyle: 'chrome', x: 250, y: 250, selected: true }],
          currentTextId: 1,
          outline: true,
          outlineWidth: 5,
          outlineColor: '#ffffff',
          shadow: true,
          shadowX: 4,
          shadowY: 4,
          shadowBlur: 12,
          shadowColor: '#4b0082',
          aesthetic: 'holographic',
          aestheticIntensity: 90,
          stickers: [{ emoji: '⚡', x: 100, y: 100, size: 45 }, { emoji: '🔮', x: 400, y: 120, size: 40 }, { emoji: '💜', x: 250, y: 400, size: 35 }],
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 16. Fresh Mint
      {
        id: 'preset_16',
        title: 'fresh - Mint Green',
        timestamp: Date.now() - 57600000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#00fa9a"/><text x="50%" y="50%" font-family="Arial" font-size="20" fill="#006400" text-anchor="middle" dy=".3em" font-weight="bold">fresh</text></svg>')}`,
        state: {
          backgroundColor: '#00fa9a',
          backgroundImage: null,
          backgroundImageData: null,
          blendMode: 'normal',
          imageOpacity: 100,
          textElements: [{ id: 1, text: 'fresh', fontSize: 128, fontFamily: 'ubuntu', textColor: '#006400', textAlignment: 'center', textStyle: 'bubble', x: 250, y: 250, selected: true }],
          currentTextId: 1,
          outline: true,
          outlineWidth: 3,
          outlineColor: '#ffffff',
          shadow: true,
          shadowX: 2,
          shadowY: 2,
          shadowBlur: 6,
          shadowColor: '#228b22',
          aesthetic: 'sparkles',
          aestheticIntensity: 60,
          stickers: [{ emoji: '🌿', x: 120, y: 120, size: 35 }, { emoji: '🍃', x: 380, y: 140, size: 30 }, { emoji: '💚', x: 250, y: 400, size: 40 }],
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 17. Elegant Black
      {
        id: 'preset_17',
        title: 'elegant - Classic Black',
        timestamp: Date.now() - 61200000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#000000"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="#c0c0c0" text-anchor="middle" dy=".3em" font-weight="bold">elegant</text></svg>')}`,
        state: {
          backgroundColor: '#000000',
          backgroundImage: null,
          backgroundImageData: null,
          blendMode: 'normal',
          imageOpacity: 100,
          textElements: [{ id: 1, text: 'elegant', fontSize: 115, fontFamily: 'lora', textColor: '#c0c0c0', textAlignment: 'center', textStyle: 'glossy', x: 250, y: 250, selected: true }],
          currentTextId: 1,
          outline: true,
          outlineWidth: 2,
          outlineColor: '#ffffff',
          shadow: true,
          shadowX: 3,
          shadowY: 3,
          shadowBlur: 8,
          shadowColor: '#696969',
          aesthetic: 'chrome',
          aestheticIntensity: 70,
          stickers: [{ emoji: '🖤', x: 150, y: 380, size: 35 }, { emoji: '🤍', x: 350, y: 380, size: 35 }],
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 18. Cyber Punk
      {
        id: 'preset_18',
        title: 'cyber - Future Tech',
        timestamp: Date.now() - 64800000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#1a1a1a"/><text x="50%" y="50%" font-family="Arial" font-size="18" fill="#00ff41" text-anchor="middle" dy=".3em" font-weight="bold">cyber</text></svg>')}`,
        state: {
          backgroundColor: '#1a1a1a',
          backgroundImage: null,
          backgroundImageData: null,
          blendMode: 'normal',
          imageOpacity: 100,
          textElements: [{ id: 1, text: 'cyber', fontSize: 122, fontFamily: 'jetbrains-mono', textColor: '#00ff41', textAlignment: 'center', textStyle: 'chrome', x: 250, y: 250, selected: true }],
          currentTextId: 1,
          outline: true,
          outlineWidth: 4,
          outlineColor: '#ff00ff',
          shadow: true,
          shadowX: 4,
          shadowY: 4,
          shadowBlur: 10,
          shadowColor: '#00ffff',
          aesthetic: 'holographic',
          aestheticIntensity: 85,
          stickers: [{ emoji: '🤖', x: 100, y: 100, size: 40 }, { emoji: '💻', x: 400, y: 120, size: 35 }, { emoji: '🔋', x: 250, y: 400, size: 30 }],
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 19. Sunshine Yellow
      {
        id: 'preset_19',
        title: 'sunshine - Happy Yellow',
        timestamp: Date.now() - 68400000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#ffff00"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="#ff8c00" text-anchor="middle" dy=".3em" font-weight="bold">sunshine</text></svg>')}`,
        state: {
          backgroundColor: '#ffff00',
          backgroundImage: null,
          backgroundImageData: null,
          blendMode: 'normal',
          imageOpacity: 100,
          textElements: [{ id: 1, text: 'sunshine', fontSize: 108, fontFamily: 'amatic-sc', textColor: '#ff8c00', textAlignment: 'center', textStyle: 'bubble', x: 250, y: 250, selected: true }],
          currentTextId: 1,
          outline: true,
          outlineWidth: 4,
          outlineColor: '#ffffff',
          shadow: true,
          shadowX: 3,
          shadowY: 3,
          shadowBlur: 8,
          shadowColor: '#ffa500',
          aesthetic: 'sparkles',
          aestheticIntensity: 75,
          stickers: [{ emoji: '☀️', x: 150, y: 100, size: 50 }, { emoji: '🌻', x: 350, y: 120, size: 40 }, { emoji: '🌈', x: 250, y: 400, size: 35 }],
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      },
      
      // 20. Royal Purple
      {
        id: 'preset_20',
        title: 'royal - Purple Majesty',
        timestamp: Date.now() - 72000000,
        thumbnail: `data:image/svg+xml;base64,${btoa('<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#663399"/><text x="50%" y="50%" font-family="Arial" font-size="20" fill="#daa520" text-anchor="middle" dy=".3em" font-weight="bold">royal</text></svg>')}`,
        state: {
          backgroundColor: '#663399',
          backgroundImage: null,
          backgroundImageData: null,
          blendMode: 'normal',
          imageOpacity: 100,
          textElements: [{ id: 1, text: 'royal', fontSize: 130, fontFamily: 'merriweather', textColor: '#daa520', textAlignment: 'center', textStyle: 'gradient', x: 250, y: 250, selected: true }],
          currentTextId: 1,
          outline: true,
          outlineWidth: 5,
          outlineColor: '#ffffff',
          shadow: true,
          shadowX: 4,
          shadowY: 4,
          shadowBlur: 10,
          shadowColor: '#4b0082',
          aesthetic: 'rhinestones',
          aestheticIntensity: 95,
          stickers: [{ emoji: '👑', x: 250, y: 120, size: 50 }, { emoji: '💎', x: 120, y: 380, size: 40 }, { emoji: '🔮', x: 380, y: 380, size: 40 }],
          canvasWidth: 500,
          canvasHeight: 500,
          exportFormat: 'png'
        }
      }
    ];
    
    // Take only first 16 presets so deletions are immediately visible
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
      item.state.textElements !== undefined
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
    const realItems = this.gallery.filter(item => item && !item.id.startsWith('sample') && !item.id.startsWith('preset_'));
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
          console.log('🔴 DELETE BUTTON CLICKED for item:', item.id, item.title);
          // Force delete regardless of item type
          const confirmed = confirm(`Delete "${item.title}" from gallery?`);
          if (confirmed) {
            console.log('🔴 User confirmed, forcing delete of item:', item.id);
            const indexToRemove = this.gallery.findIndex(galleryItem => galleryItem.id === item.id);
            console.log('🔴 Found item at index:', indexToRemove);
            if (indexToRemove > -1) {
              console.log('🔴 Removing item from gallery array');
              this.gallery.splice(indexToRemove, 1);
              console.log('🔴 New gallery length:', this.gallery.length);
              this.saveGallery();
              console.log('🔴 Saved to localStorage');
              this.renderGallery();
              console.log('🔴 Re-rendered gallery');
            }
          }
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
    console.log('Loading meme from gallery:', itemId, item);
    
    if (item && item.state) {
      try {
        console.log('Loading meme state:', item.state);
        
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
          console.log(`✓ Syncing meme canvas size: ${stateToLoad.canvasWidth}x${stateToLoad.canvasHeight}`);
        }
        
        // Load the item's state to meme state
        Object.assign(memeState, stateToLoad);
        
        // Ensure editing capabilities are preserved
        memeState.backgroundImage = null; // Clear any invalid background image references
        memeState.backgroundImageData = null;
        
        // Update canvas size if it changed
        if (stateToLoad.canvasWidth && stateToLoad.canvasHeight) {
          if (typeof resizeMemeCanvas === 'function') {
            resizeMemeCanvas(stateToLoad.canvasWidth, stateToLoad.canvasHeight);
          } else {
            // Fallback if resizeMemeCanvas not available
            if (memeCanvas) {
              memeCanvas.width = stateToLoad.canvasWidth;
              memeCanvas.height = stateToLoad.canvasHeight;
            }
            drawMemeCanvas();
          }
        } else {
          // Update the canvas
          drawMemeCanvas();
        }
        
        // Update UI controls to reflect the loaded state (including export size controls)
        this.updateUIFromState(stateToLoad);
        
        // Show success message
        
        console.log('Meme gallery item loaded successfully!');
      } catch (error) {
        console.error('Failed to load meme from gallery:', error);
      }
    } else {
      console.error('Meme gallery item not found or invalid');
    }
  }

  /**
   * Update UI controls from loaded state
   * @param {Object} state - Loaded state
   */
  updateUIFromState(state) {
    // Update text elements
    if (state.textElements && state.textElements.length > 0) {
      const textInput = document.getElementById('textInput');
      if (textInput) {
        textInput.value = state.textElements[0].text || '';
      }
      
      // Select the first text element
      selectTextElement(state.textElements[0].id);
      updateTextControls();
    }

    // Update background color
    if (state.backgroundColor) {
      const bgColorPicker = document.getElementById('backgroundColorPicker');
      if (bgColorPicker) {
        bgColorPicker.value = state.backgroundColor;
      }
    }

    // Update background image if present
    if (state.backgroundImage && state.backgroundImageData) {
      // Restore background image
      const img = new Image();
      img.onload = () => {
        memeState.backgroundImage = img;
        drawMemeCanvas();
      };
      img.src = state.backgroundImage.src || state.backgroundImageData;
    }

    // Update stickers
    if (state.stickers) {
      memeState.stickers = [...state.stickers];
    }

    // Update all relevant UI controls
    this.updateAllUIControls(state);

    // Clear any selected elements and ensure all are editable
    memeState.selectedSticker = null;
    memeState.textElements.forEach(t => {
      t.selected = false;
      // Ensure text elements have proper IDs for editing
      if (!t.id) t.id = Date.now() + Math.random();
    });
    
    // Ensure stickers have proper IDs for editing  
    memeState.stickers.forEach(s => {
      if (!s.id) s.id = Date.now() + Math.random();
    });

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
      memeState.exportWidth = state.canvasWidth;
      memeState.exportHeight = state.canvasHeight;
      memeState.canvasWidth = state.canvasWidth;
      memeState.canvasHeight = state.canvasHeight;
      
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
    drawMemeCanvas();
  }

  /**
   * Update all UI controls comprehensively
   * @param {Object} state - Loaded state
   */
  updateAllUIControls(state) {
    // Update font size slider and display
    if (state.textElements && state.textElements.length > 0 && state.textElements[0].fontSize) {
      const fontSizeSlider = document.getElementById('fontSizeSlider');
      const fontSizeDisplay = document.getElementById('fontSizeDisplay');
      if (fontSizeSlider) {
        fontSizeSlider.value = state.textElements[0].fontSize;
      }
      if (fontSizeDisplay) {
        fontSizeDisplay.textContent = state.textElements[0].fontSize + 'px';
      }
    }

    // Update font family
    if (state.textElements && state.textElements.length > 0 && state.textElements[0].fontFamily) {
      const fontSelect = document.getElementById('fontSelect');
      if (fontSelect) {
        fontSelect.value = state.textElements[0].fontFamily;
      }
    }

    // Update text color
    if (state.textElements && state.textElements.length > 0 && state.textElements[0].textColor) {
      const textColorPicker = document.getElementById('textColorPicker');
      if (textColorPicker) {
        textColorPicker.value = state.textElements[0].textColor;
      }
    }

    // Update outline settings
    if (state.outline !== undefined) {
      const outlineToggle = document.getElementById('outlineToggle');
      if (outlineToggle) {
        outlineToggle.checked = state.outline;
      }
    }

    // Update shadow settings
    if (state.shadow !== undefined) {
      const shadowToggle = document.getElementById('shadowToggle');
      if (shadowToggle) {
        shadowToggle.checked = state.shadow;
      }
    }

    // Update aesthetic settings
    if (state.aesthetic) {
      const aestheticSelect = document.getElementById('aestheticSelect');
      if (aestheticSelect) {
        aestheticSelect.value = state.aesthetic;
      }
    }
  }

  /**
   * Handle gallery item delete
   * @param {string} itemId - Item ID
   */
  onItemDelete(itemId) {
    console.log('🗑️ DELETE CLICKED: Item ID =', itemId);
    const item = this.getGalleryItem(itemId);
    console.log('🗑️ Found item:', item);
    if (item) {
      const confirmed = confirm(`Delete "${item.title}" from gallery?`);
      console.log('🗑️ User confirmed delete:', confirmed);
      if (confirmed) {
        console.log('🗑️ Gallery BEFORE delete:', this.gallery.length, 'items');
        this.deleteFromGallery(itemId);
        console.log('🗑️ Gallery AFTER delete:', this.gallery.length, 'items');
      }
    } else {
      console.log('🗑️ ERROR: Item not found for ID:', itemId);
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
    return 'meme_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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

