/*
  Begin Global Variables
*/

  // Video sources
  var VIDEOS = [
    "http://angrave.github.io/sysassets/mp4/0010-HelloWorld-v2.mp4",
    "http://angrave.github.io/sysassets/mp4/0020-HelloStdErr-24fps600kbs.mp4",
    "http://angrave.github.io/sysassets/mp4/0030-OpenCreateAFile-650kb.mp4",
    "http://angrave.github.io/sysassets/mp4/0040-OpenErrorsPrintf-600kbs.mp4",
  ];

  // Data structure that holds transcriptions. Looks something like the following
  // [ {start: "0:00", end: "0:10", text:"Conditional variables are cool"}, ... ]
  var transcriptions = [];

  // Video anchor used to define when the current transcription segment started
  var anchor = "0:00";

/*
  End Global Variables
*/

$(document).ready(function () {
  begin();
});

/*
  Started once the DOM finishes loading
*/
function begin() {
  changePlaybackSpeed();
  bindEventListeners();
}

/*
  Binds event listeners on input elements
*/
function bindEventListeners() {
  $(".video-selector").change(loadVideo);
  $(".playback-selector").change(changePlaybackSpeed);
  $(".transcription-input").keypress(inputKeypress);
}

/*
  Loads the selected video
*/
function loadVideo() {
  var videoIndex = parseInt($(".video-selector").val(), 10) - 1;
  var videoSrc = VIDEOS[videoIndex];
  $(".main-video-source").attr("src", videoSrc);
  $(".main-video").get(0).load();
}

/*
  Changes the playback speed
*/
function changePlaybackSpeed() {
  var playbackRate = parseFloat($(".playback-selector").val());
  $(".main-video").get(0).playbackRate = playbackRate;
}

/*
  Captures the input keypresses and reacts accordingly
*/
function inputKeypress(e) {
  if (e.which === 13) {
    solidifyTranscription(e);
  } else if (e.which === 96) {
    e.preventDefault();
    rewindFiveSeconds();
  } else if (e.which === 126) {
    e.preventDefault();
    toggleVideo();
  }
}

/*
  Rewind the video 5 seconds
*/
function rewindFiveSeconds() {
  var video = $(".main-video").get(0);
  video.currentTime = video.currentTime - 5;
}

/*
  Changes the video play/pause
*/
function toggleVideo() {
  var video = $(".main-video").get(0);
  if (video.paused == false) {
      video.pause();
  } else {
      video.play();
  }
}

/*
  Detects enter key and solidifies transcription in the event of an enter key
*/
function solidifyTranscription(e) {
  var transcriptionSegmentText = $(".transcription-input").val();
  var currentTime = getCurrentTime();

  var transcriptionSegment = {
    start: anchor,
    end: currentTime,
    text: transcriptionSegmentText
  };

  transcriptions.push(transcriptionSegment);

  anchor = currentTime;

  var transcriptionSegmentTemplate = '<div class="transcription-segment">'
                                   + transcriptionSegment.start + " - " + transcriptionSegment.end + " : " + transcriptionSegment.text
                                   + '</div>';

  $(".transcription-container").prepend(transcriptionSegmentTemplate);
  $(".transcription-input").val("");
}

/*
  Returns the current time nicely formatted
*/
function getCurrentTime() {
  var currentTime = $(".main-video").get(0).currentTime;

  var currentTimeInMinutes = Math.floor(currentTime / 60);
  var currentTimeInSeconds = Math.floor(currentTime % 60);

  if (currentTimeInSeconds < 10) {
    return currentTimeInMinutes + ":0" + currentTimeInSeconds;
  }
  return currentTimeInMinutes + ":" + currentTimeInSeconds;
}