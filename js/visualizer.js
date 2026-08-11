document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("audioPlayer");
  const equalizer = document.querySelector(".gold-player__equalizer");

  if (!audio || !equalizer) {
    console.error("Visualizer could not find the audio player or equalizer.");
    return;
  }

  let audioContext;
  let analyser;
  let source;
  let animationFrame;
  let isConnected = false;

  const bars = Array.from(equalizer.querySelectorAll("span"));

  const setupVisualizer = () => {
    if (isConnected) return;

    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.78;

    source = audioContext.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    isConnected = true;
  };

  const drawVisualizer = () => {
    if (!analyser) return;

    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(frequencyData);

    bars.forEach((bar, index) => {
      const sampleIndex = Math.floor(
        (index / bars.length) * frequencyData.length
      );

      const value = frequencyData[sampleIndex];

const strength = value / 255;
const height = 5 + strength * 22;

bar.style.height = `${height}px`;
bar.style.opacity = `${0.55 + strength * 0.45}`;
    });

    animationFrame = requestAnimationFrame(drawVisualizer);
  };

  audio.addEventListener("play", async () => {
    setupVisualizer();

    if (audioContext?.state === "suspended") {
      await audioContext.resume();
    }

    cancelAnimationFrame(animationFrame);
    drawVisualizer();
  });

  audio.addEventListener("pause", () => {
    cancelAnimationFrame(animationFrame);

    bars.forEach((bar) => {
      bar.style.height = "5px";
    });
  });

  audio.addEventListener("ended", () => {
    cancelAnimationFrame(animationFrame);

    bars.forEach((bar) => {
      bar.style.height = "5px";
    });
  });
});
