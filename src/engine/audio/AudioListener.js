import Entity from '../world/Entity.js';
import Vector from '../geometry/Vector.js';


// Class that represents an audio listener
export default class AudioListener extends Entity
{
  // Constructor
  constructor(context, world, name, position, properties)
  {
    super(world, name, position, properties);

    // Reference to the audio context
    this.context = context;
    this.webAudioContext = this.context.webAudioContext;

    // Add a gain node
    this.gainNode = this.webAudioContext.createGain();
    this.gainNode.connect(this.webAudioContext.destination);
    this.gain = this.gainNode.gain;

    // Output node to link to the output node of a source
    this.inputNode = this.gainNode;

    // Debug variables
    this.debugInfo = {color: 'aqua'};
  }

  // Update the audio listener logic
  update(deltaTime)
  {
    // Only update if the position has changed to save calculation time
    if (typeof this.lastPosition === 'undefined' || this.position.x !== this.lastPosition.x || this.position.y !== this.lastPosition.y)
    {
      // Iterate over the audio sources
      for (let source of this.context.sources)
      {
        // Calculate the rolloff to the audio listener
        source.currentDistance = Vector.distance(source.position, this.position);
        source.currentRolloff = source.rolloffFunction(source.currentDistance);

        // Calculate the mute factor based on the tiles that are passed
        source.currentTilesPassed = this.world.line(source.position, this.position);
        for (let tile of source.currentTilesPassed)
          source.currentRolloff *= tile.muteFactor;
      }
    }

    // Set the last position
    this.lastPosition = new Vector(this.position.x, this.position.y);
  }

  // Draw the debug mode
  debug(ctx)
  {
    let worldPosition = this.world.transformVector(this.position.translate(new Vector(0.5, 0.5)));

    // Draw a rectangle at the listener
    ctx.fillStyle = 'aqua';
    ctx.fillRect(worldPosition.x - 5, worldPosition.y - 5, 10, 10);
  }
}
