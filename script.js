// Navigation functionality
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.gallery-section, .content-section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Special handling for Latest Vids link - scroll to YouTube section
        if (link.id === 'latest-vids-nav') {
            // Make sure Photos section is active
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById('photos').classList.add('active');
            
            // Remove active from other nav links
            navLinks.forEach(l => l.classList.remove('active'));
            document.querySelector('[data-section="photos"]').classList.add('active');
            
            // Scroll to Latest Vids section
            const latestVidsSection = document.querySelector('.latest-vids-section');
            if (latestVidsSection) {
                latestVidsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            return;
        }
        
        // Special handling for Photos/My Best Work link - scroll to gallery
        const sectionId = link.getAttribute('data-section');
        if (sectionId === 'photos') {
            // Make sure Photos section is active
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById('photos').classList.add('active');
            
            // Remove active from other nav links and activate this one
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Scroll to gallery grid
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
            
            // Scroll to top when switching sections
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Retrigger animations for gallery items
            const galleryItems = targetSection.querySelectorAll('.gallery-item');
            galleryItems.forEach(item => {
                item.style.animation = 'none';
                setTimeout(() => {
                    item.style.animation = '';
                }, 10);
            });
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
let currentGalleryItems = [];

// Open lightbox when clicking on gallery items
document.addEventListener('click', (e) => {
    if (e.target.closest('.gallery-item')) {
        const galleryItem = e.target.closest('.gallery-item');
        const img = galleryItem.querySelector('img');
        const activeSection = document.querySelector('.gallery-section.active');
        
        if (activeSection) {
            currentGalleryItems = Array.from(activeSection.querySelectorAll('.gallery-item img'));
            currentImageIndex = currentGalleryItems.indexOf(img);
            
            lightboxImg.src = img.src;
            lightbox.style.display = 'block';
            document.body.style.overflow = 'hidden';
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
    lightboxImg.src = currentGalleryItems[currentImageIndex].src;
});

// Next image
nextBtn.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % currentGalleryItems.length;
    lightboxImg.src = currentGalleryItems[currentImageIndex].src;
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
        
        // Also ensure Photos section is active
        sections.forEach(s => s.classList.remove('active'));
        document.getElementById('photos').classList.add('active');
        
        // Update nav links
        navLinks.forEach(l => l.classList.remove('active'));
        document.querySelector('[data-section="photos"]').classList.add('active');
    });
}

// YouTube API - Fetch Latest Videos (excluding Shorts)
async function loadYouTubeVideos() {
    const videoGrid = document.getElementById('youtube-videos');
    
    if (!videoGrid) {
        console.error('Video grid element not found');
        return;
    }
    
    try {
        // Use serverless function if in production, otherwise use direct API
        const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
        let videosToShow;
        
        console.log('Loading YouTube videos... (Production:', isProduction, ')');
        
        if (isProduction) {
            // Call Vercel serverless function
            const response = await fetch('/api/youtube');
            
            if (!response.ok) {
                throw new Error('Failed to fetch videos from API');
            }
            
            const data = await response.json();
            videosToShow = data.items;
        } else {
            // Development: Use direct API with config
            if (typeof CONFIG === 'undefined') {
                throw new Error('CONFIG is not defined. Make sure config.js is loaded.');
            }
            
            const YOUTUBE_API_KEY = CONFIG.YOUTUBE_API_KEY;
            const CHANNEL_ID = CONFIG.CHANNEL_ID;
            
            console.log('Using API key:', YOUTUBE_API_KEY ? 'Found' : 'Missing');
            console.log('Channel ID:', CHANNEL_ID);
            
            // Fetch more videos initially to filter out Shorts
            const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10&type=video&videoDuration=medium`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch videos');
            }
            
            const data = await response.json();
            
            // Get video IDs to fetch duration details
            const videoIds = data.items.map(item => item.id.videoId).join(',');
            
            // Fetch video details including duration
            const detailsResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=contentDetails,snippet`
            );
            
            const detailsData = await detailsResponse.json();
            
            // Filter out Shorts (videos under 60 seconds)
            const regularVideos = detailsData.items.filter(video => {
                const duration = video.contentDetails.duration;
                // Parse ISO 8601 duration format (PT#M#S or PT#H#M#S)
                const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
                const hours = parseInt(match[1] || 0);
                const minutes = parseInt(match[2] || 0);
                const seconds = parseInt(match[3] || 0);
                const totalSeconds = hours * 3600 + minutes * 60 + seconds;
                
                // Exclude videos under 60 seconds (Shorts)
                return totalSeconds >= 60;
            });
            
            // Show only the first 2 regular videos
            videosToShow = regularVideos.slice(0, 2);
        }
        
        console.log('Videos loaded successfully:', videosToShow.length, 'videos');
        
        // Clear loading message
        videoGrid.innerHTML = '';
        
        if (videosToShow.length === 0) {
            videoGrid.innerHTML = `
                <div class="video-error">
                    <p>No videos found. <a href="https://www.youtube.com/@DakshManchanda" target="_blank">Visit YouTube channel →</a></p>
                </div>
            `;
            return;
        }
        
        // Create video items
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
        console.error('Error details:', error.message);
        videoGrid.innerHTML = `
            <div class="video-error">
                <p>Unable to load videos. <a href="https://www.youtube.com/@DakshManchanda" target="_blank">Visit YouTube channel →</a></p>
                <p style="font-size: 12px; color: #999; margin-top: 10px;">Error: ${error.message}</p>
            </div>
        `;
    }
}

// Load videos when page loads
window.addEventListener('load', () => {
    loadYouTubeVideos();
});

// Intersection Observer for gallery animations - Pinterest style
const observerOptions = {
    root: null,
    rootMargin: '50px', // Start loading slightly before item enters viewport
    threshold: 0.1 // Trigger when 10% of the item is visible
};

const galleryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add animate class to trigger animation for this specific item
            entry.target.classList.add('animate');
            // Unobserve after animation is triggered
            galleryObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe each individual gallery item
window.addEventListener('load', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        galleryObserver.observe(item);
    });
});

// Contact Form Handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const formStatus = document.getElementById('form-status');
        const formData = new FormData(contactForm);
        
        // Get Formspree endpoint - use CONFIG if available (local), otherwise use production endpoint
        const FORMSPREE_ENDPOINT = (typeof CONFIG !== 'undefined' && CONFIG.FORMSPREE_ENDPOINT) 
            ? CONFIG.FORMSPREE_ENDPOINT 
            : 'https://formspree.io/f/xeoryawz';
        
        // Disable button and show loading
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        formStatus.style.display = 'none';
        
        console.log('Submitting form to:', FORMSPREE_ENDPOINT);
        console.log('Form data:', Object.fromEntries(formData));
        
        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            console.log('Response status:', response.status);
            const responseData = await response.json();
            console.log('Response data:', responseData);
            
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

// Add loading animation
window.addEventListener('load', () => {
    // Ensure page starts at top
    window.scrollTo(0, 0);
    
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);
});

