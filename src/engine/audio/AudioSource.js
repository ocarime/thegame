import Entity from '../world/Entity.js';
import Vector from '../geometry/Vector.js';


// Class that represents an audio source
export default class AudioSource extends Entity
{
  // Constructor
  constructor(context, world, name, position, properties)
  {
    super(world, name, position, properties);

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
    this.clip = properties.clip;
    this.currentTime = 0;
    this.volume = properties.volume || 1;
    this.pitch = properties.pitch || 1;
    this.loop = typeof properties.loop !== 'undefined' ? properties.loop : false;

    // Rolloff variables
    this.minDistance = properties.minDistance || 0;
    this.maxDistance = properties.maxDistance || Infinity;
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
    this.currentTilesPassed = [];
    this.currentRolloff = 0;

    // Debug variables
    this.debugInfo = {color: 'aqua'};
  }

  // Update the audio source logic
  update(deltaTime)
  {
    // Only update if the rolloff is changed to save calculation time
    if (typeof this.lastRolloff === 'undefined' || this.currentRolloff !== this.lastRolloff)
    {
      // Adjust the gain and filter of this audio source
      this.gain.value = this.currentRolloff;
      this.lowpassFrequency.value = Math.pow(20000, this.currentRolloff) + 2000;
    }

    // Set the last rolloff
    this.lastRolloff = this.currentRolloff;
  }

  // Draw the debug mode
  debug(ctx)
  {
    let worldPosition = this.world.transformVector(this.position.translate(new Vector(0.5, 0.5)));

    // Draw all passed tiles
    for (let i = 1; i < this.currentTilesPassed.length - 1; i ++)
    {
      let tile = this.currentTilesPassed[i];
      let tileWorldPosition = this.world.transformVector(tile.position.translate(new Vector(0.5, 0.5)));

      // Draw a rectangle at the tile
      ctx.fillStyle = `rgba(0, 255, 255, ${this.currentRolloff > 0.0 ? 0.25 + 0.75 * this.currentRolloff : 0.0})`;
      ctx.fillRect(tileWorldPosition.x - 4, tileWorldPosition.y - 4, 8, 8);

      // Draw the tile mute factor as text
      let text = `${Math.round(tile.muteFactor * 100) / 100}`;

      ctx.font = 'italic 10px monospace';
      ctx.textAlign = 'center';

      let width = ctx.measureText(text).width;
      let anchor = tileWorldPosition.translate(new Vector(0, -7));
      ctx.fillText(text, anchor.x, anchor.y);
    }

    // Draw a dot at the source
    ctx.fillStyle = 'rgb(0, 255, 255)';
    ctx.fillRect(worldPosition.x - 5, worldPosition.y - 5, 10, 10);

    // Draw the rolloff value as text
    let text = `${Math.round(this.currentRolloff * 100)}%`;

    ctx.font = '10px monospace';
    ctx.textAlign = 'center';

    let width = ctx.measureText(text).width;
    let anchor = worldPosition.translate(new Vector(0, -8));
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
