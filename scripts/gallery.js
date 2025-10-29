// Gallery management for the Brat Generator Pro application

class GalleryManager {
  constructor(galleryContainer, desktopGalleryContainer = null) {
    this.container = galleryContainer;
    this.desktopContainer = desktopGalleryContainer;
    this.storageKey = 'bratGeneratorGallery';
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
      console.error('Failed to load gallery from localStorage:', error);
      this.gallery = [];
    }
    
    // Always ensure we have sample designs for demonstration
    if (this.gallery.length === 0) {
      this.addSampleDesigns();
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
      console.error('Failed to save gallery to localStorage:', error);
      
      // If storage is full, try to clear some space
      if (error.name === 'QuotaExceededError') {
        this.clearOldItems();
        try {
          localStorage.setItem(this.storageKey, JSON.stringify(this.gallery));
        } catch (retryError) {
          console.error('Failed to save gallery after clearing space:', retryError);
        }
      }
    }
  }

  /**
   * Add item to gallery
   * @param {string} thumbnailDataUrl - Thumbnail image data URL
   * @param {Object} state - Application state snapshot
   */
  saveToGallery(thumbnailDataUrl, state) {
    const item = {
      id: Utils.generateId(),
      timestamp: Utils.getTimestamp(),
      thumbnail: thumbnailDataUrl,
      state: Utils.deepClone(state),
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
   * @param {Object} state - Application state
   * @returns {string} Generated title
   */
  generateItemTitle(state) {
    const text = state.text || 'Untitled';
    const font = PresetUtils.getFontFamily(state.fontKey).split(',')[0].replace(/"/g, '');
    const bgType = state.bgType === 'gradient' ? 'Gradient' : 'Solid';
    
    return `${text} - ${font} - ${bgType}`;
  }

  /**
   * Load state from gallery item
   * @param {string} itemId - Gallery item ID
   * @returns {Object|null} State object or null if not found
   */
  loadFromGallery(itemId) {
    const item = this.gallery.find(item => item.id === itemId);
    return item ? Utils.deepClone(item.state) : null;
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
   * Add sample gallery designs for demonstration
   */
  addSampleDesigns() {
    const colors = ['#8ACE00', '#ff084a', '#6766ff', '#3388f7', '#ff70a6', '#ff6994', '#00ffff', '#ffc107', 
                   '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#00bcd4', '#009688', '#4caf50'];
    
    const fontMappings = {
      'Inter': 'inter',
      'Bebas Neue': 'bebas-neue', 
      'Anton': 'anton',
      'Poppins': 'poppins',
      'Lobster': 'lobster',
      'Orbitron': 'orbitron'
    };
    
    const createSampleState = (text, font, bgColor, textColor) => ({
      text: text,
      fontKey: fontMappings[font] || 'inter',
      fontSize: 128,
      textColor: textColor,
      backgroundColor: bgColor,
      bgType: 'solid',
      canvasWidth: 500,
      canvasHeight: 500,
      align: 'center',
      padding: 10,
      borderRadius: 16,
      blur: { enabled: true, amount: 2 },
      shadow: { enabled: false, x: 0, y: 0, blur: 10, color: '#000000', opacity: 0.4 },
      mirror: 'none',
      effect: 'none',
      outline: { type: 'none', color: '#ffffff' },
      letterSpacing: 0,
      rotation: 0,
      imageOverlay: { enabled: false, color: '#000000' },
      exportFormat: 'png'
    });
    
    const sampleItems = [
      { id: 'sample1', title: 'brat - Inter - Solid', 
        thumbnail: `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="${colors[0]}"/><text x="50%" y="50%" font-family="Arial" font-size="18" fill="#000" text-anchor="middle" dy=".3em">brat</text></svg>`)}`, 
        timestamp: Date.now() - 3600000,
        state: createSampleState('brat', 'Inter', colors[0], '#000000') },
      { id: 'sample2', title: 'Summer - Bebas Neue - Solid', 
        thumbnail: `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="${colors[1]}"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="#fff" text-anchor="middle" dy=".3em">Summer</text></svg>`)}`, 
        timestamp: Date.now() - 7200000,
        state: createSampleState('Summer', 'Bebas Neue', colors[1], '#ffffff') },
      { id: 'sample3', title: 'VIBE - Anton - Solid', 
        thumbnail: `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="${colors[2]}"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="#fff" text-anchor="middle" dy=".3em">VIBE</text></svg>`)}`, 
        timestamp: Date.now() - 10800000,
        state: createSampleState('VIBE', 'Anton', colors[2], '#ffffff') },
      { id: 'sample4', title: 'Cool - Poppins - Solid', 
        thumbnail: `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="${colors[3]}"/><text x="50%" y="50%" font-family="Arial" font-size="18" fill="#fff" text-anchor="middle" dy=".3em">Cool</text></svg>`)}`, 
        timestamp: Date.now() - 14400000,
        state: createSampleState('Cool', 'Poppins', colors[3], '#ffffff') },
      { id: 'sample5', title: 'Music - Lobster - Solid', 
        thumbnail: `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="${colors[4]}"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="#fff" text-anchor="middle" dy=".3em">Music</text></svg>`)}`, 
        timestamp: Date.now() - 18000000,
        state: createSampleState('Music', 'Lobster', colors[4], '#ffffff') },
      { id: 'sample6', title: 'Party - Anton - Solid', 
        thumbnail: `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="${colors[5]}"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="#fff" text-anchor="middle" dy=".3em">Party</text></svg>`)}`, 
        timestamp: Date.now() - 21600000,
        state: createSampleState('Party', 'Anton', colors[5], '#ffffff') },
      { id: 'sample7', title: 'Neon - Orbitron - Solid', 
        thumbnail: `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="${colors[6]}"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="#000" text-anchor="middle" dy=".3em">Neon</text></svg>`)}`, 
        timestamp: Date.now() - 25200000,
        state: createSampleState('Neon', 'Orbitron', colors[6], '#000000') },
      { id: 'sample8', title: 'Retro - Bebas Neue - Solid', 
        thumbnail: `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="${colors[7]}"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="#000" text-anchor="middle" dy=".3em">Retro</text></svg>`)}`, 
        timestamp: Date.now() - 28800000,
        state: createSampleState('Retro', 'Bebas Neue', colors[7], '#000000') },
      { id: 'sample9', title: 'Love - Inter - Solid', 
        thumbnail: `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="${colors[8]}"/><text x="50%" y="50%" font-family="Arial" font-size="18" fill="#fff" text-anchor="middle" dy=".3em">Love</text></svg>`)}`, 
        timestamp: Date.now() - 32400000,
        state: createSampleState('Love', 'Inter', colors[8], '#ffffff') },
      { id: 'sample10', title: 'Dream - Poppins - Solid', 
        thumbnail: `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="${colors[9]}"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="#fff" text-anchor="middle" dy=".3em">Dream</text></svg>`)}`, 
        timestamp: Date.now() - 36000000,
        state: createSampleState('Dream', 'Poppins', colors[9], '#ffffff') },
      { id: 'sample11', title: 'Fire - Anton - Solid', 
        thumbnail: `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="${colors[10]}"/><text x="50%" y="50%" font-family="Arial" font-size="18" fill="#fff" text-anchor="middle" dy=".3em">Fire</text></svg>`)}`, 
        timestamp: Date.now() - 39600000,
        state: createSampleState('Fire', 'Anton', colors[10], '#ffffff') },
      { id: 'sample12', title: 'Wave - Bebas - Solid', 
        thumbnail: `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="${colors[11]}"/><text x="50%" y="50%" font-family="Arial" font-size="18" fill="#fff" text-anchor="middle" dy=".3em">Wave</text></svg>`)}`, 
        timestamp: Date.now() - 43200000,
        state: createSampleState('Wave', 'Bebas Neue', colors[11], '#ffffff') },
      { id: 'sample13', title: 'Sky - Inter - Solid', 
        thumbnail: `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="${colors[12]}"/><text x="50%" y="50%" font-family="Arial" font-size="18" fill="#fff" text-anchor="middle" dy=".3em">Sky</text></svg>`)}`, 
        timestamp: Date.now() - 46800000,
        state: createSampleState('Sky', 'Inter', colors[12], '#ffffff') },
      { id: 'sample14', title: 'Ocean - Lobster - Solid', 
        thumbnail: `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="${colors[13]}"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="#fff" text-anchor="middle" dy=".3em">Ocean</text></svg>`)}`, 
        timestamp: Date.now() - 50400000,
        state: createSampleState('Ocean', 'Lobster', colors[13], '#ffffff') },
      { id: 'sample15', title: 'Earth - Poppins - Solid', 
        thumbnail: `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="${colors[14]}"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="#fff" text-anchor="middle" dy=".3em">Earth</text></svg>`)}`, 
        timestamp: Date.now() - 54000000,
        state: createSampleState('Earth', 'Poppins', colors[14], '#ffffff') },
      { id: 'sample16', title: 'Nature - Anton - Solid', 
        thumbnail: `data:image/svg+xml;base64,${btoa(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="${colors[15]}"/><text x="50%" y="50%" font-family="Arial" font-size="14" fill="#fff" text-anchor="middle" dy=".3em">Nature</text></svg>`)}`, 
        timestamp: Date.now() - 57600000,
        state: createSampleState('Nature', 'Anton', colors[15], '#ffffff') }
    ];
    
    // Add sample items to gallery for display purposes only
    this.gallery = [...sampleItems];
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
    // Render to both mobile and desktop containers if they exist
    this.renderToContainer(this.container);
    if (this.desktopContainer) {
      this.renderToContainer(this.desktopContainer);
    }
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

    // Add clear all button if gallery has real items
    const realItems = this.gallery.filter(item => !item.id.startsWith('sample'));
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

  /**
   * Add clear all button to gallery
   */
  addClearAllButton() {
    if (!this.container) return;
    
    // Check if clear all button already exists
    const existingClearAll = this.container.parentElement.querySelector('.gallery-clear-all');
    if (existingClearAll) {
      return; // Don't add another one
    }

    const clearAllContainer = document.createElement('div');
    clearAllContainer.className = 'gallery-clear-all';
    clearAllContainer.innerHTML = `
      <button id="clearGalleryBtn" class="btn btn-outline btn-sm">
        <i data-lucide="trash-2"></i>
        Clear All
      </button>
    `;

    const clearBtn = clearAllContainer.querySelector('#clearGalleryBtn');
    clearBtn.addEventListener('click', () => this.confirmClearAll());

    this.container.parentElement.appendChild(clearAllContainer);
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
    console.log('Preview button clicked for item:', itemId, item);
    
    if (item && item.state && typeof window !== 'undefined' && window.app && window.app.state) {
      try {
        console.log('✓ IMPORTING GALLERY ITEM TO CANVAS:', item.title);
        console.log('✓ Item state being loaded:', item.state);
        
        // Ensure canvas dimensions are synced with export dimensions
        const stateToLoad = { ...item.state };
        if (stateToLoad.canvasWidth && stateToLoad.canvasHeight) {
          stateToLoad.customExportWidth = stateToLoad.canvasWidth;
          stateToLoad.customExportHeight = stateToLoad.canvasHeight;
          console.log(`✓ Syncing canvas size: ${stateToLoad.canvasWidth}x${stateToLoad.canvasHeight}`);
        }
        
        // Load the item's state permanently
        window.app.state.updateState(stateToLoad, true);
        console.log('✓ State updated in app');
        
        // Update the renderer with new state
        if (window.app.renderer) {
          window.app.renderer.setState(stateToLoad);
          console.log('✓ Renderer state updated');
        }
        
        // Update UI to reflect the new state (this will set export size presets correctly)
        window.app.initializeUI();
        console.log('✓ UI initialized with new state');
        
        // Additional step: ensure canvas size matches the imported dimensions
        if (window.app.renderer && window.app.renderer.updateCanvasSize && stateToLoad.canvasWidth && stateToLoad.canvasHeight) {
          window.app.renderer.updateCanvasSize(stateToLoad.canvasWidth, stateToLoad.canvasHeight);
          console.log(`✓ Canvas resized to: ${stateToLoad.canvasWidth}x${stateToLoad.canvasHeight}`);
        }
        
        
        console.log('✓ GALLERY ITEM IMPORTED SUCCESSFULLY!');

        // Close accordion section on mobile
        if (Utils.isMobile()) {
          const accordionSection = this.container.closest('.accordion-section');
          if (accordionSection) {
            accordionSection.classList.remove('active');
          }
        }
      } catch (error) {
        console.error('❌ Preview failed:', error);
      }
    } else {
      console.error('❌ Cannot preview - missing requirements:', {
        itemId: itemId,
        hasItem: !!item,
        itemData: item,
        hasState: item ? !!item.state : false,
        stateData: item ? item.state : null,
        hasWindow: typeof window !== 'undefined',
        hasApp: typeof window !== 'undefined' ? !!window.app : false,
        windowApp: typeof window !== 'undefined' ? window.app : null
      });
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
      
      // Remove clear all button
      const clearAllContainer = this.container.parentElement.querySelector('.gallery-clear-all');
      if (clearAllContainer) {
        clearAllContainer.remove();
      }
      
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
   * Clear old items when storage is full
   */
  clearOldItems() {
    // Remove oldest half of items
    const keepCount = Math.floor(this.maxItems / 2);
    this.gallery = this.gallery.slice(0, keepCount);
  }

  /**
   * Export gallery as JSON
   * @returns {string} Gallery JSON string
   */
  exportGallery() {
    return JSON.stringify({
      version: '1.0',
      timestamp: Utils.getTimestamp(),
      items: this.gallery
    }, null, 2);
  }

  /**
   * Import gallery from JSON
   * @param {string} jsonString - Gallery JSON string
   * @returns {boolean} Success status
   */
  importGallery(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      
      if (data.items && Array.isArray(data.items)) {
        // Validate imported items
        const validItems = data.items.filter(item => this.validateGalleryItem(item));
        
        // Merge with existing gallery (keep most recent)
        const mergedGallery = [...validItems, ...this.gallery];
        
        // Remove duplicates based on state similarity
        const uniqueGallery = this.removeDuplicates(mergedGallery);
        
        // Limit to max items
        this.gallery = uniqueGallery.slice(0, this.maxItems);
        
        this.saveGallery();
        this.renderGallery();
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to import gallery:', error);
      return false;
    }
  }

  /**
   * Remove duplicate gallery items based on state similarity
   * @param {Array} items - Gallery items
   * @returns {Array} Unique items
   */
  removeDuplicates(items) {
    const unique = [];
    const seen = new Set();
    
    for (const item of items) {
      // Create a hash of the essential state properties
      const stateHash = this.createStateHash(item.state);
      
      if (!seen.has(stateHash)) {
        seen.add(stateHash);
        unique.push(item);
      }
    }
    
    return unique;
  }

  /**
   * Create a hash of state for duplicate detection
   * @param {Object} state - Application state
   * @returns {string} State hash
   */
  createStateHash(state) {
    const essentialProperties = {
      text: state.text,
      fontKey: state.fontKey,
      fontSize: state.fontSize,
      textColor: state.textColor,
      backgroundColor: state.backgroundColor,
      gradientKey: state.gradientKey,
      bgType: state.bgType
    };
    
    return JSON.stringify(essentialProperties);
  }

  /**
   * Get gallery statistics
   * @returns {Object} Gallery statistics
   */
  getGalleryStats() {
    const stats = {
      totalItems: this.gallery.length,
      oldestItem: null,
      newestItem: null,
      favoriteFont: null,
      favoriteEffect: null
    };

    if (this.gallery.length > 0) {
      // Find oldest and newest
      const timestamps = this.gallery.map(item => item.timestamp);
      stats.oldestItem = new Date(Math.min(...timestamps));
      stats.newestItem = new Date(Math.max(...timestamps));

      // Find favorite font
      const fontCounts = {};
      this.gallery.forEach(item => {
        const font = item.state.fontKey || 'unknown';
        fontCounts[font] = (fontCounts[font] || 0) + 1;
      });
      
      stats.favoriteFont = Object.keys(fontCounts).reduce((a, b) => 
        fontCounts[a] > fontCounts[b] ? a : b
      );

      // Find favorite effect
      const effectCounts = {};
      this.gallery.forEach(item => {
        const effect = item.state.effect || 'none';
        effectCounts[effect] = (effectCounts[effect] || 0) + 1;
      });
      
      stats.favoriteEffect = Object.keys(effectCounts).reduce((a, b) => 
        effectCounts[a] > effectCounts[b] ? a : b
      );
    }

    return stats;
  }

  /**
   * Search gallery items
   * @param {string} query - Search query
   * @returns {Array} Matching items
   */
  searchGallery(query) {
    if (!query) return [...this.gallery];
    
    const lowerQuery = query.toLowerCase();
    
    return this.gallery.filter(item => {
      return (
        item.title.toLowerCase().includes(lowerQuery) ||
        item.state.text.toLowerCase().includes(lowerQuery) ||
        item.state.fontKey.toLowerCase().includes(lowerQuery) ||
        item.state.effect.toLowerCase().includes(lowerQuery)
      );
    });
  }

  /**
   * Get storage usage information
   * @returns {Object} Storage usage info
   */
  getStorageInfo() {
    const galleryData = localStorage.getItem(this.storageKey) || '';
    const sizeInBytes = new Blob([galleryData]).size;
    
    return {
      itemCount: this.gallery.length,
      sizeInBytes,
      sizeFormatted: Utils.formatFileSize(sizeInBytes),
      maxItems: this.maxItems
    };
  }

  /**
   * Destroy the gallery manager
   */
  destroy() {
    // Remove event listeners
    if (this.container) {
      const items = this.container.querySelectorAll('.gallery-item');
      items.forEach(item => {
        item.removeEventListener('click', this.onItemClick);
        const deleteBtn = item.querySelector('.delete');
        if (deleteBtn) {
          deleteBtn.removeEventListener('click', this.onItemDelete);
        }
      });
    }

    // Clear references
    this.container = null;
    this.gallery = [];
    this.onItemClick = null;
    this.onItemDelete = null;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GalleryManager;
}
