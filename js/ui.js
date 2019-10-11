(() => {
  const startBtn = document.querySelector("#start-btn");
  const messageBox = document.querySelector("#message-box");

  window.ui = {
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
    disable() {
      startBtn.setAttribute("disabled", true);
    },
    showMessage(text) {
      messageBox.textContent = text
    },
    clearMessage() {
      messageBox.textContent = ""
    },
    enable: (function() {
      const enablers = {
        modelLoaded: false,
        gameOn: false,
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
  };
})();
