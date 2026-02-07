// Vercel Serverless Function to proxy YouTube API requests
// This keeps your API key secure on the server

// Ensure Node.js runtime (required for fetch API)
export const runtime = 'nodejs';

export default async function handler(req, res) {
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get API key from environment variable
    const API_KEY = process.env.YOUTUBE_API_KEY;
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCkRMsLYwmLiXjeUYSJ9GXFQ';

    if (!API_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    try {
        console.log('YouTube API: Starting fetch', { hasApiKey: !!API_KEY, channelId: CHANNEL_ID });
        
        // Fetch latest videos from YouTube API
        const searchResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10&type=video&videoDuration=medium`
        );

        if (!searchResponse.ok) {
            const errorData = await searchResponse.json().catch(() => ({}));
            console.error('YouTube Search API Error:', searchResponse.status, errorData);
            throw new Error(`YouTube API error: ${searchResponse.status} - ${JSON.stringify(errorData)}`);
        }

        const searchData = await searchResponse.json();
        console.log('YouTube API: Search results', { itemCount: searchData.items?.length || 0 });
        
        if (!searchData.items || searchData.items.length === 0) {
            console.warn('YouTube API: No videos found in search results');
            return res.status(200).json({ items: [] });
        }

        const videoIds = searchData.items.map(item => item.id.videoId).filter(Boolean).join(',');
        
        if (!videoIds) {
            console.warn('YouTube API: No valid video IDs found');
            return res.status(200).json({ items: [] });
        }

        // Fetch video details including duration
        const detailsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds}&part=contentDetails,snippet`
        );

        if (!detailsResponse.ok) {
            const errorData = await detailsResponse.json().catch(() => ({}));
            console.error('YouTube Details API Error:', detailsResponse.status, errorData);
            throw new Error(`YouTube Details API error: ${detailsResponse.status}`);
        }

        const detailsData = await detailsResponse.json();
        console.log('YouTube API: Details results', { itemCount: detailsData.items?.length || 0 });

        if (!detailsData.items || detailsData.items.length === 0) {
            console.warn('YouTube API: No video details found');
            return res.status(200).json({ items: [] });
        }

        // Filter out Shorts (videos under 60 seconds)
        const regularVideos = detailsData.items.filter(video => {
            if (!video.contentDetails || !video.contentDetails.duration) {
                return false;
            }
            const duration = video.contentDetails.duration;
            const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
            if (!match) return false;
            const hours = parseInt(match[1] || 0);
            const minutes = parseInt(match[2] || 0);
            const seconds = parseInt(match[3] || 0);
            const totalSeconds = hours * 3600 + minutes * 60 + seconds;
            return totalSeconds >= 60;
        });

        console.log('YouTube API: Filtered videos', { regularCount: regularVideos.length });

        // Return only the first 2 regular videos
        const videosToShow = regularVideos.slice(0, 2);
        
        console.log('YouTube API: Returning videos', { count: videosToShow.length });

        res.status(200).json({ items: videosToShow });
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        res.status(500).json({ 
            error: 'Failed to fetch videos',
            message: error.message 
        });
    }
}

