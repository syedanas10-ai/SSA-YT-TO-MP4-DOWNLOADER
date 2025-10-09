// BACKEND: Node.js + Express + yt-dlp wrapper

const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/download", (req, res) => {
  const url = req.body.url;
  if (!url) return res.status(400).json({ error: "No URL provided" });

  exec(`yt-dlp -j "${url}"`, (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: "yt-dlp error" });

    try {
      const data = JSON.parse(stdout);
      const formats = data.formats
        .filter(f => f.url && f.filesize && f.ext && f.format_note)
        .map(f => ({
          url: f.url,
          quality: f.format_note,
          type: f.ext
        }));
      res.json({ formats });
    } catch (e) {
      res.status(500).json({ error: "Failed to parse video info" });
    }
  });
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
