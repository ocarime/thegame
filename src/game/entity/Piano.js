import Entity from '../../engine/world/Entity.js'


// Class that defines a piano entity
export default class Piano extends Entity
{
  // Constructor
  constructor(world, name, position)
  {
    super(world, name, position);
  }

  // Draw the door
  draw(ctx)
  {
    this.world.tileset.drawTile('piano', this.position, ctx);
  }

  // Interaction event handler
  onInteract(e)
  {
    window.open('http://www.amberveerman.com/', '_blank');
  }
}
