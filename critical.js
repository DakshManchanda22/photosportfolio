// ============================================
// CRITICAL.JS - Essential functionality only
// Loads immediately, no animations
// ============================================

// Initialize Lenis Smooth Scroll
let lenis;
if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    // RAF loop for Lenis
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Update scroll on Lenis scroll event
    lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
        // Optional: can add scroll-based animations here
    });
}

// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
const sunIcon = document.querySelector('.sun-icon');
const moonIcon = document.querySelector('.moon-icon');

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);

// Update icon based on current theme
if (currentTheme === 'dark') {
    sunIcon.classList.remove('active');
    moonIcon.classList.add('active');
}

// Toggle theme
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Update theme
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Toggle icons with animation
    if (newTheme === 'dark') {
        sunIcon.classList.remove('active');
        moonIcon.classList.add('active');
    } else {
        moonIcon.classList.remove('active');
        sunIcon.classList.add('active');
    }
});

// Navigation functionality
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.gallery-section, .content-section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Special handling for Latest Vids link - scroll to YouTube section
        if (link.id === 'latest-vids-nav') {
            sections.forEach(s => s.classList.remove('active'));
            // Use Lenis for smooth scroll if available
            if (lenis) {
                const latestVidsSection = document.querySelector('.latest-vids-section');
                if (latestVidsSection) {
                    lenis.scrollTo(latestVidsSection, { offset: -100, duration: 1.5 });
                }
            }
            document.getElementById('photos').classList.add('active');
            navLinks.forEach(l => l.classList.remove('active'));
            document.querySelector('[data-section="photos"]').classList.add('active');
            const latestVidsSection = document.querySelector('.latest-vids-section');
            if (latestVidsSection) {
                if (lenis) {
                    lenis.scrollTo(latestVidsSection, { offset: -100, duration: 1.5 });
                } else {
                    latestVidsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
            return;
        }
        
        // Special handling for Photos/My Best Work link - scroll to gallery
        const sectionId = link.getAttribute('data-section');
        if (sectionId === 'photos') {
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById('photos').classList.add('active');
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const galleryGrid = document.querySelector('.gallery-grid');
            if (galleryGrid) {
                if (lenis) {
                    lenis.scrollTo(galleryGrid, { offset: -100, duration: 1.5 });
                } else {
                    galleryGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
            return;
        }
        
        // Remove active class from all links and sections
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Show corresponding section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            if (lenis) {
                lenis.scrollTo(0, { duration: 1.5 });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    });
});

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let currentImageIndex = 0;
let currentGalleryItems = []; // Array of image URLs

// Load image for lightbox (uses Cloudinary with larger size)
function loadLightboxImage(img) {
    if (img.dataset.publicId && window.cloudinaryImgLarge) {
        // Use larger image for lightbox
        lightboxImg.src = window.cloudinaryImgLarge(img.dataset.publicId);
    } else if (img.src) {
        // Fallback: if src is already set, use it (shouldn't happen with new setup)
        lightboxImg.src = img.src;
    }
}

// Open lightbox when clicking on gallery items
document.addEventListener('click', async (e) => {
    if (e.target.closest('.gallery-item')) {
        const galleryItem = e.target.closest('.gallery-item');
        const img = galleryItem.querySelector('img');
        const activeSection = document.querySelector('.gallery-section.active');
        
        if (activeSection) {
            // Collect all images for navigation
            const allImages = Array.from(activeSection.querySelectorAll('.gallery-item img'));
            // Store Cloudinary paths for larger images in lightbox
            currentGalleryItems = allImages.map(imgEl => {
                if (imgEl.dataset.publicId && window.cloudinaryImgLarge) {
                    return window.cloudinaryImgLarge(imgEl.dataset.publicId);
                }
                return imgEl.src || '';
            });
            currentImageIndex = allImages.indexOf(img);
            
            // Show lightbox immediately
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Load image
            loadLightboxImage(img);
        }
    }
});

// Close lightbox
closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
});

// Close lightbox when clicking outside image
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Previous image
prevBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
    lightboxImg.src = currentGalleryItems[currentImageIndex];
});

// Next image
nextBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % currentGalleryItems.length;
    lightboxImg.src = currentGalleryItems[currentImageIndex];
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'block') {
        if (e.key === 'Escape') {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        } else if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    }
});

// Smooth scroll behavior (only if Lenis is not available)
if (typeof Lenis === 'undefined') {
    document.documentElement.style.scrollBehavior = 'smooth';
}

// Disable right-click on images to prevent download
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
});

// Prevent image dragging
document.addEventListener('dragstart', (e) => {
    if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
    }
});

// Scroll arrow functionality
const scrollArrow = document.querySelector('.scroll-arrow');
if (scrollArrow) {
    scrollArrow.addEventListener('click', () => {
        const galleryGrid = document.querySelector('.gallery-grid');
        if (galleryGrid) {
            if (lenis) {
                lenis.scrollTo(galleryGrid, { offset: -100, duration: 1.5 });
            } else {
                galleryGrid.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

// Contact nav functionality
const contactNav = document.getElementById('contact-nav');
if (contactNav) {
    contactNav.addEventListener('click', (e) => {
        e.preventDefault();
        const contactSection = document.querySelector('.contact-section');
        if (contactSection) {
            if (lenis) {
                lenis.scrollTo(contactSection, { offset: -100, duration: 1.5 });
            } else {
                contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
}

// Logo click functionality - scroll to top
const logo = document.querySelector('.logo');
if (logo) {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        sections.forEach(s => s.classList.remove('active'));
        document.getElementById('photos').classList.add('active');
        navLinks.forEach(l => l.classList.remove('active'));
        document.querySelector('[data-section="photos"]').classList.add('active');
    });
}

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const formStatus = document.getElementById('form-status');
        const formData = new FormData(contactForm);
        
        const FORMSPREE_ENDPOINT = (typeof CONFIG !== 'undefined' && CONFIG.FORMSPREE_ENDPOINT) 
            ? CONFIG.FORMSPREE_ENDPOINT 
            : 'https://formspree.io/f/xeoryawz';
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        formStatus.style.display = 'none';
        
        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const responseData = await response.json();
            
            if (response.ok) {
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Message sent successfully! I\'ll get back to you soon.';
                formStatus.style.display = 'block';
                contactForm.reset();
            } else {
                throw new Error(responseData.error || 'Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            formStatus.className = 'form-status error';
            formStatus.textContent = 'Oops! Something went wrong. Please try again or email directly.';
            formStatus.style.display = 'block';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        }
    });
}

// Scroll to top on page load/refresh
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

// ============================================
// LAZY LOADING WITH INTERSECTION OBSERVER
// Images load from local assets folder
// Hero image loads first, then gallery images
// ============================================

// Priority 1: Load hero background image immediately
function loadHeroImage() {
    const heroSection = document.querySelector('.hero-section');
    if (heroSection && window.cloudinaryImg) {
        // Generate Cloudinary URL for hero background
        const heroPublicId = 'IMG_8677.jpg';
        const heroUrl = window.cloudinaryImg(heroPublicId, 1920);
        
        // Inject background image via style
        const styleId = 'hero-bg-style';
        let style = document.getElementById(styleId);
        if (!style) {
            style = document.createElement('style');
            style.id = styleId;
            document.head.appendChild(style);
        }
        style.textContent = `
            .hero-section::before {
                background-image: url(${heroUrl});
            }
        `;
        
        // Preload hero image
        const heroBg = new Image();
        heroBg.src = heroUrl;
        heroBg.onload = () => {
            console.log('Hero image loaded from Cloudinary');
        };
    }
}

// Load hero image first
loadHeroImage();

// Priority 2: Load gallery images with lazy loading
const images = document.querySelectorAll("img.lazy");

const imageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            
            // Generate Cloudinary URL from public ID if available
            if (img.dataset.publicId && window.cloudinaryImg && !img.src) {
                img.src = window.cloudinaryImg(img.dataset.publicId);
            }
            
            // Check if image is already loaded (cached)
            if (img.complete && img.naturalHeight !== 0) {
                // Image already loaded from cache - remove skeleton immediately
                img.classList.remove("skeleton");
                imageObserver.unobserve(img);
                return;
            }
            
            // Image not loaded yet - set up load handlers
            const handleLoad = () => {
                img.classList.remove("skeleton");
                scheduleLayout(); // Schedule masonry layout update
            };
            
            const handleError = () => {
                img.classList.remove("skeleton");
            };
            
            // Check if already has load handler to avoid duplicates
            if (!img.dataset.loadHandlerSet) {
                img.onload = handleLoad;
                img.onerror = handleError;
                img.dataset.loadHandlerSet = 'true';
            }
            
            imageObserver.unobserve(img);
        }
    });
}, { rootMargin: "200px" });

// Delay gallery image observation slightly to prioritize hero
setTimeout(() => {
    images.forEach(img => {
        // Check if image is already loaded (cached) - don't observe if already loaded
        if (img.complete && img.naturalHeight !== 0) {
            img.classList.remove("skeleton");
        } else {
            // Only observe images that haven't loaded yet
            imageObserver.observe(img);
        }
    });
}, 100); // Small delay to let hero load first

// ============================================
// MASONRY LAYOUT BATCHING
// ============================================
let layoutScheduled = false;

function scheduleLayout() {
    if (!layoutScheduled) {
        layoutScheduled = true;
        requestAnimationFrame(() => {
            // Masonry layout is handled by CSS columns, but we can trigger reflow if needed
            const galleryGrid = document.querySelector('.gallery-grid');
            if (galleryGrid) {
                // Force reflow to ensure proper layout
                galleryGrid.style.display = 'none';
                galleryGrid.offsetHeight; // Trigger reflow
                galleryGrid.style.display = '';
            }
            layoutScheduled = false;
        });
    }
}

// ============================================
// YOUTUBE VIDEOS LOADING
// ============================================
async function loadYouTubeVideos() {
    const videoGrid = document.getElementById('youtube-videos');
    
    if (!videoGrid) {
        return;
    }
    
    try {
        const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        let videosToShow;
        
        if (isProduction) {
            console.log('Fetching YouTube videos from API...');
            const response = await fetch('/api/youtube');
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('YouTube API Error:', response.status, errorData);
                throw new Error(`Failed to fetch videos from API: ${response.status} - ${errorData.message || errorData.error || 'Unknown error'}`);
            }
            
            const data = await response.json();
            console.log('YouTube API Response:', data);
            
            // API returns { items: [...] } structure
            videosToShow = data.items || [];
            
            if (videosToShow.length === 0) {
                console.warn('No videos returned from API');
            }
        } else {
            if (typeof CONFIG === 'undefined') {
                throw new Error('CONFIG is not defined. Make sure config.js is loaded.');
            }
            
            const YOUTUBE_API_KEY = CONFIG.YOUTUBE_API_KEY;
            const CHANNEL_ID = CONFIG.CHANNEL_ID;
            
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10&type=video&videoDuration=medium`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch videos');
            }
            
            const data = await response.json();
            const videoIds = data.items.map(item => item.id.videoId).join(',');
            
            const detailsResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=contentDetails,snippet`
            );
            
            const detailsData = await detailsResponse.json();
            
            const regularVideos = detailsData.items.filter(video => {
                const duration = video.contentDetails.duration;
                const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
                const hours = parseInt(match[1] || 0);
                const minutes = parseInt(match[2] || 0);
                const seconds = parseInt(match[3] || 0);
                const totalSeconds = hours * 3600 + minutes * 60 + seconds;
                return totalSeconds >= 60;
            });
            
            videosToShow = regularVideos.slice(0, 2);
        }
        
        videoGrid.innerHTML = '';
        
        if (videosToShow.length === 0) {
            videoGrid.innerHTML = `
                <div class="video-error">
                    <p>No videos found. <a href="https://www.youtube.com/@DakshManchanda" target="_blank">Visit YouTube channel →</a></p>
                </div>
            `;
            return;
        }
        
        console.log('Processing videos:', videosToShow.length);
        
        videosToShow.forEach((video, index) => {
            // Handle both API response formats: { id: { videoId: "..." } } or { id: "..." }
            const videoId = video.id?.videoId || video.id;
            const videoTitle = video.snippet?.title || 'Video';
            
            console.log(`Processing video ${index + 1}:`, { videoId, title: videoTitle });
            
            if (!videoId) {
                console.warn('Skipping video with no ID:', video);
                return;
            }
            
            const videoItem = document.createElement('div');
            videoItem.className = 'video-item';
            videoItem.style.animationDelay = `${(index + 1) * 0.2}s`;
            
            videoItem.innerHTML = `
                <div class="video-wrapper">
                    <iframe 
                        src="https://www.youtube.com/embed/${videoId}" 
                        title="${videoTitle}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowfullscreen>
                    </iframe>
                </div>
            `;
            
            videoGrid.appendChild(videoItem);
            console.log(`Video ${index + 1} added to grid`);
        });
    } catch (error) {
        console.error('Error loading YouTube videos:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        videoGrid.innerHTML = `
            <div class="video-error">
                <p>Unable to load videos: ${error.message}</p>
                <p><a href="https://www.youtube.com/@DakshManchanda" target="_blank">Visit YouTube channel →</a></p>
            </div>
        `;
    }
}

// Load videos when page loads
window.addEventListener('load', () => {
    loadYouTubeVideos();
});

