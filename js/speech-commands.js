(() => {
  const recognizer = speechCommands.create("BROWSER_FFT", "directional4w");
  const probabilityThreshold = 0.55;

  function listen() {
    console.log(window.transferRecognizer.countExamples())
    if (!window.transferRecognizer) return
    window.transferRecognizer.listen(result => {
      console.log(result.scores)
      const results = transferRecognizer.wordLabels().map((w, i) => [w, result.scores[i]]);
      handleSpeechCommands(results);
    },
    {
      probabilityThreshold,
    })
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

  UI.onStartListen(listen);
  UI.onStopListen(stopListening);

  function handleSpeechCommands(results) {
    results.sort((a, b) => b[1] - a[1]);
    const command = results[0];
    player.handleInput(command[0]);
  }
})();
