import Animation from '../../util/Animation.js';
import Entity from '../Entity.js';
import Vector from '../../util/Vector.js';


// Class that represents an in-game character
export default class Character extends Entity
{
  // Constructor
  constructor(world, name, position)
  {
    super(world, name, position);
  }

  // Move the character to a position
  moveTo(...vectors)
  {
    let keyframes = Array.from(vectors.entries()).map(entry => [(entry[0] + 1) * 200, entry[1]]);
    console.log(keyframes);
    this.addGameObject(new Animation(this.position, ...keyframes));
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
