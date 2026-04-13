const audio = document.getElementById("audio");
const title = document.getElementById("title");
const cover = document.getElementById("cover");
const vinyl = document.getElementById("vinyl");
const playBtn = document.getElementById("playBtn");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current");
const durationEl = document.getElementById("duration");
const artist = document.getElementById("artist");
document.getElementsByTagName('img').ondragstart = function() { return false; };

let current = 0;

// Метаданные песен (обложки и исполнители)
const songMetadata = {
  "BloodontheDanceFloor": {
    title: "Blood on the Dance Floor",
    artist: "Michael Jackson",
    cover: "./img/MJ1.jpg"
  },
  "StillLovingU": {
    title: "Still Loving U",
    artist: "Scorpions",
    cover: "./img/SLU.jpg"
  },
  "BillieJean": {
    title: "Billie Jean",
    artist: "Michael Jackson",
    cover: "./img/MJ1.jpg"
  },
  "BeatIt": {
    title: "Beat it",
    artist: "Michael Jackson",
    cover: "./img/MJ1.jpg"
  },
  "ImNotTheOnlyOne": {
    title: "I'm not the only one",
    artist: "Sam Smith",
    cover: "./img/Sam.jpg"
  },
  "MuseSupermassiveBlackHole": {
    title: "Supermassive Black Hole",
    artist: "Muse",
    cover: "./img/Muse.jpg"
  },
  "HouseOfPrince": {
    title: "House Of Prince feat. Oeziem – Perfect Love",
    artist: "Perfect Radio",
    cover: "./img/DevilsWeirsPrada.jpg"
  },
  "LillyWoodThePrickRobin": {
    title: "Prayer in C",
    artist: "Lilly Wood & Robin Schulz",
    cover: "./img/PinC.jpg"
  },
  "GiveItToMe": {
    title: "Give it to me",
    artist: "Timbaland, Justin Timberlake, Nelly_Furtado",
    cover: "./img/GiveToMe.jpg"
  }
};

let songs = [];

function loadSong(index) {
  const song = songs[index];
  audio.src = song.src;
  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = song.cover;
}

function togglePlay() {
  if (audio.paused) {
    audio.play();
    vinyl.style.animationPlayState = "running";
    playBtn.textContent = "⏸";
  } else {
    audio.pause();
    vinyl.style.animationPlayState = "paused";
    playBtn.textContent = "▶";
  }
}

function nextSong() {
  current = Math.floor(Math.random() * songs.length);
  loadSong(current);
  audio.play();
  vinyl.style.animationPlayState = "running";
}

function prevSong() {
  current = (current - 1 + songs.length) % songs.length;
  loadSong(current);
  audio.play();
  vinyl.style.animationPlayState = "running";
  playBtn.textContent = "⏸";
}

/* ПРОГРЕСС */
audio.addEventListener("timeupdate", () => {
  const { duration, currentTime } = audio;

  const percent = (currentTime / duration) * 100;
  progress.style.width = percent + "%";

  currentTimeEl.textContent = formatTime(currentTime);
  durationEl.textContent = formatTime(duration);
});

/* ПЕРЕМОТКА */
function setProgress(e) {
  const width = e.currentTarget.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
}

/* ВРЕМЯ */
function formatTime(time) {
  if (!time) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

/* ГРОМКОСТЬ */
function setVolume(value) {
  audio.volume = value;
}

/* АВТО СЛЕДУЮЩАЯ */
audio.addEventListener("ended", nextSong);

// Загружаем музыку с сервера
fetch("http://localhost:3000/api/music")
  .then(res => res.json())
  .then(data => {
    // Мергим данные с метаданными
    songs = data.map(song => {
      const filename = song.title; // название файла без .mp3
      const meta = songMetadata[filename] || {};
      
      return {
        src: song.src,
        title: meta.title || song.title,
        artist: meta.artist || song.artist || "Unknown",
        cover: meta.cover || "./img/default.jpg"
      };
    });

    // Запускаем рандом
    current = Math.floor(Math.random() * songs.length);
    loadSong(current);
  })
  .catch(err => {
    console.error("Ошибка загрузки музыки:", err);
    // Если сервер не доступен, загружаем первую доступную
    if (songs.length > 0) {
      loadSong(current);
    }
  });

/* старт */
// с задержкой, чтобы дождаться загрузки
setTimeout(() => {
  if (songs.length === 0) {
    console.warn("Музыка не загрузилась. Убедитесь, что сервер запущен: npm start");
  }
}, 1000);