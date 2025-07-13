// BridgeVoice Website JavaScript

// Theme management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.init();
  }

  init() {
    this.applyTheme();
    this.setupToggle();
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.innerHTML = this.theme === 'light' ? '🌙' : '☀️';
      themeToggle.setAttribute('aria-label', `Switch to ${this.theme === 'light' ? 'dark' : 'light'} mode`);
    }
  }

  setupToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', this.theme);
    this.applyTheme();
  }
}

// Language management
class LanguageManager {
  constructor() {
    this.currentLang = this.detectLanguage();
    this.init();
  }

  detectLanguage() {
    // Check URL for language prefix
    const path = window.location.pathname;
    if (path.includes('index-ar.html')) return 'ar';
    if (path.includes('index-zh.html')) return 'zh';
    return 'en';
  }

  init() {
    this.setupLanguageButtons();
    this.updateActiveLanguage();
  }

  setupLanguageButtons() {
    const langButtons = document.querySelectorAll('.language-btn');
    langButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchLanguage(btn.getAttribute('data-lang'));
      });
    });
  }

  updateActiveLanguage() {
    const langButtons = document.querySelectorAll('.language-btn');
    langButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === this.currentLang);
    });
  }

  switchLanguage(lang) {
    const langMap = {
      'en': 'index.html',
      'ar': 'index-ar.html',
      'zh': 'index-zh.html'
    };

    if (langMap[lang]) {
      window.location.href = langMap[lang];
    }
  }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Intersection Observer for fade-in animations
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  const animatedElements = document.querySelectorAll('.feature-card, .hero-content');
  animatedElements.forEach(el => observer.observe(el));
}

// Keyboard navigation improvements
function initKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // ESC key closes any open modals/dropdowns
    if (e.key === 'Escape') {
      // Close any open elements
      document.querySelectorAll('.is-open').forEach(el => {
        el.classList.remove('is-open');
      });
    }

    // Tab trap for accessibility
    if (e.key === 'Tab') {
      const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  });
}

// Performance monitoring
function initPerformanceMonitoring() {
  if ('performance' in window) {
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      console.log(`Page load time: ${loadTime}ms`);
    });
  }
}

// Initialize all features when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme management
  new ThemeManager();
  
  // Initialize language management
  new LanguageManager();
  
  // Initialize smooth scrolling
  initSmoothScrolling();
  
  // Initialize scroll animations
  initScrollAnimations();
  
  // Initialize keyboard navigation
  initKeyboardNavigation();
  
  // Initialize performance monitoring
  initPerformanceMonitoring();
});

// Handle system theme changes
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      const theme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', theme);
    }
  });
}

// Service worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}