// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet using p5.js
=== */
/* eslint-disable */

// Grab elements, create settings, etc.
var video = document.getElementById('video');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

// The detected positions will be inside an array
let poses = [];

// Create a webcam capture
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    video.srcObject=stream;
    video.play();
  });
}

// A function to draw the video and poses into the canvas.
// This function is independent of the result of posenet
// This way the video will not seem slow if poseNet 
// is not detecting a position
function drawCameraIntoCanvas() {
  // Draw the video element into the canvas
  // ctx.drawImage(video, 0, 0, 640, 480);
  ctx.clearRect(0, 0, 640, 480);
  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  window.requestAnimationFrame(drawCameraIntoCanvas);
}
// Loop over the drawCameraIntoCanvas function
drawCameraIntoCanvas();

// Create a new poseNet method with a single detection
const poseNet = ml5.poseNet(video, 'multiple', modelReady);
poseNet.on('pose', gotPoses);

// A function that gets called every time there's an update from the model
function gotPoses(results) {
  poses = results;
}

function modelReady() {
  console.log("model ready")
}

const availableParts = [
    'leftEye',
    'leftEar',
    'rightEye',
    'rightEar',
    'nose',
    'mouth'
];

function insertPartImages() {
    availableParts.forEach(name => {
        const img = document.createElement('img');
        img.src = './assets/oracle-bone-script-' + name + '.png';
        img.setAttribute('id', name);
        img.setAttribute('style', 'display: none');
        document.body.appendChild(img);
    })
}

insertPartImages();

function calculateImageScale(part, eyeDistance, img) {
  let result;
  let factor = 0.5;
  result = [eyeDistance * factor, eyeDistance * factor];
  return result;
}

function calculateEyeDistance(oneEye, theOtherEye) {
  if (oneEye && theOtherEye) {
    let a = oneEye.position.x - theOtherEye.position.x;
    let b = oneEye.position.y - theOtherEye.position.y;
    return Math.sqrt(a*a + b*b);
  }
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    let eyeDistance;
    let leftEye, rightEye;
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      let keypoint = poses[i].pose.keypoints[j];
      if (keypoint.score > 0.2) {
        if (!leftEye) {
          leftEye = keypoint.part === 'leftEye' && keypoint;
        }
        if (!rightEye) {
          rightEye = keypoint.part === 'rightEye' && keypoint;
        }
      }
    }
    eyeDistance = calculateEyeDistance(leftEye, rightEye);
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      let keypoint = poses[i].pose.keypoints[j];
      if (keypoint.score > 0.2) {
        if (availableParts.includes(keypoint.part) ) {
            let img = document.getElementById(keypoint.part);
            let dims = calculateImageScale(keypoint.part, eyeDistance, img);
            ctx.drawImage(img, keypoint.position.x, keypoint.position.y, dims[0], dims[1]);
            if (keypoint.part === 'nose') {
              let mouthImage = document.getElementById('mouth');
              ctx.drawImage(mouthImage, keypoint.position.x, keypoint.position.y + 20, dims[0], dims[1]);
            }
        }
      }
    }
  }
}
