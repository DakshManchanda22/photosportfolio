// Vercel Serverless Function to generate signed Cloudinary URLs
// This keeps API secret secure on the server - NEVER exposed to frontend
// Uses manual URL signing (no SDK) for reliable serverless compatibility

import crypto from 'crypto';

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
        // Build transformation string from options
        // Format: f_auto,q_auto,dpr_auto/ becomes f_auto,q_auto,dpr_auto/
        const transformationStr = options ? `${options}/` : '';
        
        // Build the full resource path: transformations + image path
        const resourcePath = `${transformationStr}${path}`;
        
        // Generate timestamp (Unix timestamp in seconds)
        const timestamp = Math.round(Date.now() / 1000);
        
        // Build signature string for authenticated images
        // Format: {resource_path}{timestamp}{api_secret}
        const signatureString = `${resourcePath}${timestamp}${API_SECRET}`;
        
        // Generate SHA-1 signature
        const signature = crypto
            .createHash('sha1')
            .update(signatureString)
            .digest('hex');
        
        // Build the signed URL for authenticated images
        // Format: https://res.cloudinary.com/{cloud_name}/image/authenticated/{transformations}/{path}?timestamp={timestamp}&signature={signature}
        const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/authenticated/${resourcePath}?timestamp=${timestamp}&signature=${signature}`;

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

