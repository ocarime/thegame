import Entity from '../../engine/world/Entity.js';
import Vector from '../../engine/util/Vector.js';


// Class that defines a piano entity
export default class Painting extends Entity
{
  // Constructor
  constructor(world, name, position, properties)
  {
    super(world, name, position, properties);

    // Properties of the entity
    this.url = properties.url;
  }

  // Return if a character can currently interact with this entity
  canInteract(character, action = 'interact')
  {
    // The character can interact with the painting when standing next to it
    return Vector.manhattanDistance(this.position, character.position) <= 1;
  }

  // Interaction event handler
  onInteract(character, action = 'interact')
  {
    if (action === 'interact')
    {
      // Open a popup with the url
      window.open(this.url, '_blank');
    }

    // No valid action
    return false;
  }
}
