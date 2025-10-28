// Main application logic for Brat Generator Pro

class BratGeneratorApp {
  constructor() {
    // Core components
    this.state = window.AppState || new StateManager();
    this.canvas = null;
    this.renderer = null;
    this.gallery = null;
    this.exporter = null;
    
    // UI elements
    this.elements = {};
    
    // Event listeners cleanup
    this.eventListeners = [];
    
    // Initialize the application
    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        await new Promise(resolve => {
          document.addEventListener('DOMContentLoaded', resolve);
        });
      }

      // Wait for fonts to be loaded
      if (typeof FontLoader !== 'undefined') {
        await FontLoader.loadFonts();
      }

      // Get all UI elements
      this.getUIElements();
      
      // Check if required elements exist
      if (!this.elements.canvas) {
        console.warn('Canvas element not found, some features may not work');
        return;
      }
      
      // Initialize core components
      this.initializeRenderer();
      this.initializeGallery();
      this.initializeExporter();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Initialize UI state
      this.initializeUI();
      
      // Subscribe to state changes
      this.subscribeToStateChanges();
      
      console.log('Brat Generator Pro initialized successfully');
      
    } catch (error) {
      console.error('Failed to initialize Brat Generator Pro:', error);
    }
  }

  /**
   * Get references to all UI elements
   */
  getUIElements() {
    this.elements = {
      // Canvas
      canvas: document.getElementById('previewCanvas'),
      
      // Text controls
      textInput: document.getElementById('textInput'),
      fontSelect: document.getElementById('fontSelect'),
      fontSizeSlider: document.getElementById('fontSizeSlider'),
      fontSizeValue: document.getElementById('fontSizeValue'),
      paddingSlider: document.getElementById('paddingSlider'),
      paddingValue: document.getElementById('paddingValue'),
      textColorPalette: document.getElementById('textColorPalette'),
      textColorPicker: document.getElementById('textColorPicker'),
      
      // Outline controls
      outlineSelect: document.getElementById('outlineSelect'),
      outlineColorPicker: document.getElementById('outlineColorPicker'),
      
      // Spacing and rotation
      letterSpacingSlider: document.getElementById('letterSpacingSlider'),
      letterSpacingValue: document.getElementById('letterSpacingValue'),
      rotationSlider: document.getElementById('rotationSlider'),
      rotationValue: document.getElementById('rotationValue'),
      
      // Export size controls (mobile and desktop)
      exportSizePreset: document.getElementById('exportSizePreset'),
      exportSizePresetDesktop: document.getElementById('exportSizePresetDesktop'),
      customExportSizeGroup: document.getElementById('customExportSizeGroup'),
      customExportSizeGroupDesktop: document.getElementById('customExportSizeGroupDesktop'),
      customExportWidth: document.getElementById('customExportWidth'),
      customExportHeight: document.getElementById('customExportHeight'),
      customExportWidthDesktop: document.getElementById('customExportWidthDesktop'),
      customExportHeightDesktop: document.getElementById('customExportHeightDesktop'),
      borderRadiusSlider: document.getElementById('borderRadiusSlider'),
      borderRadiusValue: document.getElementById('borderRadiusValue'),
      
      // Background controls
      solidBgBtn: document.getElementById('solidBgBtn'),
      gradientBgBtn: document.getElementById('gradientBgBtn'),
      solidColorGroup: document.getElementById('solidColorGroup'),
      gradientGroup: document.getElementById('gradientGroup'),
      bgColorPalette: document.getElementById('bgColorPalette'),
      bgColorPicker: document.getElementById('bgColorPicker'),
      gradientGrid: document.getElementById('gradientGrid'),
      
      // Alignment controls
      alignLeft: document.getElementById('alignLeft'),
      alignCenter: document.getElementById('alignCenter'),
      alignRight: document.getElementById('alignRight'),
      
      // Effects controls
      blurToggle: document.getElementById('blurToggle'),
      blurSlider: document.getElementById('blurSlider'),
      blurValue: document.getElementById('blurValue'),
      shadowToggle: document.getElementById('shadowToggle'),
      shadowControls: document.getElementById('shadowControls'),
      shadowXSlider: document.getElementById('shadowXSlider'),
      shadowXValue: document.getElementById('shadowXValue'),
      shadowYSlider: document.getElementById('shadowYSlider'),
      shadowYValue: document.getElementById('shadowYValue'),
      shadowBlurSlider: document.getElementById('shadowBlurSlider'),
      shadowBlurValue: document.getElementById('shadowBlurValue'),
      shadowColorPicker: document.getElementById('shadowColorPicker'),
      shadowOpacitySlider: document.getElementById('shadowOpacitySlider'),
      shadowOpacityValue: document.getElementById('shadowOpacityValue'),
      mirrorSelect: document.getElementById('mirrorSelect'),
      effectSelect: document.getElementById('effectSelect'),
      imageOverlayToggle: document.getElementById('imageOverlayToggle'),
      imageOverlayControls: document.getElementById('imageOverlayControls'),
      
      // Export controls
      exportFormatSelect: document.getElementById('exportFormatSelect'),
      downloadBtn: document.getElementById('downloadBtn'),
      copyImageBtn: document.getElementById('copyImageBtn'),
      saveToGalleryBtn: document.getElementById('saveToGalleryBtn'),
      resetBtn: document.getElementById('resetBtn'),
      
      // Desktop Export controls  
      exportFormatSelectDesktop: document.getElementById('exportFormatSelectDesktop'),
      downloadBtnDesktop: document.getElementById('downloadBtnDesktop'),
      copyImageBtnDesktop: document.getElementById('copyImageBtnDesktop'),
      saveToGalleryBtnDesktop: document.getElementById('saveToGalleryBtnDesktop'),
      resetBtnDesktop: document.getElementById('resetBtnDesktop'),
      
      // Mobile buttons
      mobileDownloadBtn: document.getElementById('mobileDownloadBtn'),
      mobileSaveBtn: document.getElementById('mobileSaveBtn'),
      
      // Other controls
      galleryGrid: document.getElementById('galleryGrid'),
      galleryGridDesktop: document.getElementById('galleryGridDesktop'),
      
    };
  }

  /**
   * Initialize the canvas renderer
   */
  initializeRenderer() {
    if (!this.elements.canvas) {
      throw new Error('Canvas element not found');
    }
    
    this.renderer = new CanvasRenderer(this.elements.canvas);
    this.renderer.setState(this.state.getState());
  }

  /**
   * Initialize the gallery manager
   */
  initializeGallery() {
    this.gallery = new GalleryManager(this.elements.galleryGrid, this.elements.galleryGridDesktop);
    this.gallery.loadGallery();
  }

  /**
   * Initialize the export manager
   */
  initializeExporter() {
    this.exporter = new ExportManager(this.renderer, this.state);
  }

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Text controls
    this.addEventListenerWithCleanup(this.elements.textInput, 'input', 
      Utils.debounce((e) => this.handleTextChange(e.target.value), 150));
    
    this.addEventListenerWithCleanup(this.elements.fontSelect, 'change',
      (e) => this.handleFontChange(e.target.value));
    
    this.addEventListenerWithCleanup(this.elements.fontSizeSlider, 'input',
      Utils.throttle((e) => this.handleFontSizeChange(e.target.value), 16));
    
    this.addEventListenerWithCleanup(this.elements.paddingSlider, 'input',
      Utils.throttle((e) => this.handlePaddingChange(e.target.value), 16));
    
    this.addEventListenerWithCleanup(this.elements.textColorPicker, 'change',
      (e) => this.handleTextColorChange(e.target.value));
    
    // Outline controls
    this.addEventListenerWithCleanup(this.elements.outlineSelect, 'change',
      (e) => this.handleOutlineTypeChange(e.target.value));
    
    this.addEventListenerWithCleanup(this.elements.outlineColorPicker, 'change',
      (e) => this.handleOutlineColorChange(e.target.value));
    
    // Spacing and rotation
    this.addEventListenerWithCleanup(this.elements.letterSpacingSlider, 'input',
      Utils.throttle((e) => this.handleLetterSpacingChange(e.target.value), 16));
    
    this.addEventListenerWithCleanup(this.elements.rotationSlider, 'input',
      Utils.throttle((e) => this.handleRotationChange(e.target.value), 16));
    
    // Export size controls (mobile)
    this.addEventListenerWithCleanup(this.elements.exportSizePreset, 'change',
      (e) => this.handleExportSizePresetChange(e.target.value));
    
    this.addEventListenerWithCleanup(this.elements.customExportWidth, 'input',
      Utils.throttle((e) => this.handleCustomExportWidthChange(e.target.value), 16));
    
    this.addEventListenerWithCleanup(this.elements.customExportHeight, 'input',
      Utils.throttle((e) => this.handleCustomExportHeightChange(e.target.value), 16));

    // Export size controls (desktop)
    if (this.elements.exportSizePresetDesktop) {
      this.addEventListenerWithCleanup(this.elements.exportSizePresetDesktop, 'change',
        (e) => this.handleExportSizePresetChange(e.target.value));
    }
    
    if (this.elements.customExportWidthDesktop) {
      this.addEventListenerWithCleanup(this.elements.customExportWidthDesktop, 'input',
        Utils.throttle((e) => this.handleCustomExportWidthChange(e.target.value), 16));
    }
    
    if (this.elements.customExportHeightDesktop) {
      this.addEventListenerWithCleanup(this.elements.customExportHeightDesktop, 'input',
        Utils.throttle((e) => this.handleCustomExportHeightChange(e.target.value), 16));
    }
    
    this.addEventListenerWithCleanup(this.elements.borderRadiusSlider, 'input',
      Utils.throttle((e) => this.handleBorderRadiusChange(e.target.value), 16));
    
    // Background controls
    this.addEventListenerWithCleanup(this.elements.solidBgBtn, 'click',
      () => this.handleBackgroundTypeChange('solid'));
    
    this.addEventListenerWithCleanup(this.elements.gradientBgBtn, 'click',
      () => this.handleBackgroundTypeChange('gradient'));
    
    this.addEventListenerWithCleanup(this.elements.bgColorPicker, 'change',
      (e) => this.handleBackgroundColorChange(e.target.value));
    
    // Alignment controls
    this.addEventListenerWithCleanup(this.elements.alignLeft, 'click',
      () => this.handleAlignmentChange('left'));
    
    this.addEventListenerWithCleanup(this.elements.alignCenter, 'click',
      () => this.handleAlignmentChange('center'));
    
    this.addEventListenerWithCleanup(this.elements.alignRight, 'click',
      () => this.handleAlignmentChange('right'));
    
    // Effects controls
    this.addEventListenerWithCleanup(this.elements.blurToggle, 'change',
      (e) => this.handleBlurToggle(e.target.checked));
    
    this.addEventListenerWithCleanup(this.elements.blurSlider, 'input',
      Utils.throttle((e) => this.handleBlurAmountChange(e.target.value), 16));
    
    this.addEventListenerWithCleanup(this.elements.shadowToggle, 'change',
      (e) => this.handleShadowToggle(e.target.checked));
    
    this.addEventListenerWithCleanup(this.elements.shadowXSlider, 'input',
      Utils.throttle((e) => this.handleShadowXChange(e.target.value), 16));
    
    this.addEventListenerWithCleanup(this.elements.shadowYSlider, 'input',
      Utils.throttle((e) => this.handleShadowYChange(e.target.value), 16));
    
    this.addEventListenerWithCleanup(this.elements.shadowBlurSlider, 'input',
      Utils.throttle((e) => this.handleShadowBlurChange(e.target.value), 16));
    
    this.addEventListenerWithCleanup(this.elements.shadowColorPicker, 'change',
      (e) => this.handleShadowColorChange(e.target.value));
    
    this.addEventListenerWithCleanup(this.elements.shadowOpacitySlider, 'input',
      Utils.throttle((e) => this.handleShadowOpacityChange(e.target.value), 16));
    
    this.addEventListenerWithCleanup(this.elements.mirrorSelect, 'change',
      (e) => this.handleMirrorChange(e.target.value));
    
    this.addEventListenerWithCleanup(this.elements.effectSelect, 'change',
      (e) => this.handleEffectChange(e.target.value));
    
    // Image overlay controls
    this.addEventListenerWithCleanup(this.elements.imageOverlayToggle, 'change',
      (e) => this.handleImageOverlayToggle(e.target.checked));
    
    // Export controls
    // Format selectors for both mobile and desktop
    if (this.elements.exportFormatSelect) {
      this.addEventListenerWithCleanup(this.elements.exportFormatSelect, 'change',
        (e) => this.handleFormatChange(e.target.value));
    }
    
    if (this.elements.exportFormatSelectDesktop) {
      this.addEventListenerWithCleanup(this.elements.exportFormatSelectDesktop, 'change',
        (e) => this.handleFormatChange(e.target.value));
    }
    
    this.addEventListenerWithCleanup(this.elements.downloadBtn, 'click',
      () => this.handleDownload());
    
    this.addEventListenerWithCleanup(this.elements.mobileDownloadBtn, 'click',
      () => this.handleDownload());
    
    this.addEventListenerWithCleanup(this.elements.copyImageBtn, 'click',
      () => this.handleCopyImage());
    
    this.addEventListenerWithCleanup(this.elements.saveToGalleryBtn, 'click',
      () => this.handleSaveToGallery());
    
    this.addEventListenerWithCleanup(this.elements.mobileSaveBtn, 'click',
      () => this.handleSaveToGallery());
    
    this.addEventListenerWithCleanup(this.elements.resetBtn, 'click',
      () => this.handleReset());

    // Desktop Export buttons (same functionality)
    if (this.elements.downloadBtnDesktop) {
      this.addEventListenerWithCleanup(this.elements.downloadBtnDesktop, 'click',
        () => this.handleDownload());
    }
    
    if (this.elements.copyImageBtnDesktop) {
      this.addEventListenerWithCleanup(this.elements.copyImageBtnDesktop, 'click',
        () => this.handleCopyImage());
    }
    
    if (this.elements.saveToGalleryBtnDesktop) {
      this.addEventListenerWithCleanup(this.elements.saveToGalleryBtnDesktop, 'click',
        () => this.handleSaveToGallery());
    }
    
    if (this.elements.resetBtnDesktop) {
      this.addEventListenerWithCleanup(this.elements.resetBtnDesktop, 'click',
        () => this.handleReset());
    }
    
    // Keyboard shortcuts
    this.setupKeyboardShortcuts();
  }

  /**
   * Add event listener with automatic cleanup tracking
   */
  addEventListenerWithCleanup(element, event, handler, options) {
    if (!element) return;
    
    element.addEventListener(event, handler, options);
    this.eventListeners.push(() => {
      element.removeEventListener(event, handler, options);
    });
  }


  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    this.addEventListenerWithCleanup(document, 'keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            this.handleSaveToGallery();
            break;
          case 'd':
            e.preventDefault();
            this.handleDownload();
            break;
          case 'r':
            e.preventDefault();
            this.handleReset();
            break;
        }
      }
    });
  }

  /**
   * Initialize UI elements with current state values
   */
  initializeUI() {
    const state = this.state.getState();
    
    // Text controls
    this.elements.textInput.value = state.text;
    this.elements.fontSelect.value = state.fontKey;
    this.updateSliderValue(this.elements.fontSizeSlider, this.elements.fontSizeValue, state.fontSize);
    this.updateSliderValue(this.elements.paddingSlider, this.elements.paddingValue, state.padding);
    this.elements.textColorPicker.value = state.textColor;
    
    // Outline controls
    this.elements.outlineSelect.value = state.outline.type;
    this.elements.outlineColorPicker.value = state.outline.color;
    
    // Spacing and rotation
    this.updateSliderValue(this.elements.letterSpacingSlider, this.elements.letterSpacingValue, state.letterSpacing);
    this.updateSliderValue(this.elements.rotationSlider, this.elements.rotationValue, state.rotation);
    
    // Export size controls (only initialize if renderer is ready)
    this.initializeExportSizeControls(state);
    this.updateSliderValue(this.elements.borderRadiusSlider, this.elements.borderRadiusValue, state.borderRadius);
    
    // Background controls
    this.updateBackgroundTypeUI(state.bgType);
    this.elements.bgColorPicker.value = state.backgroundColor;
    
    // Alignment controls
    this.updateAlignmentUI(state.align);
    
    // Effects controls
    this.elements.blurToggle.checked = state.blur.enabled;
    this.updateSliderValue(this.elements.blurSlider, this.elements.blurValue, state.blur.amount);
    
    this.elements.shadowToggle.checked = state.shadow.enabled;
    this.elements.shadowControls.style.display = state.shadow.enabled ? 'block' : 'none';
    this.updateSliderValue(this.elements.shadowXSlider, this.elements.shadowXValue, state.shadow.x);
    this.updateSliderValue(this.elements.shadowYSlider, this.elements.shadowYValue, state.shadow.y);
    this.updateSliderValue(this.elements.shadowBlurSlider, this.elements.shadowBlurValue, state.shadow.blur);
    this.elements.shadowColorPicker.value = state.shadow.color;
    this.updateSliderValue(this.elements.shadowOpacitySlider, this.elements.shadowOpacityValue, state.shadow.opacity * 100);
    
    this.elements.mirrorSelect.value = state.mirror;
    this.elements.effectSelect.value = state.effect;
    
    // Export controls
    this.elements.exportFormatSelect.value = state.exportFormat;
    
    // Initialize color palettes
    this.initializeColorPalettes();
    
    // Initialize gradient grid
    this.initializeGradientGrid();
  }

  /**
   * Update slider and its display value
   */
  updateSliderValue(slider, valueElement, value) {
    if (slider) slider.value = value;
    if (valueElement) valueElement.textContent = value;
  }

  /**
   * Initialize color palettes
   */
  initializeColorPalettes() {
    // Text color palette
    this.createColorPalette(this.elements.textColorPalette, PRESETS.textColors, 
      this.state.get('textColor'), (color) => this.handleTextColorChange(color));
    
    // Background color palette
    this.createColorPalette(this.elements.bgColorPalette, PRESETS.backgroundColors,
      this.state.get('backgroundColor'), (color) => this.handleBackgroundColorChange(color));
  }

  /**
   * Create a color palette UI
   */
  createColorPalette(container, colors, activeColor, onColorSelect) {
    if (!container) return;
    
    container.innerHTML = '';
    
    colors.forEach(color => {
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.style.backgroundColor = color;
      swatch.title = color;
      
      if (color === activeColor) {
        swatch.classList.add('active');
      }
      
      swatch.addEventListener('click', () => {
        // Update active state
        container.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        
        // Handle color selection
        onColorSelect(color);
      });
      
      container.appendChild(swatch);
    });
  }

  /**
   * Initialize gradient grid
   */
  initializeGradientGrid() {
    if (!this.elements.gradientGrid) return;
    
    this.elements.gradientGrid.innerHTML = '';
    
    const gradientKeys = PresetUtils.getGradientKeys();
    
    gradientKeys.forEach(key => {
      const swatch = document.createElement('div');
      swatch.className = 'gradient-swatch';
      swatch.style.background = PresetUtils.getGradientCSS(key);
      swatch.title = PresetUtils.getGradientName(key);
      swatch.dataset.gradientKey = key;
      
      if (key === this.state.get('gradientKey')) {
        swatch.classList.add('active');
      }
      
      swatch.addEventListener('click', () => {
        // Update active state
        this.elements.gradientGrid.querySelectorAll('.gradient-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
        
        // Handle gradient selection
        this.handleGradientChange(key);
      });
      
      this.elements.gradientGrid.appendChild(swatch);
    });
  }

  /**
   * Subscribe to state changes
   */
  subscribeToStateChanges() {
    this.state.subscribe((newState, prevState) => {
      // Update renderer
      this.renderer.setState(newState);
      
      // Update UI if needed
      this.updateUIFromState(newState, prevState);
    });
  }

  /**
   * Update UI elements when state changes
   */
  updateUIFromState(newState, prevState) {
    // Update background type UI if changed
    if (newState.bgType !== prevState.bgType) {
      this.updateBackgroundTypeUI(newState.bgType);
    }
    
    // Update alignment UI if changed
    if (newState.align !== prevState.align) {
      this.updateAlignmentUI(newState.align);
    }
    
    // Update shadow controls visibility
    if (newState.shadow.enabled !== prevState.shadow.enabled) {
      this.elements.shadowControls.style.display = newState.shadow.enabled ? 'block' : 'none';
    }
    
    // Update color palette active states
    if (newState.textColor !== prevState.textColor) {
      this.updateColorPaletteActive(this.elements.textColorPalette, newState.textColor);
    }
    
    if (newState.backgroundColor !== prevState.backgroundColor) {
      this.updateColorPaletteActive(this.elements.bgColorPalette, newState.backgroundColor);
    }
    
    // Update gradient active state
    if (newState.gradientKey !== prevState.gradientKey) {
      this.updateGradientActive(newState.gradientKey);
    }
  }

  /**
   * Update background type UI
   */
  updateBackgroundTypeUI(bgType) {
    // Update button states
    this.elements.solidBgBtn.classList.toggle('active', bgType === 'solid');
    this.elements.gradientBgBtn.classList.toggle('active', bgType === 'gradient');
    
    // Show/hide appropriate groups
    this.elements.solidColorGroup.style.display = bgType === 'solid' ? 'block' : 'none';
    this.elements.gradientGroup.style.display = bgType === 'gradient' ? 'block' : 'none';
  }

  /**
   * Update alignment UI
   */
  updateAlignmentUI(align) {
    this.elements.alignLeft.classList.toggle('active', align === 'left');
    this.elements.alignCenter.classList.toggle('active', align === 'center');
    this.elements.alignRight.classList.toggle('active', align === 'right');
  }

  /**
   * Update color palette active state
   */
  updateColorPaletteActive(palette, activeColor) {
    if (!palette) return;
    
    palette.querySelectorAll('.color-swatch').forEach(swatch => {
      const color = swatch.style.backgroundColor;
      const isActive = color === activeColor || this.rgbToHex(color) === activeColor;
      swatch.classList.toggle('active', isActive);
    });
  }

  /**
   * Update gradient active state
   */
  updateGradientActive(activeGradient) {
    if (!this.elements.gradientGrid) return;
    
    this.elements.gradientGrid.querySelectorAll('.gradient-swatch').forEach(swatch => {
      const isActive = swatch.dataset.gradientKey === activeGradient;
      swatch.classList.toggle('active', isActive);
    });
  }

  /**
   * Convert RGB color to hex
   */
  rgbToHex(rgb) {
    const result = rgb.match(/\d+/g);
    if (!result || result.length < 3) return rgb;
    
    const r = parseInt(result[0]);
    const g = parseInt(result[1]);
    const b = parseInt(result[2]);
    
    return Utils.rgbToHex(r, g, b);
  }

  // Event Handlers

  handleTextChange(value) {
    this.state.set('text', value);
  }

  handleFontChange(value) {
    this.state.set('fontKey', value);
  }

  handleFontSizeChange(value) {
    this.state.set('fontSize', parseInt(value));
    this.elements.fontSizeValue.textContent = value;
  }

  handlePaddingChange(value) {
    this.state.set('padding', parseInt(value));
    this.elements.paddingValue.textContent = value;
  }

  handleTextColorChange(value) {
    this.state.set('textColor', value);
    this.elements.textColorPicker.value = value;
  }

  handleOutlineTypeChange(value) {
    this.state.set('outline.type', value);
  }

  handleOutlineColorChange(value) {
    this.state.set('outline.color', value);
  }

  handleLetterSpacingChange(value) {
    this.state.set('letterSpacing', parseInt(value));
    this.elements.letterSpacingValue.textContent = value;
  }

  handleRotationChange(value) {
    this.state.set('rotation', parseInt(value));
    this.elements.rotationValue.textContent = value;
  }

  handleExportSizePresetChange(value) {
    if (value === 'custom') {
      // Show custom size groups for both mobile and desktop
      if (this.elements.customExportSizeGroup) {
        this.elements.customExportSizeGroup.classList.add('active');
        this.elements.customExportSizeGroup.style.display = 'block';
      }
      if (this.elements.customExportSizeGroupDesktop) {
        this.elements.customExportSizeGroupDesktop.classList.add('active');
        this.elements.customExportSizeGroupDesktop.style.display = 'block';
      }
    } else {
      // Hide custom size groups and set preset size
      if (this.elements.customExportSizeGroup) {
        this.elements.customExportSizeGroup.classList.remove('active');
        this.elements.customExportSizeGroup.style.display = 'none';
      }
      if (this.elements.customExportSizeGroupDesktop) {
        this.elements.customExportSizeGroupDesktop.classList.remove('active');
        this.elements.customExportSizeGroupDesktop.style.display = 'none';
      }
      const [width, height] = value.split('x').map(v => parseInt(v));
      this.updateExportSize(width, height);
    }
  }

  handleCustomExportWidthChange(value) {
    const width = parseInt(value) || 500;
    const height = this.state.get('customExportHeight');
    console.log('Export width change input:', value, '-> parsed:', width, 'current height:', height);
    this.updateExportSize(width, height);
  }

  handleCustomExportHeightChange(value) {
    const height = parseInt(value) || 500;
    const width = this.state.get('customExportWidth');
    console.log('Export height change input:', value, '-> parsed:', height, 'current width:', width);
    this.updateExportSize(width, height);
  }

  updateExportSize(width, height) {
    console.log('Updating export size to:', width, 'x', height);
    this.state.updateState({ 
      customExportWidth: width, 
      customExportHeight: height,
      exportSize: `${width}x${height}`,
      canvasWidth: width,
      canvasHeight: height
    });
    
    // Update UI for both mobile and desktop inputs
    if (this.elements.customExportWidth) this.elements.customExportWidth.value = width;
    if (this.elements.customExportHeight) this.elements.customExportHeight.value = height;
    if (this.elements.customExportWidthDesktop) this.elements.customExportWidthDesktop.value = width;
    if (this.elements.customExportHeightDesktop) this.elements.customExportHeightDesktop.value = height;
    
    // Update canvas size to match export size (only if renderer exists)
    if (this.renderer && this.renderer.updateCanvasSize) {
      this.renderer.updateCanvasSize(width, height);
    }
    
    // Debug: verify state was updated
    const currentState = this.state.getState();
    console.log('Export size state after update:', currentState.customExportWidth, 'x', currentState.customExportHeight);
  }

  handleBorderRadiusChange(value) {
    this.state.set('borderRadius', parseInt(value));
    this.elements.borderRadiusValue.textContent = value;
  }

  handleBackgroundTypeChange(type) {
    this.state.set('bgType', type);
    
    // Clear opposite selection
    if (type === 'solid') {
      this.state.set('gradientKey', null);
    } else {
      // Set default gradient if none selected
      if (!this.state.get('gradientKey')) {
        this.state.set('gradientKey', 'brat-classic');
      }
    }
  }

  handleBackgroundColorChange(value) {
    this.state.updateState({
      backgroundColor: value,
      bgType: 'solid',
      gradientKey: null
    });
    this.elements.bgColorPicker.value = value;
  }

  handleGradientChange(gradientKey) {
    this.state.updateState({
      gradientKey,
      bgType: 'gradient'
    });
  }

  handleAlignmentChange(align) {
    this.state.set('align', align);
  }

  handleBlurToggle(enabled) {
    this.state.set('blur.enabled', enabled);
  }

  handleBlurAmountChange(value) {
    this.state.set('blur.amount', parseInt(value));
    this.elements.blurValue.textContent = value;
  }

  handleShadowToggle(enabled) {
    this.state.set('shadow.enabled', enabled);
  }

  handleShadowXChange(value) {
    this.state.set('shadow.x', parseInt(value));
    this.elements.shadowXValue.textContent = value;
  }

  handleShadowYChange(value) {
    this.state.set('shadow.y', parseInt(value));
    this.elements.shadowYValue.textContent = value;
  }

  handleShadowBlurChange(value) {
    this.state.set('shadow.blur', parseInt(value));
    this.elements.shadowBlurValue.textContent = value;
  }

  handleShadowColorChange(value) {
    this.state.set('shadow.color', value);
  }

  handleShadowOpacityChange(value) {
    const opacity = parseInt(value) / 100;
    this.state.set('shadow.opacity', opacity);
    this.elements.shadowOpacityValue.textContent = value;
  }

  handleMirrorChange(value) {
    this.state.set('mirror', value);
  }

  handleEffectChange(value) {
    this.state.set('effect', value);
  }

  handleFormatChange(value) {
    this.state.set('exportFormat', value);
    // Sync both format selectors
    if (this.elements.exportFormatSelect) {
      this.elements.exportFormatSelect.value = value;
    }
    if (this.elements.exportFormatSelectDesktop) {
      this.elements.exportFormatSelectDesktop.value = value;
    }
  }

  async handleDownload() {
    try {
      const exportFormat = this.state.get('exportFormat');
      
      await this.exporter.downloadImage(exportFormat);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }

  async handleCopyImage() {
    try {
      // Generate image data
      const canvas = this.elements.canvas;
      
      if (navigator.clipboard && window.ClipboardItem) {
        // Modern clipboard API
        canvas.toBlob(async (blob) => {
          try {
            const item = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([item]);
          } catch (error) {
            console.error('Failed to copy image:', error);
          }
        }, 'image/png');
      } else {
        // Fallback: copy data URL as text
        const dataURL = canvas.toDataURL('image/png');
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(dataURL);
        } else {
        }
      }
    } catch (error) {
      console.error('Failed to copy image:', error);
    }
  }

  async handleSaveToGallery() {
    try {
      const thumbnail = this.renderer.getThumbnail(100);
      const stateSnapshot = this.state.createSnapshot();
      
      this.gallery.saveToGallery(thumbnail, stateSnapshot);
    } catch (error) {
      console.error('Save to gallery failed:', error);
    }
  }

  handleReset() {
    if (confirm('Are you sure you want to reset all settings?')) {
      this.state.resetState();
      this.initializeUI();
    }
  }
  
  /**
   * Handle image overlay toggle
   */
  handleImageOverlayToggle(enabled) {
    this.state.updateState({ 
      imageOverlay: { 
        ...this.state.getState().imageOverlay, 
        enabled 
      } 
    });
  }

  initializeExportSizeControls(state) {
    // Set export size inputs to match state
    if (this.elements.customExportWidth) this.elements.customExportWidth.value = state.customExportWidth;
    if (this.elements.customExportHeight) this.elements.customExportHeight.value = state.customExportHeight;
    if (this.elements.customExportWidthDesktop) this.elements.customExportWidthDesktop.value = state.customExportWidth;
    if (this.elements.customExportHeightDesktop) this.elements.customExportHeightDesktop.value = state.customExportHeight;
    
    // Update export size preset dropdown
    const currentExportSize = `${state.customExportWidth}x${state.customExportHeight}`;
    
    // Update mobile export size preset dropdown
    if (this.elements.exportSizePreset) {
      const exportPresetOptions = Array.from(this.elements.exportSizePreset.options);
      const matchingExportOption = exportPresetOptions.find(opt => opt.value === currentExportSize);
      if (matchingExportOption) {
        this.elements.exportSizePreset.value = currentExportSize;
        if (this.elements.customExportSizeGroup) {
          this.elements.customExportSizeGroup.style.display = 'none';
          this.elements.customExportSizeGroup.classList.remove('active');
        }
      } else {
        this.elements.exportSizePreset.value = 'custom';
        if (this.elements.customExportSizeGroup) {
          this.elements.customExportSizeGroup.style.display = 'block';
          this.elements.customExportSizeGroup.classList.add('active');
        }
      }
    }
    
    // Update desktop export size preset dropdown
    if (this.elements.exportSizePresetDesktop) {
      const exportPresetOptionsDesktop = Array.from(this.elements.exportSizePresetDesktop.options);
      const matchingExportOptionDesktop = exportPresetOptionsDesktop.find(opt => opt.value === currentExportSize);
      if (matchingExportOptionDesktop) {
        this.elements.exportSizePresetDesktop.value = currentExportSize;
        if (this.elements.customExportSizeGroupDesktop) {
          this.elements.customExportSizeGroupDesktop.style.display = 'none';
          this.elements.customExportSizeGroupDesktop.classList.remove('active');
        }
      } else {
        this.elements.exportSizePresetDesktop.value = 'custom';
        if (this.elements.customExportSizeGroupDesktop) {
          this.elements.customExportSizeGroupDesktop.style.display = 'block';
          this.elements.customExportSizeGroupDesktop.classList.add('active');
        }
      }
    }
    
    // Set canvas size to match export size (only if renderer exists)
    if (this.renderer && this.renderer.updateCanvasSize) {
      this.renderer.updateCanvasSize(state.customExportWidth, state.customExportHeight);
    }
  }

  /**
   * Cleanup and destroy the application
   */
  destroy() {
    // Remove all event listeners
    this.eventListeners.forEach(cleanup => cleanup());
    this.eventListeners = [];
    
    // Destroy components
    if (this.renderer) {
      this.renderer.destroy();
    }
    
    if (this.gallery) {
      this.gallery.destroy();
    }
    
    if (this.exporter) {
      this.exporter.destroy();
    }
    
    // Clear references
    this.elements = {};
    this.state = null;
    this.renderer = null;
    this.gallery = null;
    this.exporter = null;
  }
}

// Initialize the application when DOM is loaded
let app;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app = new BratGeneratorApp();
    // Export for debugging and testing
    if (typeof window !== 'undefined') {
      window.BratGeneratorApp = BratGeneratorApp;
      window.app = app;
    }
  });
} else {
  app = new BratGeneratorApp();
  // Export for debugging and testing
  if (typeof window !== 'undefined') {
    window.BratGeneratorApp = BratGeneratorApp;
    window.app = app;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BratGeneratorApp;
}
