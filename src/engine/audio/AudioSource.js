import GameObject from '../GameObject.js';


// Class that represents an audio source
export default class AudioSource extends GameObject
{
  // Constructor
  constructor(game, url)
  {
    super();

    // The game reference
    this.game = game;

    this.playing = false;
  }

  // Get and set the

  // Play the audio source
  play()
  {
    if (typeof this.clip === 'undefined')
      return;

    this.source = new AudioBufferSourceNode(this.game.audioContext.context);
    this.source.buffer = this.clip.buffer;
    this.source.loop = typeof this.loop !== 'undefined' ? this.loop : false;
    this.source.connect(this.game.audioContext.endpoint);
    this.source.start();

    this.playing = true;
  }

  // Stop the audio source
  stop()
  {
    this.source.disconnect();

    this.playing = false;
  }
}
