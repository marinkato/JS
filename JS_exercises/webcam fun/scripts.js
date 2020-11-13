
//its a huge array of colour values - its about apply math to colour values

const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d'); //ctx: where the work happens when using canvas
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(localMediaStream => {
      console.log(localMediaStream);
      video.src = window.URL.createObjectURL(localMediaStream);
      /* localMediaStream is an object and needs to be converted into an URL,
      usually we have a format of .mp4 but since we want to make a live video
      feed we need to convert it to type of an URL */
      video.play(); //video source is a blob, its the raw data from the webcam
    });
    .catch(err => {
      console.error('You denied access of your webcam', err);
    });
}

function paintToCanvas() { /*this functions takes a frame from the video and
  paints it on the canvas on the stream, it needs adjustment regarding the width
  and height*/
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);
    //take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height);
    // mess with them
    //pixels = redEffect(pixels);
    // pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.1;
    /* globalAlpha writes the image that we have, but the ones that are
    underneath are still going to show for 10 more frames = putting the
    transparency of 10% of the current image on top and stacking = ghosting*/
    pixels = greenScreen(pixels);
    // put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
 //played the sound
  snap.currentTime = 0;
  snap.play();
  //taking the data out of the canvas
  const data = canvas.toDataUrl('image/jpeg');/*we get text based representation
  of the image, containing little attributes*/
  console.log('data');
  const link = document.createElement('a'); //creating an anchor link
  link.href = data; //that anchor link = data
  link.setAttribute('download', 'handsome'); /*the name of the attribute is
  download and we are setting it to handsome - so if we want to download the
  image, it will be saved as'handsome.jpeg '*/
  link.innerHTML = `<img src="${data}" alt="Handsome lady"/> `;
  strip.insertBefore(link, strip.firstChild);
}

/*to implement filters - take the pixels out of the canvas, then change the rgb
values and put them back in*/
function redEffect(pixels) {
  for(let i = 0; i < pixels.data.length; i+=4) { /*lopping over every single
    pixel - not using map here because its a special kind of array*/
    pixels[i + 0] = pixels.data[i + 0] + 100; // red
    pixels[i + 1] = pixels.data[i + 1] - 50; // green
    pixels[i + 2] = pixels.data[i + 2] * 0.5; // blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for(let i = 0; i < pixels.data.length; i+=4) { /*instead of changing each
  individual, we take the red and change it - pulling apart different red,
  green, blue and moving them to either side*/
    pixels.data[i - 150] = pixels.data[i + 0] ; // red
    pixels.data[i + 100] = pixels.data[i + 1]; // green
    pixels.data[i - 150] = pixels.data[i + 2]; // blue

}

function greenScreen(pixels) {
  const levels = {}; //object that holds min & max green

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }
  return pixels;
}

getVideo();

video.addEventListener('canplay', paintToCanvas) /* to avoid manually playing
paintToCanvas we add a 'canplay' event*/

