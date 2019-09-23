import Character from './Character.js';
import Region from '../../util/Region.js';
import Vector from '../../util/Vector.js';


// Class that defines the player character
export default class NonPlayerCharacter extends Character
{
  // Constructor
  constructor(world, name, position, color = 'aqua')
  {
    super(world, name, position);

    this.color = color;
  }

  // Draw the character
  draw(ctx)
  {
    let worldPosition = this.world.tileset.transformVector(this.position);

    // Draw the character
    ctx.fillStyle = this.color;
    ctx.fillRect(worldPosition.x - 8, worldPosition.y - 8, 16, 16);

    // Draw the name of the character

    // Get the text dimensions
    ctx.font = 'bold 10px sans-serif';

    let width = ctx.measureText(this.name).width;
    let anchor = worldPosition.translate(new Vector(0, -this.world.tileset.size / 2 - 6));
    let frame = new Region(anchor.x - width / 2 - 4, anchor.y - 10, anchor.x + width / 2 + 4, anchor.y + 5);

    // Draw the frame
    ctx.fillStyle = 'black';
    ctx.strokeStyle = this.color;
    ctx.fillRect(frame.left, frame.top, frame.width, frame.height);
    ctx.strokeRect(frame.left, frame.top, frame.width, frame.height);

    // Draw the text;
    ctx.textAlign = 'center';
    ctx.fillStyle = this.color;
    ctx.fillText(this.name, anchor.x, anchor.y);
  }
}
