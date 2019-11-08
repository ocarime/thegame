import RegionInt from '../util/RegionInt.js';


// Class that defines a tile
export default class Tile
{
  // Constructor
  constructor(tileset, name, options)
  {
    this.tileset = tileset;

    // Definition variables
    this.name = name;
    this.imageUrl = options.imageUrl || null;
    this.passable = typeof options.passable !== 'undefined' ? options.passable : true;

    // Create the image
    this.image = new Image(this.tileset.size, this.tileset.size);
    this.image.src = this.imageUrl;
  }

  // Draw the tile
  _draw(ctx, position)
  {
    let worldRegion = this.tileset.transformRegion(RegionInt.fromVector(position));
    ctx.drawImage(this.image, worldRegion.left, worldRegion.top, worldRegion.width, worldRegion.height);
  }
}
