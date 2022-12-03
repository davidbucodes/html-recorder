import { Audio } from "./audio";
import { save } from "./save";

let recorder: Recorder;

document.addEventListener("keyup", async ({ code }) => {
  console.log(code);
  if (code === "Enter") {
    getBase64ReadVoice();
  }
});

export async function getBase64ReadVoice() {
  return new Promise(async () => {
    if (!recorder) {
      recorder = new Recorder();
    }

    const listener = async ({ code }: KeyboardEvent) => {
      console.log(code);
      if (code === "Space") {
        const { base64Audio } = await recorder.stop();
        console.log(base64Audio);
        document.removeEventListener("keyup", listener);
        document.body.appendChild(new Audio("audio", base64Audio).getElement());
      }
    };
    document.addEventListener("keyup", listener);

    await recorder.start();
  });
}

class Recorder {
  private _chunks: Blob[];
  private _mediaRecorder: MediaRecorder;

  async start() {
    // https://stackoverflow.com/a/70665493/10198772
    if (!this._chunks) {
      await this.init();
    }
    this._chunks = [];
    this._mediaRecorder.start(500);
  }

  async stop(): Promise<{ base64Audio: string }> {
    const type = MediaRecorder.isTypeSupported("audio/ogg");
    // const type = MediaRecorder.isTypeSupported("audio/webm")
    //   ? "audio/webm"
    //   : "audio/ogg";
    const blob = new Blob(this._chunks, { type: "audio/ogg" });

    this._chunks = [];
    this._mediaRecorder.stop();

    const base64Audio = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
    return {
      base64Audio,
    };
  }

  private async init() {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: {
        noiseSuppression: false,
        echoCancellation: false,
        autoGainControl: false,
      },
    });
    const track = stream.getAudioTracks()[0];
    if (!track) throw "System audio not available";

    stream.getVideoTracks().forEach((track) => track.stop());

    const mediaStream = new MediaStream();
    mediaStream.addTrack(track);

    this._mediaRecorder = new MediaRecorder(mediaStream, {
      audioBitsPerSecond: 5000000,
    });
    this._mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) this._chunks.push(event.data);
    };
  }
}
