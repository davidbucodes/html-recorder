export class Audio {
  private _audio: HTMLAudioElement;

  constructor(fieldName: string, audioUrl: string) {
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.preload = "auto";
    audio.src = audioUrl;
    this._audio = audio;
  }

  update(audioUrl: string) {
    this._audio.src = audioUrl;
  }

  getElement() {
    return this._audio;
  }
}
