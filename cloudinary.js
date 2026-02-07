// Cloudinary Image Helper
// Centralized function to generate transformed Cloudinary URLs
// Only stores public IDs, generates URLs at runtime

const CLOUDINARY_BASE = "https://res.cloudinary.com/dakshscloud/image/upload";

/**
 * Generate a Cloudinary image URL with transformations
 * @param {string} publicId - The Cloudinary public ID (filename)
 * @param {number} width - Image width (default: 1400)
 * @returns {string} Transformed Cloudinary URL
 */
function cloudinaryImg(publicId, width = 1400) {
    if (!publicId) {
        console.warn('cloudinaryImg: publicId is required');
        return '';
    }
    
    // Remove any leading slashes or version segments if accidentally included
    publicId = publicId.replace(/^\/+/, '').replace(/^v\d+\//, '');
    
    // Generate URL with transformations: width, quality auto, format auto
    return `${CLOUDINARY_BASE}/w_${width},q_auto,f_auto/${publicId}`;
}

/**
 * Generate a larger Cloudinary image URL for lightbox/high-res views
 * @param {string} publicId - The Cloudinary public ID (filename)
 * @returns {string} Transformed Cloudinary URL (larger size)
 */
function cloudinaryImgLarge(publicId) {
    return cloudinaryImg(publicId, 2000);
}

// Expose globally for use in HTML/JS
window.cloudinaryImg = cloudinaryImg;
window.cloudinaryImgLarge = cloudinaryImgLarge;

