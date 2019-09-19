import Entity from '../../engine/world/Entity.js';
import Vector from '../../engine/util/Vector.js';


// Class that represents an in-game character
export default class Character extends Entity
{
  // Constructor
  constructor(world, name, position)
  {
    super(world, name, position);
  }

  // Draw the character
  draw(ctx)
  {
    let worldPosition = this.world.tileset.transformVector(this.position);

    ctx.fillStyle = 'green';
    ctx.fillRect(worldPosition.x - 8, worldPosition.y - 8, 16, 16);
  }

  // Event handler when the pointer is pressed
  onInteract(e)
  {
    console.log(`You clicked ${this.name}!`);
  }
}
