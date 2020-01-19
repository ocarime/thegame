import Entity from '../world/Entity.js';
import Vector from '../geometry/Vector.js';


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

    // Add a lowpass filter node
    this.lowpassFilterNode = this.webAudioContext.createBiquadFilter();
    this.lowpassFilterNode.type = 'lowpass';
    this.lowpassFilterNode.frequency.value = 24000;
    this.lowpassFrequency = this.lowpassFilterNode.frequency;

    // Add a gain node
    this.gainNode = this.webAudioContext.createGain();
    this.gain = this.gainNode.gain;
    this.lowpassFilterNode.connect(this.gainNode);

    // Input node to link to the source node of a clip
    this.inputNode = this.lowpassFilterNode;

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

    // Current rolloff variables
    this.currentDistance = Math.Infinity;
    this.currentRolloff = 0;

    // Debug variables
    this.debugInfo = {color: 'aqua'};
  }

  // Update the audio source logic
  update(deltaTime)
  {
    // Calculate the rolloff to the audio listener
    this.currentDistance = Vector.distance(this.position, this.context.listener.position);
    this.currentRolloff = this.rolloffFunction(this.currentDistance);

    // Adjust the gain and filter of this audio source
    this.gain.value = this.currentRolloff;
    this.lowpassFrequency.value = Math.pow(20000, this.currentRolloff) + 2000;
  }

  // Draw the debug mode
  debug(ctx)
  {
    let thisRealPosition = this.world.transformVector(this.position.translate(new Vector(0.5, 0.5)));
    let listenerRealPosition = this.world.transformVector(this.context.listener.position.translate(new Vector(0.5, 0.5)));

    // Draw a dot at the source
    ctx.fillStyle = 'aqua';
    ctx.fillRect(thisRealPosition.x - 5, thisRealPosition.y - 5, 10, 10);

    // Draw a line from the source to the listener
    ctx.lineWidth = 2;
    ctx.strokeStyle = `rgba(0, 255, 255, ${this.currentRolloff > 0.0 ? 0.25 + 0.75 * this.currentRolloff : 0.0})`;

    ctx.beginPath();
    ctx.moveTo(thisRealPosition.x, thisRealPosition.y);
    ctx.lineTo(listenerRealPosition.x, listenerRealPosition.y);
    ctx.stroke();

    // Draw the rolloff
    let text = `${Math.round(this.currentRolloff * 100)}%`;
    ctx.font = 'bold 10px monospace';

    let width = ctx.measureText(text).width;
    let anchor = thisRealPosition.translate(new Vector(0, -8));

    // Draw the text;
    ctx.textAlign = 'center';
    ctx.fillText(text, anchor.x, anchor.y);
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
