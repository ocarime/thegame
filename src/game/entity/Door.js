import Entity from '../../engine/world/Entity.js';


// Class that defines a door entity
export default class Door extends Entity
{
  // Constructor
  constructor(world, name, position, options)
  {
    super(world, name, position, options);

    // Orientation of the door
    this.orientation = options.orientation || 'horizontal';

    // State of the door
    this.state = options.state || 'closed';
  }

  // Draw the door
  draw(ctx)
  {
    this.world.tileset.get('door', {state: this.state, orientation: this.orientation}).draw(ctx, this.position);
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
