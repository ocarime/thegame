import Entity from '../../engine/world/Entity.js';


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

  // Interaction event handler
  onInteract(e)
  {
    // Check if the door is locked
    if (this.state !== 'locked')
    {
      // Open or close the door
      this.state = (this.state === 'closed' ? 'opened' : 'closed');
    }
  }

  // Convert to display name
  toDisplayName()
  {
    return `${this.name} (${this.state})`;
  }
}
