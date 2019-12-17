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

    // Reference to the listener
    this.listener = undefined;

    // Reference to the sources
    this.sources = [];
  }

  // Create a new audio clip
  async createClip(buffer)
  {
    return await new AudioClip(this).init(buffer);
  }

  // Create a new audio listener
  createListener(world, name, position, options = {})
  {
    let listener = new AudioListener(this, world, name, position, options);

    // Connect present sources to the listener
    for (let source of this.sources)
      source.outputNode.connect(listener.inputNode);

    // Add the listener to the context
    this.listener = listener;
    return listener;
  }

  // Create a new audio source
  createSource(world, name, position, options = {})
  {
    let source = new AudioSource(this, world, name, position, options);

    // Connect the source to the listener
    if (typeof this.listener !== 'undefined')
      source.outputNode.connect(this.listener.inputNode);

    // Add the source to the context
    this.sources.push(source);
    return source;
  }
}
