import Character from './Character.js';
import Region from '../../util/Region.js';
import RegionInt from '../../util/RegionInt.js';
import Vector from '../../util/Vector.js';


// Class that defines the player character
export default class NonPlayerCharacter extends Character
{
  // Constructor
  constructor(world, name, position, options)
  {
    super(world, name, position, options);

    // Definition variables
    this.color = options.color || 'aqua';

    // Variables for random walking of the NPC
    this.roamingArea = typeof options.roamingArea !== 'undefined' ? new RegionInt(...options.roamingArea) : this.position.toRegion();
    this.roamingCooldown = options.roamingCooldown || 0;
    this.roamingInterval = options.roamingInterval || 0;

    this._roamingTimer = (Math.random() * this.roamingInterval) * 1000;;
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

  // Update the character logic
  update(deltaTime)
  {
    // Check if the character can roam
    if (this.roamingInterval > 0)
    {
      // Check if the current interval is over
      if (this._roamingTimer <= 0)
      {
        // Roam
        let path = undefined;
        while (typeof path === 'undefined')
        {
          path = this.world.getPath(this.position, new Vector(
            Math.floor(Math.random() * (this.roamingArea.width + 1)) + this.roamingArea.left,
            Math.floor(Math.random() * (this.roamingArea.height + 1)) + this.roamingArea.top
          ));
        }
        this.moveTo(...path.slice(1));

        // Calculate a new interval
        this._roamingTimer = (Math.random() * this.roamingInterval + this.roamingCooldown) * 1000;
      }
      else
      {
        // Decrease the roaming timer
        this._roamingTimer -= deltaTime;
      }
    }
  }
}
