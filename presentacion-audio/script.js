const audio = document.getElementById("audio");
const playButton = document.getElementById("playButton");
const playIcon = document.getElementById("playIcon");
const progress = document.getElementById("progress");
const runtime = document.getElementById("runtime");
const slides = [...document.querySelectorAll(".slide")].map((node) => ({
  node,
  start: Number(node.dataset.start || 0),
}));

const fallbackDuration = 119;

function formatTime(seconds) {
  const value = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const minutes = Math.floor(value / 60);
  const remaining = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes.toString().padStart(2, "0")}:${remaining}`;
}

function activeSlideIndex(currentTime) {
  let index = 0;
  for (let i = 0; i < slides.length; i += 1) {
    if (currentTime >= slides[i].start) index = i;
  }
  return index;
}

function update() {
  const duration = audio.duration || fallbackDuration;
  const currentTime = audio.currentTime || 0;
  const activeIndex = activeSlideIndex(currentTime);

  slides.forEach((slide, index) => {
    slide.node.classList.toggle("active", index === activeIndex);
  });

  progress.style.width = `${Math.min(100, (currentTime / duration) * 100)}%`;
  runtime.textContent = `${formatTime(currentTime)} / ${formatTime(duration)}`;
  playIcon.textContent = audio.paused ? "▶" : "Ⅱ";
}

playButton.addEventListener("click", async () => {
  if (audio.paused) {
    await audio.play();
  } else {
    audio.pause();
  }
  update();
});

audio.addEventListener("loadedmetadata", update);
audio.addEventListener("timeupdate", update);
audio.addEventListener("play", update);
audio.addEventListener("pause", update);
audio.addEventListener("ended", () => {
  playIcon.textContent = "▶";
});

window.addEventListener("message", async (event) => {
  if (event.origin !== window.location.origin) return;

  if (event.data && event.data.type === "mbyte:presentation-play") {
    try {
      await audio.play();
    } catch (error) {
      playButton.focus();
    }
    update();
  }

  if (event.data && event.data.type === "mbyte:presentation-pause") {
    audio.pause();
    update();
  }
});

update();
