import Entity from '../../engine/world/Entity.js';
import Vector from '../../engine/util/Vector.js';


// Class that defines a door entity
export default class Door extends Entity
{
  // Constructor
  constructor(world, name, position, properties)
  {
    super(world, name, position, properties);

    // Properties of the entity
    this.orientation = properties.orientation || 'horizontal';
    this.state = properties.state || 'closed';
  }

  // Return if a character can currently interact with this entity
  canInteract(character, action = 'interact')
  {
    // The character can interact with the door when standing next to it
    return Vector.manhattanDistance(this.position, character.position) <= 1;
  }

  // Interaction event handler
  onInteract(character, action = 'interact')
  {
    // Check if the door is locked
    if (this.state !== 'locked')
    {
      if (action === 'interact')
      {
        this.state = (this.state === 'closed' ? 'opened' : 'closed');
        return true;
      }
      else if (action === 'open')
      {
        this.state = 'opened';
        return true;
      }
      else if (action === 'close')
      {
        this.state = 'closed';
        return true;
      }
      else if (action === 'lock')
      {
        this.state = 'locked';
        return true;
      }
    }

    // No valid action
    return false;
  }

  // Convert to display name
  toDisplayName()
  {
    return `${this.name} (${this.state})`;
  }
}
