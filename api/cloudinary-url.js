// Vercel Serverless Function to generate signed Cloudinary URLs
// This keeps API secret secure on the server - NEVER exposed to frontend
// Uses official Cloudinary SDK for authenticated image delivery

export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get Cloudinary credentials from environment variables (server-only)
    const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dakshscloud';
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

    // Get image public_id (path) from query
    const { path } = req.query;

    if (!path) {
        return res.status(400).json({ error: 'Image path (public_id) is required' });
    }

    try {
        // Dynamically import Cloudinary SDK (works better in Vercel serverless)
        const cloudinaryModule = await import('cloudinary');
        const cloudinary = cloudinaryModule.default || cloudinaryModule;
        
        // Configure Cloudinary (server-side only)
        cloudinary.v2.config({
            cloud_name: CLOUD_NAME,
            api_key: API_KEY,
            api_secret: API_SECRET
        });

        // Generate signed URL using official Cloudinary SDK
        // Transformations are included BEFORE signing (critical for authenticated URLs)
        const signedUrl = cloudinary.v2.url(path, {
            resource_type: 'image',
            type: 'authenticated',
            secure: true,
            sign_url: true,
            transformation: [
                { fetch_format: 'auto' },
                { quality: 'auto' }
            ]
        });

        // Return fully signed URL (CDN-backed, cacheable)
        // Frontend should use this URL directly without modification
        res.status(200).json({ url: signedUrl });
    } catch (error) {
        console.error('Error generating Cloudinary signed URL:', error);
        console.error('Error stack:', error.stack);
        return res.status(500).json({ 
            error: 'Failed to generate signed URL',
            message: error.message 
        });
    }
}

