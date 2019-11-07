import Entity from '../../engine/world/Entity.js';


// Class that defines a piano entity
export default class Painting extends Entity
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
    this.world.tileset.drawTile('painting', this.position, ctx);
  }

  // Interaction event handler
  onInteract(e)
  {
    // create popup, for now link to url
    window.open(this.url, '_blank');
  }
}
