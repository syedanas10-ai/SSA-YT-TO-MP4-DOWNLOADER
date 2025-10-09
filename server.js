const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Serve the frontend
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>SSA YT DOWNLOADER</title>
        <style>
            body { background: #1a1a2e; color: white; text-align: center; padding: 50px; font-family: Arial; }
            input { padding: 15px; width: 300px; margin: 10px; }
            button { padding: 15px 30px; background: #4361ee; color: white; border: none; cursor: pointer; }
        </style>
    </head>
    <body>
        <h1>SSA YT DOWNLOADER</h1>
        <p>Paste YouTube URL and download</p>
        <input type="text" id="url" placeholder="YouTube URL">
        <br>
        <button onclick="downloadVideo()">DOWNLOAD MP4</button>

        <script>
            function downloadVideo() {
                var url = document.getElementById('url').value;
                var videoId = url.match(/(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?)\\/|.*[?&]v=)|youtu\\.be\\/)([^"&?\\/\\s]{11})/);
                if (videoId) {
                    window.open('https://ssyoutube.com/watch?v=' + videoId[1], '_blank');
                    alert('Download started in new tab!');
                } else {
                    alert('Invalid YouTube URL');
                }
            }
        </script>
    </body>
    </html>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});
