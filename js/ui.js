(() => {
  const startBtn = document.querySelector("#start-btn");

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
    enable: (function() {
      const enablers = {
        modelLoaded: false,
        gameOn: false,
      };
      function tryToEnable() {
        console.log(Object.values(enablers));
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
