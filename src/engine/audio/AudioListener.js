import Entity from '../world/Entity.js';


// Class that represents an audio listener
export default class AudioListener extends Entity
{
  // Constructor
  constructor(world, name, position, options)
  {
    super(world, name, position, options);

    // Reference to the audio context
    this.context = options.context;
    this.webAudioContext = this.context.webAudioContext;

    // Add a gain node
    this.gainNode = this.webAudioContext.createGain();
    this.gainNode.connect(this.webAudioContext.destination);
    this.gain = gainNode.gain;

    // Output node to link to the output node of a source
    this.inputNode = this.gainNode;
  }
}
