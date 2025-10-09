import express from "express";
import cors from "cors";
import ytdl from "ytdl-core";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/download", async (req, res) => {
  try {
    const { url } = req.body;

    if (!ytdl.validateURL(url)) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });

    res.json({
      title,
      downloadUrl: format.url,
      thumbnail: info.videoDetails.thumbnails.pop().url,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch video info" });
  }
});

app.get("/", (req, res) => {
  res.send("SSA YT Downloader backend running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
