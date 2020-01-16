import Entity from '../../engine/world/Entity.js';


// Class that defines a piano entity
export default class Piano extends Entity
{
  // Constructor
  constructor(world, name, position, options)
  {
    super(world, name, position, options);

    this.url = options.url;
  }

  // Draw the door
  draw(ctx)
  {
    this.world.tileset.get('piano').draw(ctx, this.position);
  }

  // Interaction event handler
  onInteract(e)
  {
    window.open(this.url, '_blank');
  }
}
