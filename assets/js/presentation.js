// ===== BUBBLE AI PRESENTATION - MAIN LOGIC =====

class PresentationController {
    constructor() {
        this.currentSlideIndex = 0;
        this.isTransitioning = false;
        this.slides = document.querySelectorAll('.slide');
        this.totalSlides = this.slides.length;

        this.init();
    }

    // Initialize presentation
    init() {
        this.setupSlideCounter();
        this.showSlide(0);
        this.setupErrorHandling();

        console.log(`
✨ BUBBLE AI Presentation Controller Initialized
├── Total Slides: ${this.totalSlides}
├── Current Slide: ${this.currentSlideIndex + 1}
└── Ready for presentation!
        `);
    }

    // Setup slide counter
    setupSlideCounter() {
        const totalSlidesElement = document.getElementById('totalSlides');
        if (totalSlidesElement) {
            totalSlidesElement.textContent = this.totalSlides;
        }
    }

    // Error handling wrapper
    safeExecute(fn, fallback = () => { }) {
        try {
            return fn();
        } catch (error) {
            console.warn('Presentation error:', error);
            return fallback();
        }
    }

    // Show specific slide
    showSlide(index) {
        if (this.isTransitioning || index < 0 || index >= this.totalSlides) {
            return;
        }

        this.isTransitioning = true;

        this.safeExecute(() => {
            // Hide all slides
            this.slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === index) {
                    slide.classList.add('active');
                    // Announce to screen readers
                    slide.setAttribute('aria-live', 'polite');
                    setTimeout(() => slide.removeAttribute('aria-live'), 1000);
                }
            });

            // Update slide counter
            const currentSlideElement = document.getElementById('currentSlide');
            if (currentSlideElement) {
                currentSlideElement.textContent = index + 1;
            }

            // Update navigation buttons
            this.updateNavigationButtons(index);

            // Add stagger animation to slide content
            this.addStaggerAnimation(index);
        });

        // Reset transition lock after animation
        setTimeout(() => {
            this.isTransitioning = false;
        }, 800);
    }

    // Update navigation button states
    updateNavigationButtons(index) {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn) {
            prevBtn.disabled = index === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = index === this.totalSlides - 1;
        }
    }

    // Add stagger animation to slide elements
    addStaggerAnimation(index) {
        const activeSlide = this.slides[index];
        if (!activeSlide) return;

        const elements = activeSlide.querySelectorAll('*');
        elements.forEach((el, i) => {
            el.style.animationDelay = (i * 0.1) + 's';
        });
    }

    // Navigate to next/previous slide
    changeSlide(direction) {
        if (this.isTransitioning) return;

        const newIndex = this.currentSlideIndex + direction;
        if (newIndex >= 0 && newIndex < this.totalSlides) {
            this.currentSlideIndex = newIndex;
            this.showSlide(this.currentSlideIndex);
        }
    }

    // Jump to specific slide
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.currentSlideIndex = index;
            this.showSlide(this.currentSlideIndex);
        }
    }

    // Go to first slide
    goToFirstSlide() {
        this.currentSlideIndex = 0;
        this.showSlide(this.currentSlideIndex);
    }

    // Go to last slide
    goToLastSlide() {
        this.currentSlideIndex = this.totalSlides - 1;
        this.showSlide(this.currentSlideIndex);
    }

    // Setup global error handling
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.warn('Global error caught:', e.error);
            // Continue functioning even with errors
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.warn('Unhandled promise rejection:', e.reason);
        });
    }

    // Get current slide data
    getCurrentSlide() {
        return {
            index: this.currentSlideIndex,
            total: this.totalSlides,
            element: this.slides[this.currentSlideIndex]
        };
    }

    // Check if presentation is ready
    isReady() {
        return this.slides.length > 0 && !this.isTransitioning;
    }

    // Pause all animations
    pauseAnimations() {
        document.body.classList.add('animations-paused');
    }

    // Resume all animations
    resumeAnimations() {
        document.body.classList.remove('animations-paused');
    }
}

// Fullscreen Management
class FullscreenManager {
    constructor() {
        this.isFullscreen = false;
        this.setupEventListeners();
    }

    // Toggle fullscreen mode
    toggle() {
        try {
            if (!document.fullscreenElement) {
                this.enter();
            } else {
                this.exit();
            }
        } catch (error) {
            console.warn('Fullscreen error:', error);
        }
    }

    // Enter fullscreen
    enter() {
        const element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    // Exit fullscreen
    exit() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    // Setup event listeners
    setupEventListeners() {
        document.addEventListener('fullscreenchange', () => {
            this.isFullscreen = !!document.fullscreenElement;
        });

        document.addEventListener('webkitfullscreenchange', () => {
            this.isFullscreen = !!document.webkitFullscreenElement;
        });

        document.addEventListener('mozfullscreenchange', () => {
            this.isFullscreen = !!document.mozFullScreenElement;
        });
    }
}

// Performance Monitor
class PerformanceMonitor {
    constructor() {
        this.isLowPerformance = false;
        this.frameCount = 0;
        this.lastTime = performance.now();

        this.checkPerformance();
    }

    // Check device performance
    checkPerformance() {
        // Check if device is low-end
        const isMobile = window.innerWidth <= 768;
        const hasLimitedRAM = navigator.deviceMemory && navigator.deviceMemory <= 4;
        const hasSlowConnection = navigator.connection && navigator.connection.effectiveType === 'slow-2g';

        this.isLowPerformance = isMobile || hasLimitedRAM || hasSlowConnection;

        if (this.isLowPerformance) {
            this.optimizeForLowPerformance();
        }
    }

    // Optimize for low-performance devices
    optimizeForLowPerformance() {
        // Reduce particles
        const particleCount = Math.floor(window.innerWidth / 50);

        // Reduce blur effects
        const style = document.createElement('style');
        style.textContent = `
            .slide { backdrop-filter: blur(5px); }
            .metric-card, .feature-card { backdrop-filter: blur(3px); }
            .orb { filter: blur(20px); }
        `;
        document.head.appendChild(style);

        console.log('🔧 Performance optimizations applied for low-end device');
    }

    // Monitor frame rate
    monitorFPS() {
        const now = performance.now();
        this.frameCount++;

        if (now >= this.lastTime + 1000) {
            const fps = Math.round((this.frameCount * 1000) / (now - this.lastTime));

            if (fps < 30) {
                console.warn('⚠️ Low FPS detected:', fps);
                this.optimizeForLowPerformance();
            }

            this.frameCount = 0;
            this.lastTime = now;
        }

        requestAnimationFrame(() => this.monitorFPS());
    }
}

// Accessibility Manager
class AccessibilityManager {
    constructor() {
        this.setupAccessibilityFeatures();
    }

    // Setup accessibility features
    setupAccessibilityFeatures() {
        this.handleReducedMotion();
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
    }

    // Handle reduced motion preferences
    handleReducedMotion() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        const handleMotionPreference = () => {
            if (mediaQuery.matches) {
                document.body.classList.add('reduced-motion');
                console.log('♿ Reduced motion mode activated');
            } else {
                document.body.classList.remove('reduced-motion');
            }
        };

        mediaQuery.addEventListener('change', handleMotionPreference);
        handleMotionPreference();
    }

    // Setup keyboard navigation
    setupKeyboardNavigation() {
        // Ensure all interactive elements are focusable
        const interactiveElements = document.querySelectorAll('.nav-btn, .cta-btn');
        interactiveElements.forEach(el => {
            if (!el.hasAttribute('tabindex')) {
                el.setAttribute('tabindex', '0');
            }
        });
    }

    // Setup screen reader support
    setupScreenReaderSupport() {
        // Add landmarks
        const main = document.querySelector('.presentation-container');
        if (main && !main.hasAttribute('role')) {
            main.setAttribute('role', 'main');
        }

        // Add slide descriptions
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            slide.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
        });
    }
}

// Initialize when DOM is loaded
let presentationController;
let fullscreenManager;
let performanceMonitor;
let accessibilityManager;

function initializePresentation() {
    try {
        presentationController = new PresentationController();
        fullscreenManager = new FullscreenManager();
        performanceMonitor = new PerformanceMonitor();
        accessibilityManager = new AccessibilityManager();

        // Start performance monitoring
        performanceMonitor.monitorFPS();

        console.log('🚀 All presentation systems initialized successfully!');
    } catch (error) {
        console.error('Failed to initialize presentation:', error);

        // Fallback initialization
        presentationController = new PresentationController();
        console.log('⚠️ Fallback initialization completed');
    }
}

// Global functions for navigation (called by HTML buttons)
function changeSlide(direction) {
    if (presentationController) {
        presentationController.changeSlide(direction);
    }
}

function goToSlide(index) {
    if (presentationController) {
        presentationController.goToSlide(index);
    }
}

// Initialize when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePresentation);
} else {
    initializePresentation();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PresentationController,
        FullscreenManager,
        PerformanceMonitor,
        AccessibilityManager
    };
}