var timeUpdate;
var aTime = -1, bTime = -1;

var sound = new Howl({
    src: ['littlewing.mp3'],
    html5: true, //  keeps pitch consistent when changing speed
    onend: function() {
      document.getElementById("toggleButton").innerHTML = "Play"
    },
});

function toggleSong() {
  if (sound.playing()) {
    sound.pause();
    document.getElementById("toggleButton").innerHTML = "Play";
    clearInterval(timeUpdate); //  stops time bar
  } 
  else {
    sound.play();
    document.getElementById("toggleButton").innerHTML = "Pause";
    timeUpdate = setInterval(rollingTimeUpdate, 1); //  starts time bar
  }
}

function forwardFiveS() {
  var currentTime = sound.seek();
  if (currentTime + 5 > sound.duration()) {
    sound.stop();
    document.getElementById("toggleButton").innerHTML = "Play";
    return;
  }
  sound.seek(currentTime + 5);
}

function backwardFiveS() {
  var currentTime = sound.seek();
  if (currentTime - 5 < 0) {
    sound.seek(0);
    return;
  }
  sound.seek(currentTime - 5);
}

function updateVol(newVolume) {
  sound.volume(newVolume);
}

function updateSpeed(newSpeed) {
  sound.rate(newSpeed);
}

function updateTime(newTime) {
  convertedTime = (newTime * sound.duration());  // newTime is from 0-1
  sound.seek(convertedTime);
}

function rollingTimeUpdate() { //  makes the song loop through A-B
  document.getElementById("timeBar").value = sound.seek() / sound.duration();
  if (document.getElementById("timeBar").value * sound.duration() >= bTime && bTime != -1) {
    document.getElementById("timeBar").value = aTime;
    sound.seek(aTime);
  }
}

// ab = a-enabled b-disabled
// Ab = if a clicked = update a | if b clicked = update b
// AB = if new a < b = only update a | if new a > b = update b reset b

function setStartLoop() {
  if (aTime == -1) {  // A is new
    aTime = document.getElementById("timeBar").value * sound.duration();
    document.getElementById("bButton").disabled = false;
  }
  else { // A has already been clicked
    aTime = -1;
    bTime = -1;
    document.getElementById("bButton").disabled = true;
  }
}

function setEndLoop() {
  if (bTime == -1)
    bTime = document.getElementById("timeBar").value * sound.duration();
  else 
    bTime = -1;
}

window.onload = function() {
  document.getElementById("bButton").disabled = true;
  document.getElementById("toggleButton").addEventListener("click", toggleSong);
  document.getElementById("forwButton").addEventListener("click", forwardFiveS);
  document.getElementById("backButton").addEventListener("click", backwardFiveS);
  document.getElementById("aButton").addEventListener("click", setStartLoop);
  document.getElementById("bButton").addEventListener("click", setEndLoop);  
}