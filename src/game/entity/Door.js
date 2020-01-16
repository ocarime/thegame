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
    if (this.state === 'locked')
    {
      if (this.orientation === 'vertical')
        this.world.tileset.tiles.get('door-locked-vertical')._draw(ctx, this.position);
      else
        this.world.tileset.tiles.get('door-locked-horizontal')._draw(ctx, this.position);
    }
    else if (this.state === 'opened')
    {
      if (this.orientation === 'vertical')
        this.world.tileset.tiles.get('door-opened-vertical')._draw(ctx, this.position);
      else
        this.world.tileset.tiles.get('door-opened-horizontal')._draw(ctx, this.position);
    }
    else
    {
      if (this.orientation === 'vertical')
        this.world.tileset.tiles.get('door-closed-vertical')._draw(ctx, this.position);
      else
        this.world.tileset.tiles.get('door-closed-horizontal')._draw(ctx, this.position);
    }
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
