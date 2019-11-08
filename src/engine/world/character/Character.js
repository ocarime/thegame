import Animation from '../../util/Animation.js';
import Entity from '../Entity.js';
import Region from '../../util/Region.js';
import Vector from '../../util/Vector.js';


// Class that represents an in-game character
export default class Character extends Entity
{
  // Constructor
  constructor(world, name, position, options)
  {
    super(world, name, position, options);

    // Definition variables
    this.color = options.color || 'green';
    this.velocity = options.velocity || 10;
  }

  // Move the character to a position
  moveTo(...vectors)
  {
    let keyframes = Array.from(vectors.entries()).map(entry => [(entry[0] + 1) * (1000 / this.velocity), entry[1]]);
    let a = new Animation(this.position, ...keyframes).appendTo(this);
  }

  // Draw the character
  draw(ctx)
  {
    let region = this.world.transformRegion(Region.fromVector(this.position, 1, 1));

    ctx.fillStyle = this.color;
    ctx.fillRect(region.left + 4, region.top + 4, region.width - 8, region.height - 8);
  }

  // Event handler when the pointer is pressed
  onInteract(e)
  {
    console.log(`You clicked ${this.name}!`);
  }
}
