// get elements and store them into an array

const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelector('[data-skip]');
const ranges = player.querySelector('.player__slider');


// build the functionality
function togglePlay () {
  const method = video.paused ? 'play' : 'pause';// paused is a property that lives on the video
  video[method]();
}

// a simple way of doing the if / else statement
// function togglePlay () {
//   if (video.paused) {
//   }
//   else {
//   video.pause();
//   }
// }

function updateButton() {
  const icon = this.paused ? '►' : '❚❚';
  toggle.textContent = icon;
}

function skip(){
  console.log(this.dataset.skip);
  video.currentTime += parseFloat(this.dataset.skip);
}
// connect the eventListeners
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);

toggle.addEventListener('click', togglePlay);
skipButtons.forEach(button => button.addEventListener('click', skip));

