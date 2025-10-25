// Vercel Serverless Function to proxy YouTube API requests
// This keeps your API key secure on the server

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
        // Fetch latest videos from YouTube API
        const searchResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10&type=video&videoDuration=medium`
        );

        if (!searchResponse.ok) {
            throw new Error('Failed to fetch videos from YouTube');
        }

        const searchData = await searchResponse.json();
        const videoIds = searchData.items.map(item => item.id.videoId).join(',');

        // Fetch video details including duration
        const detailsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds}&part=contentDetails,snippet`
        );

        if (!detailsResponse.ok) {
            throw new Error('Failed to fetch video details');
        }

        const detailsData = await detailsResponse.json();

        // Filter out Shorts (videos under 60 seconds)
        const regularVideos = detailsData.items.filter(video => {
            const duration = video.contentDetails.duration;
            const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
            const hours = parseInt(match[1] || 0);
            const minutes = parseInt(match[2] || 0);
            const seconds = parseInt(match[3] || 0);
            const totalSeconds = hours * 3600 + minutes * 60 + seconds;
            return totalSeconds >= 60;
        });

        // Return only the first 2 regular videos
        const videosToShow = regularVideos.slice(0, 2);

        res.status(200).json({ items: videosToShow });
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
}

