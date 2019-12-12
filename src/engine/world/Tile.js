import Region from '../util/Region.js';


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
    let region = Region.fromVector(position, 1.0, 1.0).scaleUniform(this.tileset.size);
    ctx.drawImage(this.image, region.left, region.top, region.width, region.height);
  }
}