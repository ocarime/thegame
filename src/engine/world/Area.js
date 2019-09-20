import GameObject from '../GameObject.js';
import Region from '../util/Region.js';


// Class that defines an area in the world
export default class Area extends GameObject
{
  // Constructor
  constructor(world, minX, minY, maxX, maxY)
  {
    super();

    // The world reference
    this.world = world;

    // The underlying region that this object represents
    this.region = new Region(minX, minY, maxX, maxY);
  }

  // Draw the region
  draw(ctx)
  {
    let screenRegion = this.world.tileset.transformRegion(this.region);

    ctx.strokeStyle = 'lime';
    ctx.strokeRect(screenRegion.minX, screenRegion.minY, screenRegion.width, screenRegion.height);
  }

  // Conveert to string
  toString()
  {
    return `${super.toString()} ${this.region}`;
  }
}
