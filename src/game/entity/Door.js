import Entity from '../../engine/world/Entity.js'


// Class that defines a door entity
export default class Door extends Entity
{
  // Constructor
  constructor(world, name, position, state = 'closed')
  {
    super(world, name, position);

    // State of the door
    this.state = state;
  }

  // Draw the door
  draw(ctx)
  {
    if (this.state === 'locked')
      this.world.tileset.drawTile('door-locked', this.position, ctx);
    else if (this.state === 'opened')
      this.world.tileset.drawTile('door-opened', this.position, ctx);
    else
      this.world.tileset.drawTile('door-closed', this.position, ctx);
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
