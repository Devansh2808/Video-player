const video = document.getElementById('video');
const playPauseBtn = document.getElementById('playPause');
const backwardBtn = document.getElementById('backward');
const forwardBtn = document.getElementById('forward');
const muteUnmuteBtn = document.getElementById('muteUnmute');
const volumeSlider = document.getElementById('volume');
const progress = document.getElementById('progress');
const timeDisplay = document.getElementById('time-display');
const fullscreenBtn = document.getElementById('fullscreen');
const playbackRate = document.getElementById('playbackRate');
const pipBtn = document.getElementById('pipBtn');
const controls = document.getElementById('controls');
const container = document.getElementById('video-container');

// Load last playback time
window.addEventListener('load', () => {
  const savedTime = localStorage.getItem('lastTime');
  if (savedTime) video.currentTime = savedTime;
});

// Play/Pause
playPauseBtn.onclick = () => {
  if (video.paused) {
    video.play();
    playPauseBtn.textContent = '⏸️';
  } else {
    video.pause();
    playPauseBtn.textContent = '▶️';
  }
};

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    playPauseBtn.click();
  } else if (e.code === 'ArrowRight') {
    video.currentTime += 10;
  } else if (e.code === 'ArrowLeft') {
    video.currentTime -= 10;
  }
});

// Skip
backwardBtn.onclick = () => (video.currentTime -= 10);
forwardBtn.onclick = () => (video.currentTime += 10);

// Mute/Unmute
muteUnmuteBtn.onclick = () => {
  video.muted = !video.muted;
  muteUnmuteBtn.textContent = video.muted ? '🔇' : '🔊';
};
volumeSlider.oninput = () => {
  video.volume = volumeSlider.value;
  muteUnmuteBtn.textContent = volumeSlider.value == 0 ? '🔇' : '🔊';
};

// Progress + Time Display
video.ontimeupdate = () => {
  progress.value = (video.currentTime / video.duration) * 100;
  const current = formatTime(video.currentTime);
  const total = formatTime(video.duration);
  timeDisplay.textContent = `${current} / ${total}`;

  localStorage.setItem('lastTime', video.currentTime);
};
progress.oninput = () => {
  video.currentTime = (progress.value / 100) * video.duration;
};

function formatTime(t) {
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Fullscreen
fullscreenBtn.onclick = () => {
  if (!document.fullscreenElement) {
    container.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

// Playback Speed
playbackRate.onchange = () => {
  video.playbackRate = playbackRate.value;
};

// PiP
pipBtn.onclick = () => {
  if (document.pictureInPictureElement) {
    document.exitPictureInPicture();
  } else {
    video.requestPictureInPicture().catch(err => {
      alert('PiP not supported.');
    });
  }
};

// Auto-hide controls
let hideTimeout;
const showControls = () => {
  controls.style.opacity = 1;
  clearTimeout(hideTimeout);
  hideTimeout = setTimeout(() => {
    if (!video.paused) controls.style.opacity = 0;
  }, 2500);
};
container.addEventListener('mousemove', showControls);
video.addEventListener('play', showControls);
video.addEventListener('pause', () => controls.style.opacity = 1);

// Drag and drop video
container.addEventListener('dragover', (e) => {
  e.preventDefault();
  container.style.border = '2px dashed red';
});
container.addEventListener('dragleave', () => {
  container.style.border = 'none';
});
container.addEventListener('drop', (e) => {
  e.preventDefault();
  container.style.border = 'none';
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('video/')) {
    video.src = URL.createObjectURL(file);
    video.play();
    playPauseBtn.textContent = '⏸️';
  }
});
