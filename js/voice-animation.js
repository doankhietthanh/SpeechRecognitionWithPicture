export function timeout() {
  document.querySelector(".blue").style.animation =
    "updown 1.2s infinite ease-in-out alternate";
  document.querySelector(".red").style.animation =
    "updown 1.2s 0.2s infinite ease-in-out alternate";
  document.querySelector(".yellow").style.animation =
    "updown 1.2s 0.4s infinite ease-in-out alternate";
  document.querySelector(".green").style.animation =
    "updown 1.2s 0.6s infinite ease-in-out alternate";
  setTimeout(function () {
    document.querySelector(".blue").style.animation = "sound-1 1.4s";
    document.querySelector(".red").style.animation = "sound-2 1.4s 0.25s";
    document.querySelector(".yellow").style.animation = "sound-1 1.4s 0.10s";
    document.querySelector(".green").style.animation = "sound-2 1.4s 0.15s";
    setTimeout(function () {
      document.querySelector(".blue").style.animation = "finalani 0.4s";
      document.querySelector(".red").style.animation = "finalani 0.4s 0.05s";
      document.querySelector(".yellow").style.animation = "finalani 0.4s 0.1s";
      document.querySelector(".green").style.animation = "finalani 0.4s 0.15s";
      setTimeout(function () {
        timeout();
      }, 550);
    }, 1190);
  }, 3000);
}

export const voiceAnimationSleazy = () => {
  document.querySelector(".blue").style.animation =
    "updown 1.2s infinite ease-in-out alternate";
  document.querySelector(".red").style.animation =
    "updown 1.2s 0.2s infinite ease-in-out alternate";
  document.querySelector(".yellow").style.animation =
    "updown 1.2s 0.4s infinite ease-in-out alternate";
  document.querySelector(".green").style.animation =
    "updown 1.2s 0.6s infinite ease-in-out alternate";
};

export const voiceAnimationUndulating = () => {
  document.querySelector(".blue").style.animation = "sound-1 1.4s infinite";
  document.querySelector(".red").style.animation =
    "sound-2 1.4s 0.25s infinite";
  document.querySelector(".yellow").style.animation =
    "sound-1 1.4s 0.10s infinite";
  document.querySelector(".green").style.animation =
    "sound-2 1.4s 0.15s infinite";
};

export const voiceAnimationRipple = () => {
  document.querySelector(".blue").style.animation = "finalani 0.4s";
  document.querySelector(".red").style.animation = "finalani 0.4s 0.05s";
  document.querySelector(".yellow").style.animation = "finalani 0.4s 0.1s";
  document.querySelector(".green").style.animation = "finalani 0.4s 0.15s";
};
