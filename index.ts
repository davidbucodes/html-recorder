import { Button } from "./button";
import { Audio } from "./audio";
import { Recorder } from "./recorder";

let recorder: Recorder;

const buttonsContainer = document.createElement("div");
document.body.appendChild(buttonsContainer);
const allAudioContainer = document.createElement("div");
document.body.appendChild(allAudioContainer);

new Button().init("Start", buttonsContainer, async () => {
  if (!recorder) {
    recorder = new Recorder();
  }

  await recorder.start();
});
new Button().init("Stop", buttonsContainer, async () => {
  const { base64Audio } = await recorder.stop();
  console.log(base64Audio);
  const audioContainer = document.createElement("div");
  audioContainer.appendChild(new Audio("audio", base64Audio).getElement());
  allAudioContainer.appendChild(audioContainer);
});
