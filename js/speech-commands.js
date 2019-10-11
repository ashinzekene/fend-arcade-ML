(() => {
  const recognizer = speechCommands.create("BROWSER_FFT", "directional4w");
  const probabilityThreshold = 0.75;

  const init = async () => {
    ui.disable();
    await recognizer.ensureModelLoaded();
    ui.enable("modelLoaded");
  };
  init();

  function listen() {
    recognizer
      .listen(
        result => {
          const results = recognizer.wordLabels().map((w, i) => [w, result.scores[i]]);
          handleSpeechCommands(results);
        },
        {
          probabilityThreshold,
        },
      )
      .then(() => {
        console.log("Streaming recognition started.");
      })
      .catch(err => {
        console.log("ERROR: Failed to start streaming display: " + err.message);
      });
  }

  // Stop the recognition in 10 seconds.
  function stopListening() {
    console.log("Streaming recognition stopped.");
    recognizer.stopListening();
  }

  ui.onStartListen(listen);
  ui.onStopListen(stopListening);

  function handleSpeechCommands(results) {
    results.sort((a, b) => b[1] - a[1]);
    const command = results[0];
    player.handleInput(command[0]);
  }
})();
