// Vercel Serverless Function to generate signed Cloudinary URLs
// This keeps API secret secure on the server - NEVER exposed to frontend

// Import cloudinary SDK at top level (server-side only)
import cloudinary from 'cloudinary';

export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get Cloudinary credentials from environment variables (server-only)
    const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
    const API_KEY = process.env.CLOUDINARY_API_KEY;
    const API_SECRET = process.env.CLOUDINARY_API_SECRET;

    if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
        return res.status(500).json({ error: 'Cloudinary credentials not configured' });
    }

    // Get image path and transformation options from query
    const { path, options = 'f_auto,q_auto,dpr_auto' } = req.query;

    if (!path) {
        return res.status(400).json({ error: 'Image path is required' });
    }

    try {
        // Configure Cloudinary
        cloudinary.v2.config({
            cloud_name: CLOUD_NAME,
            api_key: API_KEY,
            api_secret: API_SECRET
        });

        // Parse transformation options
        const transformations = options.split(',').map(opt => opt.trim());

        // Generate signed URL for authenticated/restricted image
        const url = cloudinary.v2.url(path, {
            type: 'authenticated',
            sign_url: true,
            secure: true,
            transformation: transformations
        });

        // Return signed URL (CDN-backed, cacheable)
        res.status(200).json({ url });
    } catch (error) {
        console.error('Error generating Cloudinary signed URL:', error);
        res.status(500).json({ error: 'Failed to generate signed URL' });
    }
}

