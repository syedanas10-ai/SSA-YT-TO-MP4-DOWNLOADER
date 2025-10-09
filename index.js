const express = require("express");
const cors = require("cors");
const ytdl = require("ytdl-core");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/getinfo", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || !ytdl.validateURL(url)) return res.status(400).json({ error: "Invalid YouTube URL" });

    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    const thumbnail = info.videoDetails.thumbnails?.pop()?.url || "";
    // Provide a few common formats + itags
    const formats = [
      { quality: "Audio (m4a)", itag: 140 },
      { quality: "MP4 360p", itag: 18 },
      { quality: "MP4 720p", itag: 22 },
      { quality: "MP4 1080p (video only)", itag: 137 }
    ];
    res.json({ title, thumbnail, formats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch video info" });
  }
});

app.get("/download", async (req, res) => {
  const { url, itag } = req.query;
  if (!url || !itag) return res.status(400).json({ error: "Missing url or itag" });

  try {
    const info = await ytdl.getInfo(url);
    const format = info.formats.find(f => String(f.itag) === String(itag));
    const ext = (format && format.container) ? format.container : "mp4";
    const safeTitle = info.videoDetails.title.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_").slice(0,200);

    res.setHeader("Content-Disposition", `attachment; filename="${safeTitle}.${ext}"`);
    // Stream the chosen format from YouTube through your server
    const stream = ytdl(url, { filter: f => String(f.itag) === String(itag), highWaterMark: 1<<25 });
    stream.on("error", (e) => {
      console.error("stream error:", e);
      if (!res.headersSent) res.status(500).end("Download error");
    });
    stream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to download" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SSA backend running on ${PORT}`));
