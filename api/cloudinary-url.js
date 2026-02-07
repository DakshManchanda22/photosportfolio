// Vercel Serverless Function to generate signed Cloudinary URLs
// This keeps API secret secure on the server - NEVER exposed to frontend
// Uses official Cloudinary SDK for authenticated image delivery

// ✅ CORRECT: Import v2 directly and force Node.js runtime
import { v2 as cloudinary } from 'cloudinary';

// ✅ CRITICAL: Force Node.js runtime (Cloudinary requires Node.js crypto, not Edge)
export const runtime = 'nodejs';

// ✅ Configure Cloudinary at module level (server-side only)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dakshscloud',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get image public_id (path) from query
    const { path } = req.query;

    if (!path) {
        return res.status(400).json({ error: 'Missing image path' });
    }

    try {
        // Generate signed URL using official Cloudinary SDK
        // Transformations are included BEFORE signing (critical for authenticated URLs)
        const signedUrl = cloudinary.url(path, {
            resource_type: 'image',
            type: 'authenticated',
            secure: true,
            sign_url: true,
            transformation: [
                { fetch_format: 'auto', quality: 'auto' }
            ]
        });

        // Return fully signed URL (CDN-backed, cacheable)
        // Frontend should use this URL directly without modification
        return res.status(200).json({ url: signedUrl });
    } catch (error) {
        console.error('Cloudinary error:', error);
        return res.status(500).json({ 
            error: 'Failed to generate signed URL',
            message: error.message 
        });
    }
}

