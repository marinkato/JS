const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d'); //ctx is where the work happens when using canvas
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
      console.log(localMediaStream);
      video.src = window.URL.createObjectURL(localMediaStream); /* localMediaStream
      is an object and needs to be converted into an URL, usually we have a format of .mp4,
      but since we want to make a live video feed we need to convert it to type of an URL */
      video.play(); //video source is a blob - that means its the raw data from the webcam
    });
    .catch(err => {
      console.error('You denied access of your webcam', err);
    });
}

function paintToCanvas() { //this functions takes a frame from the video and paints it on the canvas on the stream
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
  }, 16);
}

function takePhoto() {
 //played the sound
  snap.currentTime = 0;
  snap.play();
}
//taking the data out of the canvas
const data = canvas.canvas.toDataUrl('image/jpeg');
console.log('data'); //we get text based representation of the image


getVideo();

video.addEventListener('canplay', paintToCanvas)

