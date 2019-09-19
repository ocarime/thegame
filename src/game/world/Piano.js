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
    this.world.map.tileset.drawTile('piano', this.position, ctx);
  }

  // Interaction event handler
  onInteract(e)
  {
    console.log("Interacted with the piano!");
  }
}
