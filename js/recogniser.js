(async () => {
  let trainedCounts = {}
  const constants = {
    EPOCH: 25,
    MIN_SAMPLES: 5
  }
  let baseRecognizer;
  loadModel()

  const directions = ["up", "left", "right", "down", "_background_noise_"]
  directions.forEach(dir => {
    trainedCounts[dir] = 0;
    UI.onTrainBtnDown(dir, () => listenForDir(dir))
  })

  async function loadModel() {
    UI.disableTrainBtns()
    UI.disableSpeechCommandBtn()
    UI.showMessage("Loding machine learning model. Please wait....🕑")
    baseRecognizer = speechCommands.create('BROWSER_FFT', 'directional4w');
    await baseRecognizer.ensureModelLoaded();
    UI.showMessageWithTimeout("Machine learning model loaded. You can now begin training")
    UI.enableSpeechCommandBtn("modelLoaded");    
    UI.enableTrainBtns()
    window.transferRecognizer = baseRecognizer.createTransfer('directions');
  }
  
  async function listenForDir(dir) {
    UI.showMessage(`Training for ${dir} direction`)
    await window.transferRecognizer.collectExample(dir)
    UI.setTrained(dir, ++trainedCounts[dir])
    UI.showMessageWithTimeout(`Model trained for ${dir} direction`, 3000)
  }
  
  UI.onBeginTrainDown(beginTraining)
  async function beginTraining() {
    if (!Object.values(trainedCounts).every(count => count >= constants.MIN_SAMPLES)) {
      UI.showMessageWithTimeout(
        `You have to train each direction for at least ${constants.MIN_SAMPLES} times`,
        4000
      )
      return
    }
    UI.showMessage("Training started...")
    await transferRecognizer.train({
      epochs: constants.EPOCH,
      callback: {
        onEpochEnd: async (epoch, logs) => {
          UI.showMessage(`
            Epoch ${epoch+1} of ${constants.EPOCH} complete. Loss: ${logs.loss}. Accuracy: ${logs.acc}`
          )
          console.log(`Epoch ${epoch}: loss=${logs.loss}, accuracy=${logs.acc}`);
        }
      }
    })
    UI.enableSpeechCommandBtn("trained")
  }
  
  UI.onDownloadExample(() => {
    const basename = `model-${(new Date()).toISOString()}`;
    const artifacts = window.transferRecognizer.serializeExamples(directions);
  
    // Trigger downloading of the data .bin file.
    const anchor = document.createElement('a');
    anchor.download = `${basename}.bin`;
    anchor.href = window.URL.createObjectURL(
        new Blob([artifacts], {type: 'application/octet-stream'}));
    anchor.click();
  });

  UI.onLoadExample(async (e) => {
    if (!e.target.files) return
    const file = e.target.files[0];
    const text = await file.arrayBuffer()
    console.log(text)
    window.transferRecognizer = baseRecognizer.createTransfer('new-directions');
    await window.transferRecognizer.loadExamples(text)
    trainedCounts = transferRecognizer.countExamples();
    Object.keys(trainedCounts).forEach(dir => {
      UI.setTrained(dir, trainedCounts[dir])
    })
    const modelNumFrames = transferRecognizer.modelInputShape()
    console.log({ trainedCounts, modelNumFrames })
    UI.enableSpeechCommandBtn("trained")    
  })
})()
