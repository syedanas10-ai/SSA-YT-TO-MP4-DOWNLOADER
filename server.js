const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'SSA YT DOWNLOADER BACKEND RUNNING on Render!' });
});

// Download endpoint
app.post('/download', async (req, res) => {
    try {
        const { url, format } = req.body;
        
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
            ytdl(url, { filter: 'audioonly', quality: 'highestaudio' }).pipe(res);
        } else {
            res.setHeader('Content-Disposition', `attachment; filename="${title}.mp4"`);
            ytdl(url, { quality: 'highest' }).pipe(res);
        }

    } catch (error) {
        res.status(500).json({ error: 'Download failed. Try different video.' });
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
            duration: Math.round(info.videoDetails.lengthSeconds / 60) + ' minutes'
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to get video information' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
