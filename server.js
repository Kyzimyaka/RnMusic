const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());

// Раздача статических файлов (HTML, CSS, JS)
app.use(express.static(__dirname));

// папка с музыкой
const musicFolder = path.join(__dirname, "music");

// Отображение названий файлов на название исполнителя
const artistMap = {
  "BloodontheDanceFloor": "Michael Jackson",
  "BillieJean": "Michael Jackson",
  "BeatIt": "Michael Jackson",
  "StillLovingU": "Scorpions",
  "ImNotTheOnlyOne": "Sam Smith",
  "MuseSupermassiveBlackHole": "Muse",
  "HouseOfPrince": "Perfect Radio",
  "LillyWoodThePrickRobin": "Lilly Wood & Robin Schulz",
  "GiveItToMe": "Timbaland, Justin Timberlake, Nelly_Furtado"
};

// API — список треков
app.get("/api/music", (req, res) => {
  fs.readdir(musicFolder, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Ошибка чтения папки" });
    }

    const songs = files
      .filter(file => file.endsWith(".mp3"))
      .map(file => {
        const filename = file.replace(".mp3", "");
        return {
          title: filename,
          artist: artistMap[filename] || "Unknown",
          src: `http://localhost:${PORT}/music/${file}`
        };
      });

    res.json(songs);
  });
});

// раздача файлов музыки
app.use("/music", express.static(musicFolder));

app.listen(PORT, () => {
  console.log(`🎵 Сервер запущен: http://localhost:${PORT}`);
  console.log(`📁 API музыки: http://localhost:${PORT}/api/music`);
});
