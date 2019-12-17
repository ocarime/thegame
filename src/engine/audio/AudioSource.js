import Entity from '../world/Entity.js';
import Vector from '../util/Vector.js';


// Class that represents an audio source
export default class AudioSource extends Entity
{
  // Constructor
  constructor(context, world, name, position, options)
  {
    super(world, name, position, options);

    // Reference to the audio context
    this.context = context;
    this.webAudioContext = this.context.webAudioContext;

    // Add two source nodes for looping
    this.sourceNode = undefined;

    // Add a gain node
    this.gainNode = this.webAudioContext.createGain();
    this.gain = this.gainNode.gain;

    // Input node to link to the source node of a clip
    this.inputNode = this.gainNode;

    // Output node to link to the input node of a listener
    this.outputNode = this.gainNode;

    // State variables
    this.clip = options.clip;
    this.currentTime = 0;
    this.volume = options.volume || 1;
    this.pitch = options.pitch || 1;
    this.loop = typeof options.loop !== 'undefined' ? options.loop : false;

    // Rolloff variables
    this.minDistance = options.minDistance || 0;
    this.maxDistance = options.maxDistance || Infinity;
    this.rolloffFunction = function(distance) {
      if (distance < this.minDistance || this.maxDistance === Infinity)
        return 1;
      else if (distance > this.maxDistance)
        return 0;
      else
        return 1 - (distance - this.minDistance) / (this.maxDistance - this.minDistance);
    };
  }

  // Update the audio source logic
  update(deltaTime)
  {
    // Calculate the distance to the audio listener
    let distance = Vector.distance(this.position, this.context.listener.position);
    let rolloff = this.rolloffFunction(distance);

    // Adjust the gain and filter of this audio source
    this.gain.value = rolloff;
  }

  // Play this audio source
  play()
  {
    // If there is no clip, we cannot play
    if (typeof this.clip === 'undefined')
      return;

    this.clip.activeSourceNode.loop = this.loop;
    this.clip.activeSourceNode.connect(this.inputNode)
    this.clip.activeSourceNode.start();
  }

  // Stop this audio source
  stop()
  {

  }

  // Stop this audio source and remember the playhead position
  pause()
  {

  }

  // Resume playback of this audio source
  unpause()
  {

  }
}
