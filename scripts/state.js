// State management for the Brat Generator Pro application

class StateManager {
  constructor() {
    // Default state configuration
    this.defaultState = {
      text: 'brat',
      bgType: 'solid', // 'solid' | 'gradient'
      backgroundColor: '#8ACE00',
      gradientKey: null,
      textColor: '#000000',
      fontKey: 'inter',
      fontSize: 128,
      padding: 10,
      letterSpacing: 0,
      rotation: 0,
      canvasWidth: 500,
      canvasHeight: 500,
      borderRadius: 16,
      align: 'center', // 'left' | 'center' | 'right'
      blur: { enabled: true, amount: 2 },
      shadow: { 
        enabled: false, 
        x: 0, 
        y: 0, 
        blur: 10, 
        color: '#000000', 
        opacity: 0.4 
      },
      mirror: 'none', // 'center' | 'left' | 'right' | 'wide' | 'full' | 'none'
      effect: 'none', // Effects from PRESETS.effects
      outline: {
        type: 'none', // 'none' | 'thin' | 'medium' | 'thick' | 'double' | 'dashed'
        color: '#ffffff'
      },
      exportSize: '500x500',
      customExportWidth: 500,
      customExportHeight: 500,
      exportFormat: 'png',
      imageOverlay: {
        enabled: false,
        color: '#000000'
      },
      darkMode: false
    };

    // Current application state
    this.state = { ...this.defaultState };
    
    // State change listeners
    this.listeners = new Set();
    
    // Local storage key
    this.storageKey = 'bratGeneratorState';
    
    // Initialize state from localStorage
    this.loadState();
  }

  /**
   * Get current state
   * @returns {Object} Current state object
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Update state with new values
   * @param {Object} updates - Object containing state updates
   * @param {boolean} save - Whether to save to localStorage
   */
  updateState(updates, save = true) {
    const prevState = { ...this.state };
    
    // Merge updates into current state
    this.state = { ...this.state, ...updates };
    
    // Validate state
    this.validateState();
    
    // Save to localStorage if requested
    if (save) {
      this.saveState();
    }
    
    // Notify listeners of state change
    this.notifyListeners(prevState, this.state);
  }

  /**
   * Reset state to default values
   */
  resetState() {
    this.updateState({ ...this.defaultState });
  }

  /**
   * Add a state change listener
   * @param {Function} listener - Function to call on state change
   * @returns {Function} Unsubscribe function
   */
  subscribe(listener) {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of state changes
   * @param {Object} prevState - Previous state
   * @param {Object} newState - New state
   */
  notifyListeners(prevState, newState) {
    this.listeners.forEach(listener => {
      try {
        listener(newState, prevState);
      } catch (error) {
        console.error('Error in state change listener:', error);
      }
    });
  }

  /**
   * Save current state to localStorage
   */
  saveState() {
    try {
      const stateToSave = {
        ...this.state,
        // Don't save export-specific settings
        exportSize: this.defaultState.exportSize,
        exportFormat: this.defaultState.exportFormat
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
    }
  }

  /**
   * Load state from localStorage
   */
  loadState() {
    try {
      const savedState = localStorage.getItem(this.storageKey);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        
        // Merge with default state to handle new properties
        this.state = { ...this.defaultState, ...parsedState };
        
        // Validate loaded state
        this.validateState();
      }
    } catch (error) {
      console.error('Failed to load state from localStorage:', error);
      // Use default state if loading fails
      this.state = { ...this.defaultState };
    }
  }

  /**
   * Validate state values and fix any issues
   */
  validateState() {
    const state = this.state;
    
    // Validate text
    if (typeof state.text !== 'string') {
      state.text = this.defaultState.text;
    }
    
    // Validate background type
    if (!['solid', 'gradient'].includes(state.bgType)) {
      state.bgType = this.defaultState.bgType;
    }
    
    // Validate colors
    if (!Utils.isValidHexColor(state.backgroundColor)) {
      state.backgroundColor = this.defaultState.backgroundColor;
    }
    if (!Utils.isValidHexColor(state.textColor)) {
      state.textColor = this.defaultState.textColor;
    }
    
    // Validate gradient key
    if (state.gradientKey && !PRESETS.gradients[state.gradientKey]) {
      state.gradientKey = null;
    }
    
    // Validate font key
    if (!PRESETS.fonts[state.fontKey]) {
      state.fontKey = this.defaultState.fontKey;
    }
    
    // Validate numeric values
    state.fontSize = Math.max(12, Math.min(400, Number(state.fontSize) || this.defaultState.fontSize));
    state.padding = Math.max(0, Math.min(100, Number(state.padding) || this.defaultState.padding));
    state.letterSpacing = Math.max(-10, Math.min(40, Number(state.letterSpacing) || this.defaultState.letterSpacing));
    state.rotation = Math.max(-180, Math.min(180, Number(state.rotation) || this.defaultState.rotation));
    state.canvasWidth = Math.max(200, Math.min(2048, Number(state.canvasWidth) || this.defaultState.canvasWidth));
    state.canvasHeight = Math.max(200, Math.min(2048, Number(state.canvasHeight) || this.defaultState.canvasHeight));
    state.borderRadius = Math.max(0, Math.min(64, Number(state.borderRadius) || this.defaultState.borderRadius));
    
    // Validate alignment
    if (!['left', 'center', 'right'].includes(state.align)) {
      state.align = this.defaultState.align;
    }
    
    // Validate blur settings
    if (!state.blur || typeof state.blur !== 'object') {
      state.blur = { ...this.defaultState.blur };
    }
    state.blur.enabled = Boolean(state.blur.enabled);
    state.blur.amount = Math.max(0, Math.min(12, Number(state.blur.amount) || this.defaultState.blur.amount));
    
    // Validate shadow settings
    if (!state.shadow || typeof state.shadow !== 'object') {
      state.shadow = { ...this.defaultState.shadow };
    }
    state.shadow.enabled = Boolean(state.shadow.enabled);
    state.shadow.x = Math.max(-20, Math.min(20, Number(state.shadow.x) || this.defaultState.shadow.x));
    state.shadow.y = Math.max(-20, Math.min(20, Number(state.shadow.y) || this.defaultState.shadow.y));
    state.shadow.blur = Math.max(0, Math.min(40, Number(state.shadow.blur) || this.defaultState.shadow.blur));
    state.shadow.opacity = Math.max(0, Math.min(1, Number(state.shadow.opacity) || this.defaultState.shadow.opacity));
    if (!Utils.isValidHexColor(state.shadow.color)) {
      state.shadow.color = this.defaultState.shadow.color;
    }
    
    // Validate mirror mode
    if (!['center', 'left', 'right', 'wide', 'full', 'none'].includes(state.mirror)) {
      state.mirror = this.defaultState.mirror;
    }
    
    // Validate effect
    if (!PRESETS.effects[state.effect]) {
      state.effect = this.defaultState.effect;
    }
    
    // Validate outline settings
    if (!state.outline || typeof state.outline !== 'object') {
      state.outline = { ...this.defaultState.outline };
    }
    if (!PRESETS.outlineStyles[state.outline.type]) {
      state.outline.type = this.defaultState.outline.type;
    }
    if (!Utils.isValidHexColor(state.outline.color)) {
      state.outline.color = this.defaultState.outline.color;
    }
    
    // Validate export settings
    if (!PRESETS.exportSizes[state.exportSize]) {
      state.exportSize = this.defaultState.exportSize;
    }
    if (!['png', 'jpg', 'webp', 'pdf'].includes(state.exportFormat)) {
      state.exportFormat = this.defaultState.exportFormat;
    }
    
    // Validate dark mode
    state.darkMode = Boolean(state.darkMode);
  }

  /**
   * Get a specific property from state
   * @param {string} property - Property path (supports dot notation)
   * @returns {*} Property value
   */
  get(property) {
    const path = property.split('.');
    let value = this.state;
    
    for (const key of path) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return undefined;
      }
    }
    
    return value;
  }

  /**
   * Set a specific property in state
   * @param {string} property - Property path (supports dot notation)
   * @param {*} value - Value to set
   * @param {boolean} save - Whether to save to localStorage
   */
  set(property, value, save = true) {
    const path = property.split('.');
    const updates = {};
    let current = updates;
    
    // Build nested update object
    for (let i = 0; i < path.length - 1; i++) {
      current[path[i]] = {};
      current = current[path[i]];
    }
    current[path[path.length - 1]] = value;
    
    // Apply updates
    this.updateState(this.deepMerge(this.state, updates), save);
  }

  /**
   * Deep merge two objects
   * @param {Object} target - Target object
   * @param {Object} source - Source object
   * @returns {Object} Merged object
   */
  deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  /**
   * Create a snapshot of current state for undo functionality
   * @returns {Object} State snapshot
   */
  createSnapshot() {
    return Utils.deepClone(this.state);
  }

  /**
   * Restore state from a snapshot
   * @param {Object} snapshot - State snapshot to restore
   */
  restoreSnapshot(snapshot) {
    this.updateState(snapshot);
  }

  /**
   * Load state from a snapshot (alias for restoreSnapshot)
   * @param {Object} snapshot - State snapshot to load
   */
  loadSnapshot(snapshot) {
    this.restoreSnapshot(snapshot);
  }

  /**
   * Clear all saved state from localStorage
   */
  clearSavedState() {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Failed to clear saved state:', error);
    }
  }

  /**
   * Export current state as JSON
   * @returns {string} JSON string of current state
   */
  exportState() {
    return JSON.stringify(this.state, null, 2);
  }

  /**
   * Import state from JSON string
   * @param {string} jsonString - JSON string to import
   * @returns {boolean} Success status
   */
  importState(jsonString) {
    try {
      const importedState = JSON.parse(jsonString);
      this.updateState(importedState);
      return true;
    } catch (error) {
      console.error('Failed to import state:', error);
      return false;
    }
  }
}

// Create global state manager instance
const AppState = new StateManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StateManager, AppState };
}
