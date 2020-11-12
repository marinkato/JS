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
    //take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height);
    // mess with them
    pixels = redEffect(pixels);
    //put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
 //played the sound
  snap.currentTime = 0;
  snap.play();
  //taking the data out of the canvas
  const data = canvas.toDataUrl('image/jpeg');//we get text based representation of the image, containing little attributes
  console.log('data');
  const link = document.createElement('a'); //creating an anchor link
  link.href = data; //that anchor link = data
  link.setAttribute('download', 'handsome'); /*the name of the attribute is download and we are setting it to handsome - so
  if we want to download the image, it will be saved as'handsome.jpeg '*/
  link.innerHTML = `<img src="${data}" alt="Handsome lady"/> `;
  strip.insertBefore(link, strip.firstChild);
}

//to implement filters we take the pixels out of the canvas, then we change the rgb values and put them back in
function redEffect(pixels) {
  for(let i = 0; i < pixels.length; i+=4) {
    pixels[i + 0] = pixels.data[i + 0] + 100; // red
    pixels[i + 1] = pixels.data[i + 1] - 50; // green
    pixels[i + 2] = pixels.data[i + 2] * 0.5; // blue
  }
  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas) // to avoid manually playing paintToCanvas we add a 'canplay' event

