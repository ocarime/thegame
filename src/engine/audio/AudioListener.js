import Entity from '../world/Entity.js';
import Vector from '../geometry/Vector.js';


// Class that represents an audio listener
export default class AudioListener extends Entity
{
  // Constructor
  constructor(context, world, name, position, options)
  {
    super(world, name, position, options);

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

  // Draw the debug mode
  debug(ctx)
  {
    let thisRealPosition = this.world.transformVector(this.position.translate(new Vector(0.5, 0.5)));

    // Draw a dot at the litener
    ctx.fillStyle = 'aqua';
    ctx.fillRect(thisRealPosition.x - 5, thisRealPosition.y - 5, 10, 10);
  }
}
