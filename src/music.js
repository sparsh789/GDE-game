import { song, endSong, hitSfx } from "./songs.js";
import CPlayer from "./musicplayer.js";

const mainTune = document.createElement("audio");
const hitfx = document.createElement("audio");
const endTune = document.createElement("audio");

export const initMusicPlayer = (audioTrack, tune, isLooped) => {
  return new Promise(resolve => {
    var songplayer = new CPlayer();
    // Initialize music generation (player).
    songplayer.init(tune);
    // Generate music...
    var done = false;
    setInterval(function() {
      if (done) {
        return;
      }
      done = songplayer.generate() >= 1;
      if (done) {
        // Put the generated song in an Audio element.
        var wave = songplayer.createWave();
        audioTrack.src = URL.createObjectURL(
          new Blob([wave], { type: "audio/wav" })
        );
        audioTrack.loop = isLooped;
        resolve();
      }
    }, 0);
  });
};

export const initialize = () => {
  return Promise.all([
    initMusicPlayer(mainTune, song, true),
    initMusicPlayer(hitfx, hitSfx, false),
    initMusicPlayer(endTune, endSong, false)
  ]);
};

export const playTune = tune => {
  switch (tune) {
    case "main": {
      mainTune.currentTime = 0;
      mainTune.volume = 0.9;
      var promise = mainTune.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            // Autoplay started!
          })
          .catch(error => {
            console.log("No for autoplay!" + error);
            // Autoplay was prevented.
          });
      }
      break;
    }
    case "end": {
      endTune.play();
      var currentVolume = mainTune.volume;
      var fadeOutInterval = setInterval(function() {
        currentVolume = (parseFloat(currentVolume) - 0.2).toFixed(1);
        if (currentVolume >= 0.0) {
          mainTune.volume = currentVolume;
        } else {
          mainTune.pause();
          clearInterval(fadeOutInterval);
        }
      }, 100);
      break;
    }
    case "hit": {
      hitfx.currentTime = 0;
      hitfx.play();
      break;
    }
  }
};
