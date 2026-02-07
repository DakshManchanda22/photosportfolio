// ============================================
// ANIMATIONS.JS - Delayed animations
// Loads after images, does not block rendering
// ============================================

// Initialize animations only after page load
function initAnimations() {
    // Intersection Observer for gallery animations - Pinterest style
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };

    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                galleryObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe each individual gallery item
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        galleryObserver.observe(item);
    });

    // Retrigger animations when switching sections
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.gallery-section, .content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const sectionId = link.getAttribute('data-section');
            if (sectionId) {
                const targetSection = document.getElementById(sectionId);
                if (targetSection) {
                    const galleryItems = targetSection.querySelectorAll('.gallery-item');
                    galleryItems.forEach(item => {
                        item.style.animation = 'none';
                        setTimeout(() => {
                            item.style.animation = '';
                        }, 10);
                    });
                }
            }
        });
    });
}

// Wait for window load, then use requestIdleCallback for animations
window.addEventListener('load', () => {
    // Ensure page starts at top
    window.scrollTo(0, 0);
    
    // Fade in body
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);

    // Delay animations until browser is idle
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            initAnimations();
        }, { timeout: 2000 });
    } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
            initAnimations();
        }, 1000);
    }
});

// Export for dynamic import if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initAnimations };
}

