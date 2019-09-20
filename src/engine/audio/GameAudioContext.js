import AudioClip from './AudioClip.js';


// Class that defines the game audio context
export default class GameAudioContext
{
  // Constructor
  constructor()
  {
    // Create an audio context
    this.context = new AudioContext();

    // Create a gain node
    this.gainNode = new GainNode(this.context);
    this.gainNode.connect(this.context.destination);

    // Create the connection endpoint
    this.endpoint = this.gainNode;
  }

  // Create a clip from a URL
  async createClipFromUrl(url)
  {
    let response = await fetch(url);
    let arrayBuffer = await response.arrayBuffer();
    let buffer = await this.context.decodeAudioData(arrayBuffer);

    return new AudioClip(buffer);
  }
}
