import Entity from '../engine/world/Entity.js';


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
    ctx.fillStyle = 'white';
    ctx.fillRect(this.position.x - 5, this.position.y - 5, 10, 10);
  }

  // Event handler when the pointer is pressed
  onPointerPressed(e)
  {
    console.log(`You clicked ${this.name}!`);
  }
}
