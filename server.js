const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'SSA YT DOWNLOADER BACKEND RUNNING!' });
});

// Download endpoint
app.post('/download', async (req, res) => {
    try {
        const { url, format } = req.body;
        
        console.log('Download request:', url, format);
        
        if (!url) {
            return res.status(400).json({ error: 'YouTube URL is required' });
        }

        if (!ytdl.validateURL(url)) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '') || 'youtube_video';

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

// Video info endpoint
app.post('/video-info', async (req, res) => {
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
            duration: Math.round(info.videoDetails.lengthSeconds / 60) + ' minutes',
            videoId: videoId
        });

    } catch (error) {
        console.error('Video info error:', error);
        res.status(500).json({ error: 'Failed to get video information' });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 SSA YT DOWNLOADER BACKEND RUNNING on port ${PORT}`);
    console.log(`✅ Frontend: https://ssa-yt-to-mp-4-downloader.vercel.app`);
    console.log(`✅ Backend: Your Railway URL`);
});
