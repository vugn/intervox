export function base64ToFloat32Array(base64: string): Float32Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const int16Array = new Int16Array(bytes.buffer);
  const float32Array = new Float32Array(int16Array.length);
  for (let i = 0; i < int16Array.length; i++) {
    float32Array[i] = int16Array[i] / 32768.0;
  }
  return float32Array;
}

export function float32ArrayToBase64(float32Array: Float32Array): string {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    int16Array[i] = Math.max(-32768, Math.min(32767, float32Array[i] * 32768));
  }
  const bytes = new Uint8Array(int16Array.buffer);
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export class AudioQueue {
  private audioContext: AudioContext;
  private inputSampleRate: number;
  private streamDestination: MediaStreamAudioDestinationNode;
  private audioElement: HTMLAudioElement;
  private nextStartTime: number;
  private sources: AudioBufferSourceNode[] = [];

  constructor(sampleRate: number = 24000, outputDeviceId?: string) {
    this.inputSampleRate = sampleRate;
    this.audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )({ sampleRate });
    this.streamDestination = this.audioContext.createMediaStreamDestination();
    this.audioElement = new Audio();
    this.audioElement.autoplay = true;
    this.audioElement.srcObject = this.streamDestination.stream;
    if (outputDeviceId) {
      this.setOutputDevice(outputDeviceId);
    }
    this.nextStartTime = this.audioContext.currentTime;
  }

  async setOutputDevice(outputDeviceId: string) {
    const elementAny = this.audioElement as any;
    if (!outputDeviceId || typeof elementAny.setSinkId !== "function") {
      return;
    }
    try {
      await elementAny.setSinkId(outputDeviceId);
    } catch (error) {
      console.error("Failed to set output device:", error);
    }
  }

  playChunk(float32Array: Float32Array) {
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
    const buffer = this.audioContext.createBuffer(
      1,
      float32Array.length,
      this.inputSampleRate,
    );
    buffer.getChannelData(0).set(float32Array);
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.streamDestination);

    const currentTime = this.audioContext.currentTime;
    if (this.nextStartTime < currentTime) {
      this.nextStartTime = currentTime;
    }
    source.start(this.nextStartTime);
    this.nextStartTime += buffer.duration;
    this.sources.push(source);

    source.onended = () => {
      this.sources = this.sources.filter((s) => s !== source);
    };
  }

  stopAll() {
    this.sources.forEach((source) => {
      try {
        source.stop();
      } catch (e) {}
    });
    this.sources = [];
    this.nextStartTime = this.audioContext.currentTime;
  }

  close() {
    this.stopAll();
    this.audioElement.pause();
    this.audioElement.srcObject = null;
    this.audioContext.close();
  }
}
