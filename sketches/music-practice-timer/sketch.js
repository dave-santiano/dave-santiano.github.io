var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var taskInput, taskSubmitButton, taskPrompt;
var hoursDropDown, minutesDropDown, secondsDropDown;
var startButton, pauseButton;
var clearButton;
var practiceList = [];
var currentTaskIndex = 0;
var currentTaskNoteIndex = 0;
var practiceStarted = false;
var longestName;
var redValue, greenValue, blueValue;
var canvas;
var synth = new Tone.Synth().toMaster();
var chromaticScale = ["C4", "Db4", "D4", "Eb4", "E4", "F4", "Gb4", "G4", "Ab4", "A4", "Bb4", "B4"];

var taskChangeJingle = new Tone.Sequence(function(time, note){
  synth.triggerAttackRelease(note, "8n", time);
}, chromaticScale, "8n").start(0);

taskChangeJingle.probability = .5;



function Task(taskName, time, isFinished){
  this.taskName   = taskName;
  this.time       = time;
  this.isFinished = isFinished;
  this.isPaused   = false;
  

  //This will set the initial time from seconds into clock time
  var hours   = Math.floor(time / 3600);
  var minutes = Math.floor(time / 60) % 60;
  var seconds = Math.floor(time % 60);

  if(hours <= 9){
    hours   = "0" + hours;
  }
  if(minutes <= 9){
    minutes = "0" + minutes;
  }
  if(seconds <= 9){
    seconds = "0" + seconds;
  }

  this.clockTime = hours + ":" + minutes + ":" + seconds;

  this.finishedPracticeEvent = function(){
    this.isFinished = true;
  };

  this.countDown = function(){
    var self    = this;
    let hours   = Math.floor(this.time / 3600);
    let minutes = Math.floor(this.time / 60) % 60;
    let seconds = Math.floor(this.time % 60);

    if(hours <= 9){
      hours   = "0" + hours;
    }
    if(minutes <= 9){
      minutes = "0" + minutes;
    }
    if(seconds <= 9){
      seconds = "0" + seconds;
    }
    this.clockTime = hours + ":" + minutes + ":" + seconds;

    //decrement the time in milliseconds
    this.time -= 0.1;

    if (this.time <= 0){
      this.finishedPracticeEvent();
    }
    else if(this.time > 0 && this.isFinished != true && this.isPaused != true){
      setTimeout(function(){self.countDown()}, 100);
    }
    else{
      console.log("currently paused");
    }
  };
}


function setup(){
  canvas = createCanvas(screenWidth, screenHeight);

  redValue   = 200;
  greenValue = 120;
  blueValue  = 120;

  taskInput = createInput();
  taskInput.position(20, 65);

  taskSubmitButton = createButton('submit');
  taskSubmitButton.position(taskInput.x + taskInput.width, 65);
  taskSubmitButton.mousePressed(addToList);

  hoursDropDown    = createSelect();
  minutesDropDown  = createSelect();
  secondsDropDown  = createSelect();

  hoursDropDown.position(20, taskInput.y + 50);
  minutesDropDown.position(30 + hoursDropDown.width, taskInput.y + 50);
  secondsDropDown.position(40 + hoursDropDown.width + minutesDropDown.width, taskInput.y + 50);
  
  for(var i = 0; i < 60; i++){
    hoursDropDown.option(i); 
    minutesDropDown.option(i); 
    secondsDropDown.option(i);
  }
  
  startButton = createButton("Start Practice");
  startButton.position(20, taskInput.y + 100);
  startButton.mousePressed(startPractice);

  pauseButton = createButton("Pause");
  pauseButton.position(20, taskInput.y + 200);
  pauseButton.mousePressed(pausePractice);

  clearButton = createButton("Clear List");
  clearButton.position(20, taskInput.y + 150);
  clearButton.mousePressed(clearList);

  taskPrompt = createElement('h1', "Enter in a practice task! Time in the drop down HH:MM:SS");
  taskPrompt.addClass("prompt");
  taskPrompt.position(20, 5);
  
}

function draw(){
  background(redValue, greenValue, blueValue);
  if (practiceList != null){
    drawPracticeList();
  }
}

function drawPracticeList(){
  for (var i = 0; i < practiceList.length; i++){
    textSize(70);
    if(practiceStarted != true){
      calculateLongestTaskName();
    }
    text(practiceList[i].clockTime, screenWidth/2 + 300, 200 +  ( i * 100 ));
    text(i + 1 + "." + practiceList[i].taskName,   (screenWidth/2 + 300) - textWidth(longestName.taskName) - (textWidth(practiceList[i].clockTime)/2), 200 +  ( i * 100 ));
    if(practiceList[i].isFinished === true){
      let finishedTaskIndex = i;
      iteratePracticeList(finishedTaskIndex);
    }
  }
}

function calculateLongestTaskName(){
  if (practiceList.length == 1){
    longestName = practiceList[0];
  }
  else{
    longestName = practiceList[0];
    for(var i = 0; i < practiceList.length; i++){
      if(practiceList[i].taskName.length > longestName.taskName.length){
        longestName = practiceList[i];
        console.log(longestName.taskName);
      }
    }
  }
}

function iteratePracticeList(finishedTaskIndex){
  redValue   = random(80, 200);
  blueValue  = random(80, 200);
  greenValue = random(80, 200);

  playTaskChangeJingle();

  practiceList[finishedTaskIndex].isFinished = false;
  
  currentTaskIndex += 1;
  if(currentTaskIndex != practiceList.length){
    practiceList[currentTaskIndex].countDown();
  }
  else{
    console.log("we are finished with practice!");
  }
}

function addToList(){
  var task = taskInput.value();
  var time = convertToSeconds(hoursDropDown.value(), minutesDropDown.value(), secondsDropDown.value());
  if(task == ""){
    alert("Please enter in a valid input");
  }
  else{
    var newTask = new Task(task, time, false);
    practiceList.push(newTask);
  }
}

function startPractice(){
  practiceList[0].countDown();
  practiceStarted  = true;
  currentTaskIndex = 0;
}

function pausePractice(){
  if(practiceList[currentTaskIndex].isPaused != true){
    practiceList[currentTaskIndex].isPaused = true;
  }
  else{
    practiceList[currentTaskIndex].isPaused = false;
    practiceList[currentTaskIndex].countDown();
  }
}

function clearList(){
  practiceList = [];
}

//easier to do calculations when it's all in seconds, maybe?
function convertToSeconds(hours, minutes, seconds){
  var timeToSeconds = (hours * 3600) + (minutes * 60) + (seconds * 1);
  return timeToSeconds;
}

//Go up the chromatic scale step-wise whenever a task is completed!
function playTaskChangeJingle(){
  synth.triggerAttackRelease(chromaticScale[currentTaskNoteIndex], "8n");
  if(currentTaskNoteIndex > practiceList.length){
    currentTaskNoteIndex = 0;
  }
  else{
    currentTaskNoteIndex +=1;
  }
}

//resize canvas on window resize
window.onresize = function(){
  screenWidth  = window.innerWidth;
  screenHeight = window.innerHeight;
  canvas.size(screenWidth, screenHeight);
}      