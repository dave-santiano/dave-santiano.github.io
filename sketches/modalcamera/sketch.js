/* This is needed after the new Chrome update, start the audio context manually*/
if (Tone.context.state !== "running"){
  Tone.context.resume();
}

document.documentElement.addEventListener(
  "mousedown", function(){
    mouse_IsDown = true;
    if(Tone.context.state !== "running"){
      Tone.context.resume();
}})
/* ----------------------------*/


var video;
var synth = new Tone.Synth().toMaster();
var playedSynth = new Tone.Synth().toMaster();

var kick = new Tone.MembraneSynth({
  "envelope" :   {
    "sustain" : 0,
    "attack" : 0.02,
    "decay" : 0.3
  },
  "octaves" : 10
}).toMaster();

var snare = new Tone.NoiseSynth({
  "envelope" : {
    "attack" : 0.001,
    "decay" : 0.2,
    "sustain" : 0
  },
  "filterEnvelope" : {
    "attack" : 0.001,
    "decay" : 0.1,
    "sustain" : 0
  }
}).toMaster();

var bass =  new Tone.MonoSynth({
  "volume" : -10,
  "envelope" : {
    "attack" : 0.1,
    "decay" : 0.3,
    "release" :2,
  },
  "filterEnvelope" : {
    "attack" : 0.001,
    "decay" : 0.01,
    "sustain" : 0.5,
    "baseFrequency" : 200,
    "octaves" : 2.6
  }  
}).toMaster();



var snarePart = new Tone.Loop(function(time){
  snare.triggerAttack(time);
  notes.push(new Note("snare"));
}, "2n").start("4n");



var kickPart = new Tone.Loop(function(time){
  kick.triggerAttack("C2", time);
  notes.push(new Note("kick"));
}, "2n").start();

var bassPart = new Tone.Loop(function(time){
  bass.triggerAttackRelease("C2", "8n", time);
}, "2n").start();


/* Modal Scales, in C*/
var locrianScale = ['C4', 'Db4', 'Eb4', 'F4', 'Gb4', 'Ab4', 'Bb4', 'C5'];
var phrygianScale = ['C4', 'D4', 'Eb4', 'F4', 'Gb4', 'Ab4', 'Bb4', 'C5'];
var aeolianScale = ['C4', 'D4', 'Eb4', 'F4', 'G4', 'Ab4', 'Bb4', 'C5'];
var dorianScale = ['C4', 'D4', 'F4',  'Eb4', 'G4', 'A4', 'Bb4', 'C5'];
var mixolydianScale = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'Bb4', 'C5'];
var ionianScale = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
var lydianScale = ['C4', 'D4', 'E4', 'F#4', 'G4','A4', 'B4', 'C5'];



/*  MODAL SEQUENCES */
var locrianSeq = new Tone.Sequence(function(time, note){
  synth.triggerAttackRelease(note, "8n", time);
  Tone.Draw.schedule(function(){
      redValue = random(0,30);
      blueValue = random(0,30);
      greenValue = random(0,30);
      notes.push(new Note("eighthNote"));

      if (videoAmount <= 3){
        videoAmount += 1;
      }else{
        videoAmount = 1;
      }
  }, time);
}, locrianScale, "8n").start(0);


var phrygianSeq = new Tone.Sequence(function(time, note){
  synth.triggerAttackRelease(note, "8n", time);
  Tone.Draw.schedule(function(){
      redValue = random(30, 70);
      blueValue = random(30, 70);
      greenValue = random(30, 70);
      notes.push(new Note("eighthNote"));
      if (videoAmount <= 3){
        videoAmount += 1;
      }else{
        videoAmount = 1;
      }
  }, time);
}, phrygianScale, "8n").start(0);



var aeolianSeq = new Tone.Sequence(function(time, note){
  synth.triggerAttackRelease(note, "8n", time);
  Tone.Draw.schedule(function(){
      redValue = random(70,120);
      blueValue = random(70,120);
      greenValue = random(70,120);
      notes.push(new Note("eighthNote"));
      if (videoAmount <= 3){
        videoAmount += 1;
      }else{
        videoAmount = 1;
      }
  }, time);
}, aeolianScale, "8n").start(0);


var dorianSeq = new Tone.Sequence(function(time, note){
  synth.triggerAttackRelease(note, "8n", time);
  Tone.Draw.schedule(function(){
      redValue = random(120,160);
      blueValue = random(120,160);
      greenValue = random(120,160);
      notes.push(new Note("eighthNote"));
      if (videoAmount <= 3){
        videoAmount += 1;
      }else{
        videoAmount = 1;
      }
  }, time);
}, dorianScale, "8n").start(0);


var mixolydianSeq = new Tone.Sequence(function(time, note){
  synth.triggerAttackRelease(note, "8n", time);
  Tone.Draw.schedule(function(){
      redValue = random(160,200);
      blueValue = random(160,200);
      greenValue = random(160,200);
      notes.push(new Note("eighthNote"));
      if (videoAmount <= 3){
        videoAmount += 1;
      }else{
        videoAmount = 1;
      }
  }, time);
}, mixolydianScale, "8n").start(0);



var ionianSeq = new Tone.Sequence(function(time, note){
  synth.triggerAttackRelease(note, "8n", time);
  Tone.Draw.schedule(function(){
      redValue = random(200,225);
      blueValue = random(200,225);
      greenValue = random(200,225);
      notes.push(new Note("eighthNote"));
      if (videoAmount <= 3){
        videoAmount += 1;
      }else{
        videoAmount = 1;
      }
  }, time);
}, ionianScale, "8n").start(0);


var lydianSeq = new Tone.Sequence(function(time, note){
  synth.triggerAttackRelease(note, "8n", time);
  Tone.Draw.schedule(function(){
      redValue = random(225,255);
      blueValue = random(225,255);
      greenValue = random(225,255);
      notes.push(new Note("eighthNote"));
      if (videoAmount <= 3){
        videoAmount += 1;
      }else{
        videoAmount = 1;
      }
  }, time);
}, lydianScale, "8n").start(0);

var modalSequences = [locrianSeq, phrygianSeq, aeolianSeq, dorianSeq, mixolydianSeq, ionianSeq, lydianSeq];
var loadedScale;

for (var i = 0; i < modalSequences.length; i++){modalSequences[i].loop = true;}
for (var i = 0; i < modalSequences.length; i++){modalSequences[i].probability = .5;}
/* End modal sequence shtuff*/



var chordType = "good";
var averageBrightness = 0.0;
var redValue;
var greenValue;
var blueValue;

screenWidth = window.innerWidth;
screenHeight = window.innerHeight;

var playButton;
var isPlaying;

var videoAmount = 1;

var numNotes = 1;
var notes = [];

var eighthNote;
var tiedNote;
var snareCharacter;
var kickDrum;
var eighthNoteCharacter;
var noteName;

var firstPlay = false;

function Note(noteName){
  this.x = -10;
  this.y = height/2;
  this.noteChosen;
  this.velocity = 1;
  this.eighthNote = eighthNote;
  this.eighthNoteCharacter = eighthNoteCharacter;
  this.kickDrumCharacter = kickDrumCharacter;
  this.snareDrumCharacter = snareDrumCharacter;
  this.t = random(0,1);
  this.tInc = TWO_PI/980;
  this.modifier = 0;
  
  if (noteName == "snare"){
    this.noteChosen = this.snareDrumCharacter;
    this.modifier = 100;
  }
  if (noteName == "kick"){
    this.noteChosen = this.kickDrumCharacter;
    this.modifier = 100;
  }
  if (noteName == "eighthNote"){
    var randomizedChoice = random(0,1);
    if (randomizedChoice <= .50){
      this.noteChosen = this.eighthNote;
    }
    else if(randomizedChoice > .50) {
      this.noteChosen = this.eighthNoteCharacter;
    }
  }

  this.move = function(){
    this.x += 5;
    for( var i = 0; i < 25; i++){
      this.y = ((sin(this.t) * 40) + height/2 + this.modifier);
      this.t += this.tInc;
    }
  };

  this.display = function(){
    image(this.noteChosen, this.x, this.y);
  };
}


var stopButtonImage;
var playButtonImage;

function preload(){
  coolFont = loadFont('assets/ProggySquare.ttf')
  eighthNote = loadImage("assets/eighth_note.png");
  tiedNote = loadImage("assets/tied_note.png");
  snareDrumCharacter = loadImage("assets/snare_drum.png");
  kickDrumCharacter = loadImage("assets/kick_drum.png");
  eighthNoteCharacter = loadImage("assets/eighth_note_character.png");
  stopButtonImage = loadImage("assets/stop_button.png");
  playButtonImage = loadImage("assets/play_button.png");
  keyBoardImage = loadImage("assets/keyboard.png");
  questionIcon = loadImage("assets/question_mark.png");

}



function setup() {
  redValue = random(0,255);
  blueValue = random(0,255);
  greenValue = random(0,255);
  textFont(coolFont);
  Tone.Transport.bpm.value = 90;

  createCanvas(screenWidth, screenHeight);
  video = createCapture(VIDEO);
  pixelDensity(1);
  video.size(320, 240);
  video.hide();
}



var videoWidth = 320;
var videoHeight = 240;


function mouseClicked(){
  if (mouseX < width/2 + 75 && mouseX > width/2 - 75 && mouseY < 300 + 75 && mouseY > 300 -75){
    playSong();
    if(!firstPlay){
      firstPlay = true;
    }
  }
}


function draw() {
  background(redValue, greenValue, blueValue);


  var xPos = 0;
  var yPos = 0;

  textAlign(CENTER);
  rectMode(CENTER);
  textSize(42);
  text("You look very " + chordType + " today ;)", width/2, 200);
  
  
  if(firstPlay){
    imageMode(CENTER);
    image(keyBoardImage, width/2,  height - 200, 400, 200);
    textAlign(CENTER);
    textSize(24);
    text("Try pressing A -> K to play the notes of the scale! Press O for a kick and P for a snare.", width/2, height - 300);
  }
  
  imageMode(CORNER);

  for(var i = 0; i < videoAmount; i++){
    image(video, xPos, yPos, videoWidth, videoHeight);
    if(videoAmount >= 2){
      image(video, width - videoWidth, yPos, videoWidth, videoHeight);
    }
    if(videoAmount >= 3){
      image(video, 0, height - videoHeight, videoWidth, videoHeight);
    }
    if(videoAmount >= 4){
      image(video, width - videoWidth, height - videoHeight, videoWidth, videoHeight);
    }
  }
  
  for (var i = 0; i < notes.length; i++){
    notes[i].move();
    notes[i].display();
    if (notes[i].x > width){
      notes.splice(i, 1);
    }
  }

  imageMode(CENTER);
  if(!isPlaying){
    video.loadPixels();
    if (mouseX < width/2 + 75 && mouseX > width/2 - 75 && mouseY < 300 + 75 && mouseY > 300 - 75){
      image(playButtonImage, width/2, 300, 150, 150);
    }
    else{
      image(playButtonImage, width/2, 300, 100, 100);
    }
  }
  else{
    if (mouseX < width/2 + 75 && mouseX > width/2 - 75 && mouseY < 300 + 75 && mouseY > 300 - 75){
      image(stopButtonImage, width/2, 300, 150, 150);
    }else{
      image(stopButtonImage, width/2, 300, 100, 100);
    }
  }
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
  if (!isPlaying){
    isPlaying = true;
    averageBrightness = getAverageBrightness();

    if (averageBrightness >= 0.0 && averageBrightness <= 36.4) {
      for (var i = 0; i < modalSequences.length; i++){
        modalSequences[i].stop();
      }
      locrianSeq.start();
      loadedScale = locrianScale;
      chordType = "Locrian";
    }
    else if (averageBrightness > 36.4 && averageBrightness <= 72.8) {
      for (var i = 0; i < modalSequences.length; i++){
        modalSequences[i].stop();
      }
      phrygianSeq.start();
      loadedScale = phrygianScale;

      chordType = "Phrygian";
    }
    else if (averageBrightness > 72.8 && averageBrightness <= 109.2) {
      for (var i = 0; i < modalSequences.length; i++){
        modalSequences[i].stop();
      }
      aeolianSeq.start();
      loadedScale = aeolianScale;
      chordType = "Aeolian";
    }
    else if (averageBrightness > 109.2 && averageBrightness <= 145.6) {
      for (var i = 0; i < modalSequences.length; i++){
        modalSequences[i].stop();
      }
      dorianSeq.start();
      loadedScale = dorianScale;
      chordType = "Dorian";
    }
    else if (averageBrightness > 145.6 && averageBrightness <= 182) {
      for (var i = 0; i < modalSequences.length; i++){
        modalSequences[i].stop();
      }
      mixolydianSeq.start();
      loadedScale = mixolydianScale;
      chordType = "Mixolydian";
    }
    else if (averageBrightness > 182.0 && averageBrightness <= 218.4) {
      for (var i = 0; i < modalSequences.length; i++){
        modalSequences[i].stop();
      }
      ionianSeq.start();
      loadedScale = ionianScale;
      chordType = "Ionian";
    }
    else if (averageBrightness > 218.4 && averageBrightness <= 254.8) {
      for (var i = 0; i < modalSequences.length; i++){
        modalSequences[i].stop();
      }
      lydianSeq.start();
      loadedScale = lydianScale;
      chordType = "Lydian";
    }
    Tone.Transport.start("+0.1");
  }
  else{
    videoAmount = 1;
    isPlaying = false;
    Tone.Transport.stop();
  }
}


function keyTyped(){
  if (key === 'a'){
    notes.push(new Note("eighthNote"));
    playedSynth.triggerAttackRelease(loadedScale[0], '8n');
  }
  if (key === 's'){
    notes.push(new Note("eighthNote"));
    playedSynth.triggerAttackRelease(loadedScale[1], '8n');
  }
  if (key === 'd'){
    notes.push(new Note("eighthNote"));
    playedSynth.triggerAttackRelease(loadedScale[2], '8n');
  }
  if (key === 'f'){
    notes.push(new Note("eighthNote"));
    playedSynth.triggerAttackRelease(loadedScale[3], '8n');
  }
  if (key === 'g'){
    notes.push(new Note("eighthNote"));
    playedSynth.triggerAttackRelease(loadedScale[4], '8n');
  }
  if (key === 'h'){
    notes.push(new Note("eighthNote"));
    playedSynth.triggerAttackRelease(loadedScale[5], '8n');
  }
  if (key === 'j'){
    notes.push(new Note("eighthNote"));
    playedSynth.triggerAttackRelease(loadedScale[6], '8n');
  }
  if (key === 'k'){
    notes.push(new Note("eighthNote"));
    playedSynth.triggerAttackRelease(loadedScale[7], '8n');
  }
  if (key === 'o'){
    notes.push(new Note("kick"));
    kick.triggerAttack("C2");
  }
  if (key === 'p'){
    notes.push(new Note("snare"));
    snare.triggerAttack();
  }
}