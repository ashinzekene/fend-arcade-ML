(() => {
  const startBtn = document.querySelector("#start-btn");
  const messageBox = document.querySelector("#message-box");
  const trainBtns = document.querySelectorAll(".train-btn");
  const trainContainer = document.querySelector(".train");
  const beginTrainBtn = document.querySelector("#begin-training");

  function dirBtnClicked(dir, e) {
    return e.target.id === `train-${dir}` ||
      e.target.parentElement.id === `train-${dir}`
  }
  
  window.UI = {
    onStartListen(fn) {
      startBtn.addEventListener("pointerdown", e => {
        if (e.target.getAttribute("disabled")) return;
        fn(e);
      });
    },
    onStopListen(fn) {
      startBtn.addEventListener("pointerup", e => {
        if (e.target.getAttribute("disabled")) return;
        fn(e);
      });
    },
    disableSpeechCommandBtn() {
      startBtn.setAttribute("disabled", true);
    },
    showMessage(text) {
      messageBox.textContent = text
    },
    showMessageWithTimeout(text, timeout=2000) {
      messageBox.textContent = text
      setTimeout(() => messageBox.textContent = "", timeout)
    },
    clearMessage() {
      messageBox.textContent = ""
    },
    enableSpeechCommandBtn: (function() {
      const enablers = {
        modelLoaded: false,
        gameOn: false,
        trained: false,
      };
      function tryToEnable() {
        if (Object.values(enablers).every(v => v)) {
          startBtn.removeAttribute("disabled");
        }
      }
      return type => {
        enablers[type] = true;
        tryToEnable();
      };
    })(),
   disableTrainBtns() {
     trainBtns.forEach(btn => btn.setAttribute("disabled", true))
    },
    enableTrainBtns() {
      trainBtns.forEach(btn => btn.removeAttribute("disabled"))
   },
    onTrainBtnDown(dir, fn) {
      trainContainer.addEventListener("click", e => {
        if (!dirBtnClicked(dir, e)) return
        fn(e)
      })
    },
    setTrained(dir, count) {
      const button = document.querySelector(`#train-${dir}`)
      if (!button) return
      button.firstElementChild.textContent = `${count} trains`;
      button.style.backgroundColor = "#99AAFF"
    },
    onBeginTrainDown(fn) {
      beginTrainBtn.addEventListener("click", fn)
    }
  };
})();
