// Centralized Cloudinary image URL helper
// This is the ONLY way images should be constructed in this project
// Ensures all images use transformations and never serve originals

(function() {
    'use strict';
    
    const CLOUDINARY_BASE = "https://res.cloudinary.com/dakshscloud/image/upload";
    
    /**
     * Generate a Cloudinary image URL with transformations
     * @param {string} path - Image path in Cloudinary (e.g., "grid/DSC01915.jpg")
     * @param {number} width - Maximum width (default: 1400)
     * @returns {string} Transformed Cloudinary URL
     */
    window.cloudinaryImg = function(path, width = 1400) {
        // Ensure path doesn't start with / or assets/
        const cleanPath = path.replace(/^\/+/, '').replace(/^assets\//, '');
        
        // Always apply transformations: resize, auto quality, auto format
        // NEVER serve originals
        return `${CLOUDINARY_BASE}/w_${width},q_auto,f_auto/${cleanPath}`;
    };
    
    /**
     * Generate a larger image URL for lightbox/full view
     * @param {string} path - Image path in Cloudinary
     * @returns {string} Transformed Cloudinary URL with larger width
     */
    window.cloudinaryImgLarge = function(path) {
        return window.cloudinaryImg(path, 2000);
    };
    
    /**
     * Generate a smaller image URL for thumbnails
     * @param {string} path - Image path in Cloudinary
     * @returns {string} Transformed Cloudinary URL with smaller width
     */
    window.cloudinaryImgThumb = function(path) {
        return window.cloudinaryImg(path, 800);
    };
})();

