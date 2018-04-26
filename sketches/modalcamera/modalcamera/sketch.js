var video;
var synth = new Tone.Synth().toMaster();

var drum = new Tone.MembraneSynth().toMaster();

/* Modal Scales, in C*/
var locrianScale = ['C4', 'Db4', 'Eb4', 'Gb4', 'Ab4', 'Bb4'];
var phrygianScale = ['C4', 'Eb4', 'Gb4', 'Ab4', 'Bb4'];
var aeolianScale = ['C4', 'Eb4', 'G4', 'Ab4', 'Bb4'];
var dorianScale = ['C4', 'Eb4', 'G4', 'Bb4'];
var mixolydianScale = ['C4', 'E4', 'G4', 'Bb4'];
var ionianScale = ['C4', 'E4', 'G4', 'B4'];
var lydianScale = ['C4', 'E4', 'D#4', 'G4', 'B4'];

/*  MODAL SEQUENCES */
var locrianSeq = new Tone.Sequence(function(time, note){
  synth.triggerAttackRelease(note, "8n", time);
  drum.triggerAttackRelease("C2", "4n", time);
    Tone.Draw.schedule(function(){
      redValue = random(0,30);
      blueValue = random(0,30);
      greenValue = random(0,30);
  }, time);
}, locrianScale, "8n").start(0);


var phrygianSeq = new Tone.Sequence(function(time, note){
  synth.triggerAttackRelease(note, "8n", time);
  drum.triggerAttackRelease("C2", "4n", time);
    Tone.Draw.schedule(function(){
      redValue = random(30, 70);
      blueValue = random(30, 70);
      greenValue = random(30, 70);
  }, time);
}, phrygianScale, "8n").start(0);


var aeolianSeq = new Tone.Sequence(function(time, note){
  synth.triggerAttackRelease(note, "8n", time);
  drum.triggerAttackRelease("C2", "4n", time);
    Tone.Draw.schedule(function(){
      redValue = random(70,120);
      blueValue = random(70,120);
      greenValue = random(70,120);
  }, time);
}, aeolianScale, "8n").start(0);


var dorianSeq = new Tone.Sequence(function(time, note){
  synth.triggerAttackRelease(note, "8n", time);
  drum.triggerAttackRelease("C2", "4n", time);
  Tone.Draw.schedule(function(){
      redValue = random(120,160);
      blueValue = random(120,160);
      greenValue = random(120,160);
      videoAmount += 1;
  }, time);
}, dorianScale, "8n").start(0);


var mixolydianSeq = new Tone.Sequence(function(time, note){
  synth.triggerAttackRelease(note, "8n", time);
  drum.triggerAttackRelease("C2", "4n", time);
    Tone.Draw.schedule(function(){
      redValue = random(160,200);
      blueValue = random(160,200);
      greenValue = random(160,200);
  }, time);
}, mixolydianScale, "8n").start(0);


var ionianSeq = new Tone.Sequence(function(time, note){
  synth.triggerAttackRelease(note, "8n", time);
  drum.triggerAttackRelease("C2", "4n", time);
    Tone.Draw.schedule(function(){
      redValue = random(200,225);
      blueValue = random(200,225);
      greenValue = random(200,225);
  }, time);

}, ionianScale, "8n").start(0);


var lydianSeq = new Tone.Sequence(function(time, note){
  synth.triggerAttackRelease(note, "8n", time);
  drum.triggerAttackRelease("C2", "4n", time);
    Tone.Draw.schedule(function(){
      redValue = random(225,255);
      blueValue = random(225,255);
      greenValue = random(225,255);
  }, time);

}, lydianScale, "8n").start(0);


var modalSequences = [locrianSeq, phrygianSeq, aeolianSeq, dorianSeq, mixolydianSeq, ionianSeq, lydianSeq];


locrianSeq.loop = true;
phrygianSeq.loop = true;
aeolianSeq.loop = true;
dorianSeq.loop = true;
mixolydianSeq.loop = true;
ionianSeq.loop = true;
lydianSeq.loop = true;

var chordType = "SUBLEMON";
var averageBrightness = 0.0;
var redValue;
var greenValue;
var blueValue;

var buttonLabel = "Play";

screenWidth = window.innerWidth;
screenHeight = window.innerHeight;

var playButton;
var isPlaying;

var videoAmount = 1;



function preload(){
  fontRegular = loadFont('assets/ProggySquare.ttf')
}

function setup() {
  redValue = random(0,255);
  blueValue = random(0,255);
  greenValue = random(0,255);
  textFont(fontRegular);
  Tone.Transport.bpm.value = 90;

  createCanvas(screenWidth, screenHeight);
  video = createCapture(VIDEO);
  pixelDensity(1);
  video.size(320, 240);
  video.hide();

  playButton = createButton(buttonLabel);
  playButton.position(width/2, height/2 + 50);
  playButton.mouseClicked(playSong);
}



function draw() {
  background(redValue, greenValue, blueValue);
  var xPos = 0;
  var yPos = 0;
  for(var i = 0; i < videoAmount; i++){
    image(video, xPos += 160, yPos, 160, 120);
  }
  textAlign(CENTER);
  rectMode(CENTER);
  textSize(32);
  text("You look very " + chordType + " today ;)", width/2, height/2);
}


function getAverageBrightness(){
  var Y = 0.0;
  averageBrightness = 0.0;
  video.loadPixels();
  for (var y = 0; y < video.height; y++){
    for(var x = 0; x < video.width; x++){
      var i = (x + y * video.width) * 4;
      var r = video.pixels[i];
      var g = video.pixels[i + 1];
      var b = video.pixels[i + 2];
      Y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722); //brightness calculation Photometric/digital ITU BT.709
      averageBrightness += Y;
    }
  }
  averageBrightness /= (video.width * video.height);
  return averageBrightness;
}


function playSong(){

  console.log("HIT");

  if (!isPlaying){
    playButton.value = "Stop";
    isPlaying = true;
    averageBrightness = getAverageBrightness();

    if (averageBrightness >= 0.0 && averageBrightness <= 36.4) {
      for (var i = 0; i < modalSequences.length; i++){
        modalSequences[i].stop();
      }
      locrianSeq.start();
      chordType = "Locrian";
    }
    else if (averageBrightness > 36.4 && averageBrightness <= 72.8) {
      for (var i = 0; i < modalSequences.length; i++){
        modalSequences[i].stop();
      }
      phrygianSeq.start();
      chordType = "Phrygian";
    }
    else if (averageBrightness > 72.8 && averageBrightness <= 109.2) {
      for (var i = 0; i < modalSequences.length; i++){
        modalSequences[i].stop();
      }
      aeolianSeq.start();
      chordType = "Aeolian";
    }
    else if (averageBrightness > 109.2 && averageBrightness <= 145.6) {
      for (var i = 0; i < modalSequences.length; i++){
        modalSequences[i].stop();
      }
      dorianSeq.start();
      chordType = "Dorian";
    }
    else if (averageBrightness > 145.6 && averageBrightness <= 182) {
      for (var i = 0; i < modalSequences.length; i++){
        modalSequences[i].stop();
      }
      mixolydianSeq.start();
      chordType = "Mixolydian";
    }
    else if (averageBrightness > 182.0 && averageBrightness <= 218.4) {
      for (var i = 0; i < modalSequences.length; i++){
        modalSequences[i].stop();
      }
      ionianSeq.start();
      chordType = "Ionian";
    }
    else if (averageBrightness > 218.4 && averageBrightness <= 254.8) {
      for (var i = 0; i < modalSequences.length; i++){
        modalSequences[i].stop();
      }
      lydianSeq.start();
      chordType = "Lydian";
    }
    Tone.Transport.start();
  }

  else{
    playButton.value = "Play";
    isPlaying = false;
    Tone.Transport.stop();
  }
  console.log(averageBrightness);
}


// function keyReleased(){
//   if(keyCode === LEFT_ARROW){
//     averageBrightness = getAverageBrightness();
//     console.log(averageBrightness);
//     if (averageBrightness >= 0.0 && averageBrightness <= 36.4) {
//       Tone.Transport.start();
//       locrianSeq.start();
//       chordType = "Locrian";
//     }
//     else if (averageBrightness > 36.4 && averageBrightness <= 72.8) {
//       Tone.Transport.start();
//       phrygianSeq.start();
//       chordType = "Phrygian";
//     }
//     else if (averageBrightness > 72.8 && averageBrightness <= 109.2) {
//       Tone.Transport.start();
//       aeolianSeq.start();
//       chordType = "Aeolian";
//     }
//     else if (averageBrightness > 109.2 && averageBrightness <= 145.6) {
//       Tone.Transport.start();
//       dorianSeq.start();
//       chordType = "Dorian";
//     }
//     else if (averageBrightness > 145.6 && averageBrightness <= 182) {
//       Tone.Transport.start();
//       mixolydianSeq.start();
//       chordType = "Mixolydian";
//     }
//     else if (averageBrightness > 182.0 && averageBrightness <= 218.4) {
//       Tone.Transport.start();
//       ionianSeq.start();
//       chordType = "Ionian";
//     }
//     else if (averageBrightness > 218.4 && averageBrightness <= 254.8) {
//       Tone.Transport.start();
//       lydianSeq.start();
//       chordType = "Lydian";
//     }
//   }

//   if (keyCode == RIGHT_ARROW){
//     Tone.Transport.stop();
//   }
//   return false;
// }