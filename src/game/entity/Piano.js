import Entity from '../../engine/world/Entity.js';


// Class that defines a piano entity
export default class Piano extends Entity
{
  // Constructor
  constructor(world, name, position, url)
  {
    super(world, name, position);

    this.url = url;
  }

  // Draw the door
  draw(ctx)
  {
    this.world.tileset.drawTile('piano', this.position, ctx);
  }

  // Interaction event handler
  onInteract(e)
  {
    window.open(this.url, '_blank');
  }
}
