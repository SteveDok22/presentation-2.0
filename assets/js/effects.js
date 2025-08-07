// ===== BUBBLE AI PRESENTATION - VISUAL EFFECTS =====

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = this.getOptimalParticleCount();
        this.container = document.querySelector('.particles');
        this.isAnimating = true;

        this.init();
    }

    init() {
        if (!this.container) return;

        this.createParticles();
        this.handleVisibilityChange();
        this.handleResize();

        console.log(`✨ Particle system initialized with ${this.maxParticles} particles`);
    }

    // Determine optimal particle count based on device performance
    getOptimalParticleCount() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const isMobile = width <= 768;
        const isLowRAM = navigator.deviceMemory && navigator.deviceMemory <= 4;
        const isSlowConnection = navigator.connection &&
            (navigator.connection.effectiveType === 'slow-2g' || navigator.connection.effectiveType === '2g');

        if (isMobile || isLowRAM || isSlowConnection) {
            return Math.floor(Math.min(width, height) / 40);
        }

        return Math.floor((width * height) / 30000);
    }

    // Create particle elements
    createParticles() {
        // Clear existing particles
        this.container.innerHTML = '';
        this.particles = [];

        for (let i = 0; i < this.maxParticles; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random position and animation properties
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';

        // Random size variation
        const size = Math.random() * 2 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        // Random opacity
        particle.style.opacity = Math.random() * 0.8 + 0.2;

        this.container.appendChild(particle);
        this.particles.push(particle);
    }

    // Handle page visibility changes for performance
    handleVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });
    }

    // Handle window resize
    handleResize() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.maxParticles = this.getOptimalParticleCount();
                this.createParticles();
            }, 250);
        });
    }

    pauseAnimations() {
        this.particles.forEach(particle => {
            particle.style.animationPlayState = 'paused';
        });
        this.isAnimating = false;
    }

    resumeAnimations() {
        this.particles.forEach(particle => {
            particle.style.animationPlayState = 'running';
        });
        this.isAnimating = true;
    }

    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.particles = [];
    }
}

class OrbEffects {
    constructor() {
        this.orbs = document.querySelectorAll('.orb');
        this.animationId = null;
        this.isAnimating = true;

        this.init();
    }

    init() {
        this.startDynamicEffects();
        this.handleVisibilityChange();

        console.log('🔮 Orb effects initialized');
    }

    startDynamicEffects() {
        const animate = () => {
            if (!this.isAnimating) return;

            this.orbs.forEach(orb => {
                const randomScale = 0.8 + Math.random() * 0.4;
                const randomOpacity = 0.4 + Math.random() * 0.4;
                const randomX = (Math.random() - 0.5) * 10;
                const randomY = (Math.random() - 0.5) * 10;

                orb.style.transform = `scale(${randomScale}) translate(${randomX}px, ${randomY}px)`;
                orb.style.opacity = randomOpacity;
            });

            // Update every 5-8 seconds
            setTimeout(() => {
                this.animationId = requestAnimationFrame(animate);
            }, 5000 + Math.random() * 3000);
        };

        animate();
    }

    handleVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            this.isAnimating = !document.hidden;

            if (this.isAnimating) {
                this.startDynamicEffects();
            }
        });
    }

    pauseEffects() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }

    resumeEffects() {
        this.isAnimating = true;
        this.startDynamicEffects();
    }
}

class TypingEffect {
    constructor(element, text, speed = 50) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.currentIndex = 0;
    }

    start() {
        this.element.textContent = '';
        this.element.style.borderRight = '2px solid #3b82f6';

        const type = () => {
            if (this.currentIndex < this.text.length) {
                this.element.textContent += this.text[this.currentIndex];
                this.currentIndex++;
                setTimeout(type, this.speed);
            } else {
                // Blinking cursor effect
                setInterval(() => {
                    this.element.style.borderColor =
                        this.element.style.borderColor === 'transparent' ? '#3b82f6' : 'transparent';
                }, 500);
            }
        };

        type();
    }
}

class CounterAnimation {
    constructor(element, targetValue, duration = 2000) {
        this.element = element;
        this.targetValue = this.parseValue(targetValue);
        this.duration = duration;
        this.suffix = this.extractSuffix(targetValue);
    }

    parseValue(value) {
        const numStr = value.toString().replace(/[^\d.-]/g, '');
        return parseFloat(numStr) || 0;
    }

    extractSuffix(value) {
        const match = value.toString().match(/[^\d.-]+$/);
        return match ? match[0] : '';
    }

    animate() {
        const startTime = performance.now();
        const startValue = 0;

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.duration, 1);

            // Easing function (easeOutCubic)
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            const currentValue = startValue + (this.targetValue - startValue) * easedProgress;

            // Format the number
            let displayValue;
            if (this.targetValue >= 1000000) {
                displayValue = (currentValue / 1000000).toFixed(1) + 'M';
            } else if (this.targetValue >= 1000) {
                displayValue = (currentValue / 1000).toFixed(1) + 'K';
            } else {
                displayValue = Math.round(currentValue);
            }

            this.element.textContent = displayValue + this.suffix.replace(/[MK]/, '');

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    }
}

class SlideTransitions {
    constructor(presentationController) {
        this.presentation = presentationController;
        this.transitionTypes = ['slideLeft', 'slideRight', 'fade', 'scale'];
    }

    // Apply transition effect to slide
    applyTransition(slideElement, type = 'fade') {
        slideElement.classList.add('transition-' + type);

        setTimeout(() => {
            slideElement.classList.remove('transition-' + type);
        }, 800);
    }

    // Entrance animations for slide elements
    animateSlideContent(slideElement) {
        const elements = slideElement.querySelectorAll('.metric-card, .feature-card, .testimonial');

        elements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';

            setTimeout(() => {
                el.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100 + 200);
        });
    }
}

class InteractiveEffects {
    constructor() {
        this.setupHoverEffects();
        this.setupClickEffects();
        this.setupFocusEffects();
    }

    setupHoverEffects() {
        // Enhanced hover effects for cards
        const cards = document.querySelectorAll('.metric-card, .feature-card, .pricing-card');

        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.addHoverGlow(card);
            });

            card.addEventListener('mouseleave', () => {
                this.removeHoverGlow(card);
            });
        });
    }

    setupClickEffects() {
        const buttons = document.querySelectorAll('.nav-btn, .cta-btn');

        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e, button);
            });
        });
    }

    setupFocusEffects() {
        const focusableElements = document.querySelectorAll('button, a, [tabindex]');

        focusableElements.forEach(el => {
            el.addEventListener('focus', () => {
                el.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.5)';
            });

            el.addEventListener('blur', () => {
                el.style.boxShadow = '';
            });
        });
    }

    addHoverGlow(element) {
        element.style.filter = 'drop-shadow(0 10px 20px rgba(59, 130, 246, 0.3))';
        element.style.transform = 'translateY(-5px) scale(1.02)';
    }

    removeHoverGlow(element) {
        element.style.filter = '';
        element.style.transform = '';
    }

    createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// Performance-aware effects manager
class EffectsManager {
    constructor() {
        this.particleSystem = null;
        this.orbEffects = null;
        this.interactiveEffects = null;
        this.slideTransitions = null;

        this.isLowPerformance = this.detectPerformance();
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.init();
    }

    detectPerformance() {
        const isMobile = window.innerWidth <= 768;
        const isLowRAM = navigator.deviceMemory && navigator.deviceMemory <= 4;
        const isSlowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

        return isMobile || isLowRAM || isSlowCPU;
    }

    init() {
        if (this.reducedMotion) {
            console.log('♿ Reduced motion detected, minimal effects enabled');
            this.initMinimalEffects();
        } else if (this.isLowPerformance) {
            console.log('📱 Low performance device detected, optimized effects enabled');
            this.initOptimizedEffects();
        } else {
            console.log('🚀 Full effects enabled');
            this.initFullEffects();
        }
    }

    initMinimalEffects() {
        // Only essential interactive effects
        this.interactiveEffects = new InteractiveEffects();
    }

    initOptimizedEffects() {
        // Reduced particle count, simplified animations
        this.particleSystem = new ParticleSystem();
        this.interactiveEffects = new InteractiveEffects();

        // Reduce animation frequency
        if (this.particleSystem) {
            this.particleSystem.maxParticles = Math.floor(this.particleSystem.maxParticles / 2);
        }
    }

    initFullEffects() {
        // All effects enabled
        this.particleSystem = new ParticleSystem();
        this.orbEffects = new OrbEffects();
        this.interactiveEffects = new InteractiveEffects();

        if (window.presentationController) {
            this.slideTransitions = new SlideTransitions(window.presentationController);
        }
    }

    // Animate numbers when they come into view
    animateNumbers() {
        const numberElements = document.querySelectorAll('.metric-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    const counter = new CounterAnimation(entry.target, entry.target.textContent);
                    counter.animate();
                    entry.target.dataset.animated = 'true';
                }
            });
        });

        numberElements.forEach(el => observer.observe(el));
    }

    // Cleanup all effects
    destroy() {
        if (this.particleSystem) {
            this.particleSystem.destroy();
        }

        if (this.orbEffects) {
            this.orbEffects.pauseEffects();
        }
    }
}

// Initialize effects system
let effectsManager;

function initializeEffects() {
    try {
        effectsManager = new EffectsManager();

        // Animate numbers when page loads
        setTimeout(() => {
            if (effectsManager) {
                effectsManager.animateNumbers();
            }
        }, 1000);

        console.log('✨ Effects system initialized successfully');
    } catch (error) {
        console.warn('Effects initialization error:', error);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEffects);
} else {
    initializeEffects();
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ParticleSystem,
        OrbEffects,
        TypingEffect,
        CounterAnimation,
        SlideTransitions,
        InteractiveEffects,
        EffectsManager
    };
}