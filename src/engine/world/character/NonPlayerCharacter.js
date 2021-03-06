import Character from './Character.js';
import Modal from '../../../ui/Modal.js';
import Region from '../../geometry/Region.js';
import RegionInt from '../../geometry/RegionInt.js';
import Vector from '../../geometry/Vector.js';


// Class that defines the player character
export default class NonPlayerCharacter extends Character
{
  // Constructor
  constructor(world, name, position, properties)
  {
    super(world, name, position, properties);

    // Variables for random walking of the NPC
    this.roamingArea = typeof properties.roamingArea !== 'undefined' ? new RegionInt(...properties.roamingArea) : this.position.toRegion();
    this.roamingCooldown = properties.roamingCooldown || 0;
    this.roamingInterval = properties.roamingInterval || 0;

    this._roamingTimer = (Math.random() * this.roamingInterval) * 1000;;
  }

  // Draw the character
  draw(ctx)
  {
    // Draw the character
    super.draw(ctx);

    let worldPosition = this.world.transformVector(this.position);

    // Draw the name of the character
    ctx.font = 'bold 10px sans-serif';

    let width = ctx.measureText(this.name).width;
    let anchor = worldPosition.translate(new Vector(this.world.tileset.size / 2, -6));
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
    super.update(deltaTime);

    // Check if the character can roam
    if (this.roamingInterval > 0)
    {
      // Check if the current interval is over
      if (this._roamingTimer <= 0)
      {
        let roamPosition = undefined;
        do {
          roamPosition = new Vector(
            Math.floor(Math.random() * (this.roamingArea.width + 1)) + this.roamingArea.left,
            Math.floor(Math.random() * (this.roamingArea.height + 1)) + this.roamingArea.top
          );
        } while(!this.moveTo(roamPosition));

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

  // Return if a character can currently interact with this entity
  canInteract(character, action = 'interact')
  {
    // The character can interact with the NPC when standing next to it
    return Vector.manhattanDistance(this.position, character.position) <= 1;
  }

  // Interaction event handler
  onInteract(character, action = 'interact')
  {
    let modal = new Modal({
      title: "Delete {{ image.name }}",
      body: "Are you sure you want to delete {{ image.name }}? Links and references to the image are lost forever (a long time)!"
    }).show();
    
    return true;
  }
}
