const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'SSA YT DOWNLOADER API is running',
        timestamp: new Date().toISOString()
    });
});

// Get video information
app.post('/api/video-info', async (req, res) => {
    try {
        const { url } = req.body;
        
        console.log('Received URL:', url);
        
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        const info = await ytdl.getInfo(url);
        const videoDetails = info.videoDetails;

        res.json({
            success: true,
            title: videoDetails.title,
            thumbnail: videoDetails.thumbnails[videoDetails.thumbnails.length - 1].url,
            duration: formatDuration(parseInt(videoDetails.lengthSeconds)),
            qualities: ['mp3', 'mp4', '720p', '1080p']
        });

    } catch (error) {
        console.error('Video info error:', error);
        res.status(500).json({ error: 'Failed to get video information' });
    }
});

// Download endpoint - SIMPLIFIED VERSION
app.post('/api/download', async (req, res) => {
    try {
        const { url, format } = req.body;
        
        console.log('Download request received:', { url, format });
        
        if (!url || !format) {
            return res.status(400).json({ error: 'URL and format are required' });
        }

        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
        
        console.log('Downloading:', title);

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
        res.status(500).json({ error: 'Download failed: ' + error.message });
    }
});

// Helper function to format duration
function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 SSA YT DOWNLOADER running on port ${PORT}`);
});

