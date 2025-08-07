// ===== BUBBLE AI PRESENTATION - NAVIGATION SYSTEM =====

class NavigationManager {
    constructor(presentationController) {
        this.presentation = presentationController;
        this.keyDebounce = null;
        this.wheelTimeout = null;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchTime = 0;
        this.cursorTimeout = null;
        this.cursorHidden = false;

        this.init();
    }

    init() {
        this.setupKeyboardNavigation();
        this.setupMouseWheelNavigation();
        this.setupTouchNavigation();
        this.setupClickNavigation();
        this.setupCursorManagement();

        console.log('🎮 Navigation system initialized');
    }

    // Keyboard Navigation
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Debounce rapid key presses
            if (this.keyDebounce) clearTimeout(this.keyDebounce);

            this.keyDebounce = setTimeout(() => {
                this.handleKeyboardEvent(e);
            }, 50);
        });
    }

    handleKeyboardEvent(e) {
        try {
            switch (e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                case 'PageUp':
                    e.preventDefault();
                    this.presentation.changeSlide(-1);
                    break;

                case 'ArrowRight':
                case 'ArrowDown':
                case 'PageDown':
                case ' ': // Spacebar
                    e.preventDefault();
                    this.presentation.changeSlide(1);
                    break;

                case 'Home':
                    e.preventDefault();
                    this.presentation.goToFirstSlide();
                    break;

                case 'End':
                    e.preventDefault();
                    this.presentation.goToLastSlide();
                    break;

                case 'F11':
                    e.preventDefault();
                    if (window.fullscreenManager) {
                        window.fullscreenManager.toggle();
                    }
                    break;

                case 'Escape':
                    if (document.fullscreenElement && window.fullscreenManager) {
                        window.fullscreenManager.exit();
                    }
                    break;

                // Number keys for direct slide navigation
                case '1': case '2': case '3': case '4': case '5':
                case '6': case '7': case '8': case '9':
                    e.preventDefault();
                    const slideNumber = parseInt(e.key) - 1;
                    this.presentation.goToSlide(slideNumber);
                    break;
            }
        } catch (error) {
            console.warn('Keyboard navigation error:', error);
        }
    }

    // Mouse Wheel Navigation with Smart Scrolling
    setupMouseWheelNavigation() {
        document.addEventListener('wheel', (e) => {
            if (this.presentation.isTransitioning || this.wheelTimeout) return;

            try {
                const activeSlide = document.querySelector('.slide.active');
                if (!activeSlide) return;

                // Check if the slide content is scrollable
                const isScrollable = activeSlide.scrollHeight > activeSlide.clientHeight;
                const isAtTop = activeSlide.scrollTop === 0;
                const isAtBottom = activeSlide.scrollTop + activeSlide.clientHeight >= activeSlide.scrollHeight - 1;

                // Only change slides if:
                // 1. Content is not scrollable, OR
                // 2. Scrolling up and already at top, OR  
                // 3. Scrolling down and already at bottom
                const shouldChangeSlide = !isScrollable ||
                    (e.deltaY < 0 && isAtTop) ||
                    (e.deltaY > 0 && isAtBottom);

                if (shouldChangeSlide && Math.abs(e.deltaY) > 50) {
                    e.preventDefault();
                    this.wheelTimeout = setTimeout(() => {
                        this.wheelTimeout = null;
                    }, 300);

                    if (e.deltaY > 0) {
                        this.presentation.changeSlide(1);
                    } else {
                        this.presentation.changeSlide(-1);
                    }
                }
            } catch (error) {
                console.warn('Wheel navigation error:', error);
            }
        }, { passive: false });
    }

    // Touch Navigation for Mobile
    setupTouchNavigation() {
        document.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            this.touchTime = Date.now();
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (this.presentation.isTransitioning) return;

            try {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                const touchDuration = Date.now() - this.touchTime;

                const diffX = this.touchStartX - touchEndX;
                const diffY = this.touchStartY - touchEndY;

                // Only trigger if it's a quick swipe (< 500ms) and primarily horizontal
                if (touchDuration < 500 && Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        this.presentation.changeSlide(1); // swipe left
                    } else {
                        this.presentation.changeSlide(-1); // swipe right
                    }
                }
            } catch (error) {
                console.warn('Touch navigation error:', error);
            }
        }, { passive: true });
    }

    // Click Navigation (anywhere on slide advances)
    setupClickNavigation() {
        document.addEventListener('click', (e) => {
            if (this.presentation.isTransitioning) return;

            try {
                // Exclude navigation buttons and interactive elements
                const isNavButton = e.target.closest('.nav-btn');
                const isCTAButton = e.target.closest('.cta-btn');
                const isInteractiveElement = e.target.closest('button, a, input, textarea, select');
                const isScrollableArea = e.target.closest('.slide');

                // Only advance if clicking on slide content (not interactive elements)
                if (!isNavButton && !isCTAButton && !isInteractiveElement && isScrollableArea) {
                    // Check if the slide is scrollable and not at bottom
                    const activeSlide = document.querySelector('.slide.active');
                    if (activeSlide) {
                        const isScrollable = activeSlide.scrollHeight > activeSlide.clientHeight;
                        const isAtBottom = activeSlide.scrollTop + activeSlide.clientHeight >= activeSlide.scrollHeight - 1;

                        // Only advance if not scrollable or at bottom
                        if (!isScrollable || isAtBottom) {
                            this.presentation.changeSlide(1);
                        }
                    }
                }
            } catch (error) {
                console.warn('Click navigation error:', error);
            }
        });
    }

    // Cursor Management (auto-hide for presentations)
    setupCursorManagement() {
        document.addEventListener('mousemove', () => {
            this.showCursor();
            clearTimeout(this.cursorTimeout);
            this.cursorTimeout = setTimeout(() => {
                this.hideCursor();
            }, 3000);
        });

        // Show cursor on key press
        document.addEventListener('keydown', () => {
            this.showCursor();
        });
    }

    showCursor() {
        if (this.cursorHidden) {
            document.body.style.cursor = 'default';
            this.cursorHidden = false;
        }
    }

    hideCursor() {
        if (!this.cursorHidden) {
            document.body.style.cursor = 'none';
            this.cursorHidden = true;
        }
    }

    // Get navigation status
    getNavigationInfo() {
        return {
            currentSlide: this.presentation.currentSlideIndex + 1,
            totalSlides: this.presentation.totalSlides,
            canGoBack: this.presentation.currentSlideIndex > 0,
            canGoForward: this.presentation.currentSlideIndex < this.presentation.totalSlides - 1,
            isTransitioning: this.presentation.isTransitioning
        };
    }

    // Disable navigation temporarily
    disable() {
        this.disabled = true;
        document.removeEventListener('keydown', this.handleKeyboardEvent);
    }

    // Re-enable navigation
    enable() {
        this.disabled = false;
        this.setupKeyboardNavigation();
    }
}

// Presentation Controls (external API)
class PresentationControls {
    constructor(presentationController) {
        this.presentation = presentationController;
        this.navigation = new NavigationManager(presentationController);
    }

    // Public API methods
    next() {
        this.presentation.changeSlide(1);
    }

    previous() {
        this.presentation.changeSlide(-1);
    }

    goTo(slideNumber) {
        this.presentation.goToSlide(slideNumber - 1); // Convert to 0-based index
    }

    first() {
        this.presentation.goToFirstSlide();
    }

    last() {
        this.presentation.goToLastSlide();
    }

    getCurrentSlide() {
        return this.presentation.currentSlideIndex + 1;
    }

    getTotalSlides() {
        return this.presentation.totalSlides;
    }

    // Presentation mode helpers
    enterPresentationMode() {
        try {
            if (window.fullscreenManager) {
                window.fullscreenManager.enter();
            }
            this.navigation.hideCursor();

            // Hide UI elements that might interfere
            const elements = document.querySelectorAll('.slide-counter');
            elements.forEach(el => el.style.opacity = '0.3');

            console.log('🎯 Entered presentation mode');
        } catch (error) {
            console.warn('Error entering presentation mode:', error);
        }
    }

    exitPresentationMode() {
        try {
            if (window.fullscreenManager) {
                window.fullscreenManager.exit();
            }
            this.navigation.showCursor();

            // Restore UI elements
            const elements = document.querySelectorAll('.slide-counter');
            elements.forEach(el => el.style.opacity = '1');

            console.log('🎯 Exited presentation mode');
        } catch (error) {
            console.warn('Error exiting presentation mode:', error);
        }
    }

    // Get presentation statistics
    getStats() {
        return {
            currentSlide: this.getCurrentSlide(),
            totalSlides: this.getTotalSlides(),
            progress: Math.round((this.getCurrentSlide() / this.getTotalSlides()) * 100),
            navigationInfo: this.navigation.getNavigationInfo()
        };
    }
}

// Auto-advance functionality
class AutoAdvance {
    constructor(presentationControls) {
        this.controls = presentationControls;
        this.interval = null;
        this.duration = 30000; // 30 seconds default
        this.isRunning = false;
    }

    start(duration = this.duration) {
        this.duration = duration;
        this.isRunning = true;

        this.interval = setInterval(() => {
            const stats = this.controls.getStats();
            if (stats.currentSlide < stats.totalSlides) {
                this.controls.next();
            } else {
                this.stop(); // Stop at the end
            }
        }, this.duration);

        console.log(`⏰ Auto-advance started (${duration / 1000}s intervals)`);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.isRunning = false;
        console.log('⏰ Auto-advance stopped');
    }

    isActive() {
        return this.isRunning;
    }
}

// Initialize navigation system
let navigationManager;
let presentationControls;
let autoAdvance;

function initializeNavigation() {
    if (window.presentationController) {
        navigationManager = new NavigationManager(window.presentationController);
        presentationControls = new PresentationControls(window.presentationController);
        autoAdvance = new AutoAdvance(presentationControls);

        // Make controls globally available
        window.presentationControls = presentationControls;
        window.autoAdvance = autoAdvance;

        console.log('🎮 Navigation system fully initialized');
    } else {
        console.warn('⚠️ Presentation controller not found, retrying...');
        setTimeout(initializeNavigation, 100);
    }
}

// Initialize when presentation controller is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeNavigation, 100);
    });
} else {
    setTimeout(initializeNavigation, 100);
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NavigationManager,
        PresentationControls,
        AutoAdvance
    };
}