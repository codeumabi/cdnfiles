// ================================
// Robust Page Header / Menu / Theme Script
// ================================
class PageNavigation {
  constructor() {
    this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    this.mobileMenu = document.querySelector('.mobile-menu');
    this.mobileMenuBackdrop = document.querySelector('.mobile-menu-backdrop');
    this.header = document.querySelector('.page-header');
    this.lastScrollY = 0;
    this._boundDocClick = this._handleDocumentClick.bind(this);
    this._boundKeydown = this._handleKeydown.bind(this);
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupScrollEffects();
    this.setupActiveNavLinks();
    this.setupSmoothScrolling();
    document.addEventListener('click', this._boundDocClick);
    document.addEventListener('keydown', this._boundKeydown);
  }

  setupMobileMenu() {
    if (!this.mobileMenu || !this.mobileMenuToggle) return;

    this.mobileMenuToggle.setAttribute('aria-expanded', 'false');

    this.mobileMenuToggle.addEventListener('click', (ev) => {
      ev.stopPropagation();
      this.toggleMobileMenu();
    });

    if (this.mobileMenuBackdrop) {
      this.mobileMenuBackdrop.addEventListener('click', (ev) => {
        ev.stopPropagation();
        this.closeMobileMenu();
      });
    }

    this.mobileMenu.addEventListener('click', (ev) => {
      const target = ev.target.closest('a');
      if (!target) return;
      ev.stopPropagation();

      const parentLi = target.closest('.has-submenu');
      const isSubmenuToggle = parentLi && parentLi.querySelector(':scope > a') === target;

      if (isSubmenuToggle) {
        ev.preventDefault();
        this.mobileMenu
          .querySelectorAll('.has-submenu')
          .forEach((item) => {
            if (item !== parentLi) item.classList.remove('open');
          });
        parentLi.classList.toggle('open');
        return;
      }

      const href = target.getAttribute('href');
      if (href && href !== '#') this.closeMobileMenu();
    });
  }

  _handleDocumentClick(ev) {
    if (!ev.target.closest('.dropdown')) {
      document.querySelectorAll('.header-nav .dropdown.open').forEach((d) => d.classList.remove('open'));
    }

    if (
      this.mobileMenu &&
      this.mobileMenu.classList.contains('active') &&
      !ev.target.closest('.mobile-menu') &&
      !ev.target.closest('.mobile-menu-toggle') &&
      !ev.target.closest('.mobile-menu-backdrop')
    ) {
      this.closeMobileMenu();
    }
  }

  _handleKeydown(ev) {
    if (ev.key === 'Escape') {
      if (this.mobileMenu?.classList.contains('active')) this.closeMobileMenu();
      document.querySelectorAll('.header-nav .dropdown.open').forEach((d) => d.classList.remove('open'));
    }
  }

  toggleMobileMenu() {
    this.mobileMenu?.classList.contains('active')
      ? this.closeMobileMenu()
      : this.openMobileMenu();
  }

  openMobileMenu() {
    if (!this.mobileMenu || !this.mobileMenuToggle) return;
    this.mobileMenu.classList.add('active');
    this.mobileMenuToggle.classList.add('active');
    this.mobileMenuToggle.setAttribute('aria-expanded', 'true');
    this.mobileMenuBackdrop?.classList.add('active');
    document.body.classList.add('menu-open');
    this.trapFocus(this.mobileMenu);
  }

  closeMobileMenu() {
    if (!this.mobileMenu || !this.mobileMenuToggle) return;
    this.mobileMenu.classList.remove('active');
    this.mobileMenuToggle.classList.remove('active');
    this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
    this.mobileMenuBackdrop?.classList.remove('active');
    document.body.classList.remove('menu-open');
    this.mobileMenu.querySelectorAll('.has-submenu.open').forEach((i) => i.classList.remove('open'));
  }

  trapFocus(element) {
    if (!element) return;
    const focusableSelectors =
      'a[href], button:not([disabled]), textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select';
    const focusable = [...element.querySelectorAll(focusableSelectors)].filter((el) => el.offsetParent !== null);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    element._focusKeydown && element.removeEventListener('keydown', element._focusKeydown);

    element._focusKeydown = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', element._focusKeydown);
    first.focus();
  }

  setupScrollEffects() {
    if (!this.header) return;
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      this.header.style.boxShadow = currentScrollY > 10 ? 'var(--shadow-md)' : 'none';
      this.header.style.transform =
        currentScrollY > this.lastScrollY && currentScrollY > 100 ? 'translateY(-100%)' : 'translateY(0)';
      this.lastScrollY = currentScrollY;
    });
  }

  setupActiveNavLinks() {
    const navLinks = document.querySelectorAll('.header-nav a, .mobile-menu-nav a');
    const currentPath = window.location.pathname;
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '/' && href === '/')) link.classList.add('active');
    });
  }

  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (!target) return;
        const headerHeight = document.querySelector('.page-header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      });
    });
  }
}

// ================================
// Footer Effects
// ================================
class FooterEffects {
  constructor() {
    this.init();
  }

  init() {
    this.setupSocialLinks();
    this.setupFooterAnimations();
  }

  setupSocialLinks() {
    document.querySelectorAll('.social-link').forEach((link) => {
      link.addEventListener('mouseenter', (e) => (e.target.style.transform = 'translateY(-3px) scale(1.05)'));
      link.addEventListener('mouseleave', (e) => (e.target.style.transform = 'translateY(0) scale(1)'));
    });
  }

  setupFooterAnimations() {
    const footer = document.querySelector('.page-footer');
    if (!footer) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          footer.style.opacity = '1';
          footer.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    footer.style.opacity = '0';
    footer.style.transform = 'translateY(20px)';
    footer.style.transition = 'all 0.6s ease-out';
    observer.observe(footer);
  }
}

// ================================
// FAQ Manager
// ================================
class FAQManager {
  constructor() {
    this.init();
  }

  init() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach((question) => {
      question.addEventListener('click', () => {
        const faqItem = question.closest('.faq-item');
        const answer = faqItem.querySelector('.faq-answer');
        const isExpanded = question.getAttribute('aria-expanded') === 'true';
        faqQuestions.forEach((q) => {
          if (q !== question) {
            const otherItem = q.closest('.faq-item');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            q.setAttribute('aria-expanded', 'false');
            otherAnswer.classList.remove('show');
          }
        });
        question.setAttribute('aria-expanded', !isExpanded);
        answer.classList.toggle('show', !isExpanded);
      });
    });
  }
}

// ================================
// Dark Theme Manager
// ================================
class DarkThemeManager {
  constructor() {
    this.darkModeToggle = null;
    this.currentTheme = 'light';
    this.init();
  }

  init() {
    this.loadThemePreference();
    this.setupDarkModeToggle();
    this.applyTheme(this.currentTheme);
  }

  setupDarkModeToggle() {
    this.darkModeToggle = document.getElementById('darkModeToggle');
    if (!this.darkModeToggle) return;
    this.darkModeToggle.addEventListener('click', () => this.toggleTheme());
    this.updateToggleIcon();
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.currentTheme);
    this.saveThemePreference();
    this.updateToggleIcon();
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: this.currentTheme } }));
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    const color = theme === 'dark' ? '#0f172a' : '#ffffff';
    if (metaThemeColor) metaThemeColor.setAttribute('content', color);
    else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = color;
      document.head.appendChild(meta);
    }
  }

  updateToggleIcon() {
    if (!this.darkModeToggle) return;
    const icon = this.darkModeToggle.querySelector('i');
    if (icon) {
      icon.setAttribute('data-lucide', this.currentTheme === 'light' ? 'moon' : 'sun');
      if (window.lucide) window.lucide.createIcons();
    }
    const label = this.currentTheme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
    this.darkModeToggle.setAttribute('aria-label', label);
    this.darkModeToggle.setAttribute('aria-pressed', this.currentTheme === 'dark');
    this.updateLogos();
  }

  saveThemePreference() {
    try {
      localStorage.setItem('theme-preference', this.currentTheme);
    } catch (e) {}
  }

  loadThemePreference() {
    try {
      const saved = localStorage.getItem('theme-preference');
      if (saved) this.currentTheme = saved;
      else this.currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (e) {
      this.currentTheme = 'light';
    }
  }

  updateLogos() {
    const logos = document.querySelectorAll('.header-logo img, .footer-logo img');
    const src = this.currentTheme === 'dark' ? '/images/darklogo.png' : '/images/logo.png';
    logos.forEach((img) => (img.src = src));
  }
}

// ================================
// Initialization
// ================================
document.addEventListener('DOMContentLoaded', () => {
  const pageNavigation = new PageNavigation();
  const footerEffects = new FooterEffects();
  const faqManager = new FAQManager();
  const darkThemeManager = new DarkThemeManager();

  window.pageNavigation = pageNavigation;
  window.darkThemeManager = darkThemeManager;

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme-preference')) {
      darkThemeManager.setTheme?.(e.matches ? 'dark' : 'light');
    }
  });
});

// ================================
// Resize Handler
// ================================
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    const menu = document.querySelector('.mobile-menu');
    const toggle = document.querySelector('.mobile-menu-toggle');
    if (menu?.classList.contains('active')) {
      const backdrop = document.querySelector('.mobile-menu-backdrop');
      menu.classList.remove('active');
      toggle?.classList.remove('active');
      backdrop?.classList.remove('active');
      document.body.classList.remove('menu-open');
    }
  }
});



// ================================
// Desktop Dropdown Click Handling
// ================================
document.addEventListener('click', (e) => {
  const toggle = e.target.closest('.header-nav .dropdown-toggle');
  const openDropdown = document.querySelector('.header-nav .dropdown.open');

  // If clicked on a dropdown toggle
  if (toggle) {
    e.preventDefault();
    e.stopPropagation();

    const parent = toggle.closest('.dropdown');
    // Close other open dropdowns
    document.querySelectorAll('.header-nav .dropdown').forEach((drop) => {
      if (drop !== parent) drop.classList.remove('open');
    });

    parent.classList.toggle('open');
    return;
  }

  // If clicked outside any dropdown, close open ones
  if (openDropdown && !e.target.closest('.dropdown')) {
    openDropdown.classList.remove('open');
  }
});



// ........................................................................................
// PWA Install Banner (Responsive + Persistent until closed)
let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Create banner container
  const banner = document.createElement("div");
  banner.innerHTML = `
    <div id="installBanner" style="
      position: fixed;
      bottom: 16px;
      left: 50%;
      transform: translateX(-50%);
      background: #93eb13;
      color: #000;
      padding: 14px 18px;
      border-radius: 12px;
      font-weight: 600;
      font-family: system-ui, sans-serif;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      width: 90%;
      max-width: 420px;
      animation: fadeIn 0.4s ease;
    ">
      <span style="flex:1; font-size: 15px; line-height:1.3;">📱 Install <strong>Brat Generator App</strong></span>
      <button id="closeBanner" style="
        background: transparent;
        border: none;
        font-size: 20px;
        cursor: pointer;
        color: #000;
        font-weight: bold;
        line-height: 1;
      ">✖</button>
    </div>

    <style>
      @keyframes fadeIn {
        from {opacity:0; transform:translate(-50%, 20px);}
        to {opacity:1; transform:translate(-50%, 0);}
      }
      @keyframes fadeOut {
        from {opacity:1; transform:translate(-50%, 0);}
        to {opacity:0; transform:translate(-50%, 20px);}
      }

      /* 🔹 Responsive adjustments for small screens */
      @media (max-width: 480px) {
        #installBanner {
          bottom: 10px !important;
          padding: 12px 14px !important;
          border-radius: 10px !important;
          width: 92% !important;
          max-width: none !important;
        }
        #installBanner span {
          font-size: 14px !important;
        }
        #closeBanner {
          font-size: 18px !important;
        }
      }
    </style>
  `;

  document.body.appendChild(banner);

  const installBanner = document.getElementById("installBanner");
  const closeBtn = document.getElementById("closeBanner");

  // Click to install
  installBanner.addEventListener("click", async (event) => {
    if (event.target.id === "closeBanner") return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      console.log("✅ User accepted install");
    } else {
      console.log("❌ User dismissed install");
    }
    deferredPrompt = null;
    installBanner.remove();
  });

  // Close button handler
  closeBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    installBanner.style.animation = "fadeOut 0.5s ease forwards";
    setTimeout(() => installBanner.remove(), 500);
  });
});
