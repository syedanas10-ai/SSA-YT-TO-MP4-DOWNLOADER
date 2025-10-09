const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Download endpoint - SIMPLE & WORKING
app.get('/download', async (req, res) => {
    try {
        const url = req.query.url;
        const format = req.query.format || 'mp4';
        
        if (!url) {
            return res.status(400).send('No URL provided');
        }

        if (!ytdl.validateURL(url)) {
            return res.status(400).send('Invalid YouTube URL');
        }

        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
        
        if (format === 'mp3') {
            res.header('Content-Disposition', `attachment; filename="${title}.mp3"`);
            ytdl(url, { filter: 'audioonly', quality: 'highestaudio' }).pipe(res);
        } else {
            res.header('Content-Disposition', `attachment; filename="${title}.mp4"`);
            ytdl(url, { quality: 'highest' }).pipe(res);
        }
        
    } catch (error) {
        res.status(500).send('Download error: ' + error.message);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
