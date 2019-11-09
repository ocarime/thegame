import AudioClip from './AudioClip.js';
import AudioListener from './AudioListener.js';
import AudioSource from './AudioSource.js';


// Class that defines the audio context
export default class Context
{
  // Constructor
  constructor()
  {
    // Create the web audio context
    this.webAudioContext = new AudioContext;
  }

  // Create a new audio clip
  async createClip(buffer)
  {
    return await new AudioClip(this).init(buffer);
  }

  // Create a new audio source
  createSource(world, name, position, options)
  {
    Object.assign(options, {context: this});
    return new AudioSource(world, name, position, options);
  }
}
