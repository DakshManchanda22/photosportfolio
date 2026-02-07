// ============================================
// CRITICAL.JS - Essential functionality only
// Loads immediately, no animations
// ============================================

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
            document.getElementById('photos').classList.add('active');
            navLinks.forEach(l => l.classList.remove('active'));
            document.querySelector('[data-section="photos"]').classList.add('active');
            const latestVidsSection = document.querySelector('.latest-vids-section');
            if (latestVidsSection) {
                latestVidsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                galleryGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
let currentGalleryItems = []; // Array of image elements

// Load full-quality signed URL for lightbox
// Frontend only consumes URLs from backend - no Cloudinary logic here
async function loadLightboxImage(img) {
    if (!img.dataset.path) {
        // Fallback to current src if no path
        lightboxImg.src = img.src;
        return;
    }

    try {
        // Fetch signed URL from backend (backend handles all Cloudinary logic)
        const res = await fetch(
            `/api/cloudinary-url?path=${encodeURIComponent(img.dataset.path)}`
        );
        
        if (!res.ok) {
            throw new Error(`Failed to fetch lightbox image: ${res.status}`);
        }

        const data = await res.json();
        if (data.url) {
            // Use URL directly from backend - no modification
            lightboxImg.src = data.url;
        } else {
            // Fallback to current src
            lightboxImg.src = img.src;
        }
    } catch (error) {
        console.error('Error loading lightbox image:', error);
        // Fallback to current src
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
            // Collect all images with their paths for navigation
            const allImages = Array.from(activeSection.querySelectorAll('.gallery-item img'));
            currentGalleryItems = allImages; // Store image elements, not URLs
            currentImageIndex = allImages.indexOf(img);
            
            // Show lightbox immediately
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Load full-quality image (backend handles quality settings)
            await loadLightboxImage(img);
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
prevBtn.addEventListener('click', async () => {
    currentImageIndex = (currentImageIndex - 1 + currentGalleryItems.length) % currentGalleryItems.length;
    await loadLightboxImage(currentGalleryItems[currentImageIndex]);
});

// Next image
nextBtn.addEventListener('click', async () => {
    currentImageIndex = (currentImageIndex + 1) % currentGalleryItems.length;
    await loadLightboxImage(currentGalleryItems[currentImageIndex]);
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

// Smooth scroll behavior
document.documentElement.style.scrollBehavior = 'smooth';

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
            galleryGrid.scrollIntoView({ behavior: 'smooth' });
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
            contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
// Fetches signed URLs from server for private images
// ============================================
const images = document.querySelectorAll("img.lazy");

// Load private image by fetching signed URL from server
async function loadPrivateImage(img) {
    if (!img.dataset.path || img.dataset.loading) {
        return; // No path or already loading
    }

    img.dataset.loading = 'true'; // Prevent duplicate requests

    try {
        // Fetch signed URL from backend (backend handles all Cloudinary logic and transformations)
        const apiUrl = `/api/cloudinary-url?path=${encodeURIComponent(img.dataset.path)}`;
        console.log('Fetching signed URL for:', img.dataset.path);
        
        const res = await fetch(apiUrl);
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error('API error response:', res.status, errorText);
            throw new Error(`Failed to fetch signed URL: ${res.status} - ${errorText}`);
        }

        const data = await res.json();
        console.log('Received URL for:', img.dataset.path, data.url ? '✓' : '✗');
        
        if (data.url) {
            img.src = data.url;
            
            // Set timeout to prevent infinite loading
            const timeout = setTimeout(() => {
                if (img.dataset.loading) {
                    console.error('Image load timeout:', img.dataset.path);
                    delete img.dataset.loading;
                    img.classList.remove("skeleton");
                    // Keep skeleton visible but stop loading state
                }
            }, 30000); // 30 second timeout
            
            img.onload = () => {
                clearTimeout(timeout);
                console.log('Image loaded successfully:', img.dataset.path);
                img.classList.remove("skeleton");
                delete img.dataset.loading;
                scheduleLayout(); // Schedule masonry layout update
            };
            img.onerror = () => {
                clearTimeout(timeout);
                delete img.dataset.loading;
                console.error('Failed to load image from URL:', data.url, 'Path:', img.dataset.path);
                // Keep skeleton visible on error
            };
        } else {
            console.error('No URL in response:', data);
            throw new Error('No URL in response');
        }
    } catch (error) {
        console.error('Error loading private image:', img.dataset.path, error);
        delete img.dataset.loading;
    }
}

const imageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.path) {
                loadPrivateImage(img);
                imageObserver.unobserve(img);
            }
        }
    });
}, { rootMargin: "200px" });

images.forEach(img => imageObserver.observe(img));

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
            const response = await fetch('/api/youtube');
            if (!response.ok) {
                throw new Error('Failed to fetch videos from API');
            }
            const data = await response.json();
            videosToShow = data.items;
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
        
        videosToShow.forEach((video, index) => {
            const videoId = video.id;
            const videoItem = document.createElement('div');
            videoItem.className = 'video-item';
            videoItem.style.animationDelay = `${(index + 1) * 0.2}s`;
            
            videoItem.innerHTML = `
                <div class="video-wrapper">
                    <iframe 
                        src="https://www.youtube.com/embed/${videoId}" 
                        title="${video.snippet.title}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowfullscreen>
                    </iframe>
                </div>
            `;
            
            videoGrid.appendChild(videoItem);
        });
    } catch (error) {
        console.error('Error loading YouTube videos:', error);
        videoGrid.innerHTML = `
            <div class="video-error">
                <p>Unable to load videos. <a href="https://www.youtube.com/@DakshManchanda" target="_blank">Visit YouTube channel →</a></p>
            </div>
        `;
    }
}

// Load hero background image with signed URL
async function loadHeroBackground() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection || !heroSection.dataset.heroBg) {
        return;
    }

    try {
        const path = heroSection.dataset.heroBg;
        // Fetch signed URL from backend (backend handles all Cloudinary logic)
        const res = await fetch(
            `/api/cloudinary-url?path=${encodeURIComponent(path)}`
        );
        
        if (!res.ok) {
            throw new Error(`Failed to fetch hero background: ${res.status}`);
        }

        const data = await res.json();
        if (data.url) {
            // Apply background image to ::before pseudo-element via injected style
            const styleId = 'hero-bg-style';
            let style = document.getElementById(styleId);
            if (!style) {
                style = document.createElement('style');
                style.id = styleId;
                document.head.appendChild(style);
            }
            style.textContent = `
                .hero-section::before {
                    background-image: url(${data.url});
                }
            `;
        }
    } catch (error) {
        console.error('Error loading hero background:', error);
    }
}

// Load videos when page loads
window.addEventListener('load', () => {
    loadYouTubeVideos();
    loadHeroBackground(); // Load hero background immediately
});

