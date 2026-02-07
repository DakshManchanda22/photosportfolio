// Vercel Serverless Function to generate signed Cloudinary URLs
// This keeps API secret secure on the server - NEVER exposed to frontend

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
        console.error('Missing Cloudinary credentials:', {
            hasCloudName: !!CLOUD_NAME,
            hasApiKey: !!API_KEY,
            hasApiSecret: !!API_SECRET
        });
        return res.status(500).json({ error: 'Cloudinary credentials not configured' });
    }

    // Get image path and transformation options from query
    const { path, options = 'f_auto,q_auto,dpr_auto' } = req.query;

    if (!path) {
        return res.status(400).json({ error: 'Image path is required' });
    }

    try {
        // Dynamically import Cloudinary SDK (ES module)
        const cloudinaryModule = await import('cloudinary');
        const cloudinary = cloudinaryModule.default?.v2 || cloudinaryModule.v2;

        // Configure Cloudinary with credentials
        cloudinary.config({
            cloud_name: CLOUD_NAME,
            api_key: API_KEY,
            api_secret: API_SECRET
        });

        // Parse transformation options into Cloudinary format
        const transformations = options.split(',').map(opt => {
            const trimmed = opt.trim();
            // Convert shorthand to Cloudinary transformation objects
            if (trimmed === 'f_auto') {
                return { fetch_format: 'auto' };
            } else if (trimmed === 'q_auto') {
                return { quality: 'auto' };
            } else if (trimmed === 'dpr_auto') {
                return { dpr: 'auto' };
            } else if (trimmed.startsWith('q_auto:')) {
                // Handle q_auto:best format
                const quality = trimmed.split(':')[1];
                return { quality: quality || 'auto' };
            } else {
                // Return as-is for other transformations
                return trimmed;
            }
        });

        // Generate signed URL for authenticated/restricted image
        const url = cloudinary.url(path, {
            type: 'authenticated',
            sign_url: true,
            secure: true,
            transformation: transformations
        });

        // Return signed URL (CDN-backed, cacheable)
        res.status(200).json({ url });
    } catch (error) {
        console.error('Error generating Cloudinary signed URL:', error);
        console.error('Error stack:', error.stack);
        return res.status(500).json({ 
            error: 'Failed to generate signed URL',
            message: error.message 
        });
    }
}

