const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Redirecting...</title>
        <meta http-equiv="refresh" content="0; url=https://ssa-yt-to-mp-4-downloader.vercel.app" />
    </head>
    <body>
        <p>Redirecting to SSA YT DOWNLOADER...</p>
    </body>
    </html>
    `);
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'SSA YT DOWNLOADER API is running',
        timestamp: new Date().toISOString()
    });
});

// SIMPLE WORKING DOWNLOAD - NO VIDEO INFO
app.post('/api/download', async (req, res) => {
    try {
        const { url, format } = req.body;
        
        console.log('Download request:', url, format);
        
        if (!url) {
            return res.status(400).json({ error: 'YouTube URL is required' });
        }

        // Validate URL
        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        // Get basic info
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '') || 'youtube_video';
        
        // Set headers based on format
        if (format === 'mp3') {
            res.setHeader('Content-Disposition', `attachment; filename="${title}.mp3"`);
            res.setHeader('Content-Type', 'audio/mpeg');
            
            ytdl(url, {
                filter: 'audioonly',
                quality: 'highestaudio'
            }).pipe(res);
            
        } else {
            res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
            res.setHeader('Content-Type', 'video/mp4');
            
            ytdl(url, {
                quality: 'highest'
            }).pipe(res);
        }

    } catch (error) {
        console.error('Download error:', error);
        res.status(500).json({ error: 'Download failed. Please try a different video.' });
    }
});

// SIMPLE VIDEO INFO ENDPOINT
app.post('/api/video-info', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        const info = await ytdl.getInfo(url);
        const videoId = info.videoDetails.videoId;
        
        res.json({
            success: true,
            title: info.videoDetails.title,
            thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
            duration: 'Ready to download',
            videoId: videoId
        });

    } catch (error) {
        console.error('Video info error:', error);
        res.status(500).json({ error: 'Could not get video info. Try downloading directly.' });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 SSA YT DOWNLOADER BACKEND RUNNING on port ${PORT}`);
});
