document.addEventListener("DOMContentLoaded", () => {
  const tracks = [
    { title: "கனவே... கவிதையே...", file: "songs/01.mp3" },
    { title: "வஞ்சியே இளவஞ்சியே", file: "songs/02.mp3" },
    { title: "அறிந்தும் அறியாமலும்", file: "songs/03.mp3" },
    { title: "பாவையின் மடியில்", file: "songs/04.mp3" },
    { title: "பொன்னாடை போர்த்தினாலும்", file: "songs/05.mp3" },
    { title: "ஆலவாயின் சிவராத்திரி", file: "songs/06.mp3" },
    { title: "பூ இதழே... பூ இதழே...", file: "songs/07.mp3" },
    { title: "சைனா நிலவே", file: "songs/08.mp3" },
    { title: "கருமேகம் கண்டு", file: "songs/09.mp3" },
    { title: "கரை தெரியா கனவுகளின் கடலினிலே...", file: "songs/10.mp3" }
  ];

  const musicSection = document.getElementById("music");

  if (!musicSection) {
    console.error("Music section not found.");
    return;
  }

  const player = document.createElement("section");
  player.className = "gold-player";
  player.innerHTML = `
    <div class="gold-player__art">
  <div class="gold-player__vinyl-wrap">
    <div class="gold-player__vinyl" aria-hidden="true"></div>
    <img
      src="images/kanave-kavithaiye.jpg"
      alt="கனவே கவிதையே album cover"
    >
    </div>
  </div>

    <div class="gold-player__main">
      <div class="gold-player__status">
      <p class="gold-player__label">NOW PLAYING</p>

      <div class="gold-player__equalizer" aria-hidden="true">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
    </div>
      <h3 id="playerTitle">${tracks[0].title}</h3>
      <p class="gold-player__artist">Sypriyan</p>

      <audio id="audioPlayer" preload="metadata"></audio>

      <div class="gold-player__controls">
    <button id="previousTrack" type="button">⏮</button>

    <button id="playPauseTrack" type="button">▶</button>

    <button id="nextTrack" type="button">⏭</button>

    <button id="lyricsBtn" type="button">
        📜 Lyrics
    </button>
    </div>

      <input
        id="trackProgress"
        type="range"
        min="0"
        max="100"
        value="0"
        aria-label="Song progress"
      >

      <div class="gold-player__time">
        <span id="currentTime">0:00</span>
        <span id="duration">0:00</span>
      </div>
    </div>

    <div class="gold-player__playlist">
      <h4>Album Playlist</h4>
      <div id="trackList"></div>
    </div>
    <div id="lyricsPanel" class="lyrics-panel">

    <div class="lyrics-header">
        <h3>📜 Lyrics</h3>

        <button id="closeLyrics">
            ✕
        </button>
    </div>

    <pre id="lyricsContent">
Loading lyrics...
    </pre>

</div>
  `;

const miniPlayer = document.createElement("div");
miniPlayer.className = "mini-player";
miniPlayer.innerHTML = `
  <img
    class="mini-player__cover"
    src="images/kanave-kavithaiye.jpg"
    alt="Current song cover"
  >

  <div class="mini-player__info">
    <strong id="miniPlayerTitle">${tracks[0].title}</strong>
    <span>Sypriyan</span>
  </div>

  <button
    id="miniPreviousTrack"
    type="button"
    aria-label="Previous song"
  >
    ⏮
  </button>

  <button
    id="miniPlayPauseTrack"
    type="button"
    aria-label="Play song"
  >
    ▶
  </button>

  <button
    id="miniNextTrack"
    type="button"
    aria-label="Next song"
  >
    ⏭
  </button>
`;





  musicSection.prepend(player);
  document.body.appendChild(miniPlayer);

  const audio = document.getElementById("audioPlayer");
  const albumArt = document.querySelector(".gold-player__art img");
  const vinyl = document.querySelector(".gold-player__vinyl");
  const equalizer = document.querySelector(".gold-player__equalizer");

  const title = document.getElementById("playerTitle");
  const playPause = document.getElementById("playPauseTrack");
  const previous = document.getElementById("previousTrack");
  const next = document.getElementById("nextTrack");
  const progress = document.getElementById("trackProgress");
  const currentTime = document.getElementById("currentTime");
  const duration = document.getElementById("duration");
  const trackList = document.getElementById("trackList");

  const miniTitle = document.getElementById("miniPlayerTitle");
  const miniPlayPause = document.getElementById("miniPlayPauseTrack");
  const miniPrevious = document.getElementById("miniPreviousTrack");
  const miniNext = document.getElementById("miniNextTrack");

  const lyricsBtn = document.getElementById("lyricsBtn");
  const lyricsPanel = document.getElementById("lyricsPanel");
  const lyricsContent = document.getElementById("lyricsContent");
  const closeLyrics = document.getElementById("closeLyrics");

  let currentTrack = 0;
  let lyricLines = [];
  let activeLyricIndex = -1;

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${remainingSeconds}`;
  };

  const renderPlaylist = () => {
    trackList.innerHTML = tracks
      .map(
        (track, index) => `
          <button
            class="gold-player__track ${index === currentTrack ? "is-active" : ""}"
            type="button"
            data-track="${index}"
          >
            <span>${String(index + 1).padStart(2, "0")}</span>
            <strong>${track.title}</strong>
          </button>
        `
      )
      .join("");
  };

  const loadTrack = (index, autoplay = false) => {
    currentTrack = index;
    audio.src = tracks[currentTrack].file;
    title.textContent = tracks[currentTrack].title;
    miniTitle.textContent = tracks[currentTrack].title;
    const lyricNumber = String(currentTrack + 1).padStart(2, "0");

lyricsContent.textContent = "Loading lyrics...";

fetch(`lyrics/${lyricNumber}.txt`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Lyrics file not found");
    }

    return response.text();
  })
  .then((lyrics) => {
  lyricLines = lyrics
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const match = line.match(/^\[(\d{2}):(\d{2}(?:\.\d{1,3})?)\]\s*(.*)$/);

      if (!match) {
        return null;
      }

      const minutes = Number(match[1]);
      const seconds = Number(match[2]);
      const text = match[3];

      return {
        time: minutes * 60 + seconds,
        text
      };
    })
    .filter(Boolean);

  lyricsContent.innerHTML = lyricLines
    .map(
      (line, index) =>
        `<span class="lyric-line" data-lyric-index="${index}">${line.text}</span>`
    )
    .join("");

  activeLyricIndex = -1;
  lyricsContent.scrollTop = 0;
})
  .catch(() => {
    lyricsContent.textContent = "Lyrics are not available for this song yet.";
    lyricsContent.scrollTop = 0;
    lyricLines = [];
    activeLyricIndex = -1;
  });
    progress.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";
    playPause.textContent = "▶";
    renderPlaylist();

    if (autoplay) {
      audio.play().catch(() => {});
    }
  };

  const togglePlay = () => {
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  playPause.addEventListener("click", togglePlay);
  miniPlayPause.addEventListener("click", togglePlay);

  previous.addEventListener("click", () => {
    const newIndex = (currentTrack - 1 + tracks.length) % tracks.length;
    loadTrack(newIndex, true);
  });

  miniPrevious.addEventListener("click", () => {
  const newIndex = (currentTrack - 1 + tracks.length) % tracks.length;
  loadTrack(newIndex, true);
});

  next.addEventListener("click", () => {
    const newIndex = (currentTrack + 1) % tracks.length;
    loadTrack(newIndex, true);
  });

  miniNext.addEventListener("click", () => {
  const newIndex = (currentTrack + 1) % tracks.length;
  loadTrack(newIndex, true);
});

  trackList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-track]");
    if (!button) return;

    loadTrack(Number(button.dataset.track), true);
  });

  audio.addEventListener("play", () => {
  playPause.textContent = "⏸";
  miniPlayPause.textContent = "⏸";
  albumArt?.classList.add("is-playing");
  vinyl?.classList.add("is-playing");
  equalizer?.classList.add("is-playing");
  });

  audio.addEventListener("pause", () => {
  playPause.textContent = "▶";
  miniPlayPause.textContent = "▶";
  albumArt?.classList.remove("is-playing");
  vinyl?.classList.remove("is-playing");
  equalizer?.classList.remove("is-playing");
  });

  audio.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audio.duration);
  });

 audio.addEventListener("timeupdate", () => {
  currentTime.textContent = formatTime(audio.currentTime);

  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
  }

  if (audio.duration && lyricLines.length > 0) {
    let newLyricIndex = -1;

for (let index = 0; index < lyricLines.length; index += 1) {
  if (audio.currentTime >= lyricLines[index].time) {
    newLyricIndex = index;
  } else {
    break;
  }
}
    if (newLyricIndex !== activeLyricIndex) {
      const oldLine = lyricsContent.querySelector(
        `[data-lyric-index="${activeLyricIndex}"]`
      );

      const newLine = lyricsContent.querySelector(
        `[data-lyric-index="${newLyricIndex}"]`
      );

      oldLine?.classList.remove("is-active");
      newLine?.classList.add("is-active");

      newLine?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

      activeLyricIndex = newLyricIndex;
    }
  }
});

progress.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime =
      (Number(progress.value) / 100) * audio.duration;
  }
});

    
     
  audio.addEventListener("ended", () => {
    const newIndex = (currentTrack + 1) % tracks.length;
    loadTrack(newIndex, true);
  });
const playerObserver = new IntersectionObserver(
  ([entry]) => {
    miniPlayer.classList.toggle("is-visible", !entry.isIntersecting);
  },
  {
    threshold: 0.25
  }
);

playerObserver.observe(player);
lyricsBtn.addEventListener("click", () => {
    lyricsPanel.classList.add("show");
});

closeLyrics.addEventListener("click", () => {
    lyricsPanel.classList.remove("show");
});
  loadTrack(0);
});
