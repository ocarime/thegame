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
    this.src = options.src || null;
    this.conditions = options.conditions || {};
    this.passable = typeof options.passable !== 'undefined' ? options.passable : true;

    // Create the image
    this.image = new Image(this.tileset.size, this.tileset.size);
    this.image.src = this.src;
  }

  // Draw the tile
  draw(ctx, position)
  {
    let region = Region.fromVector(position, 1.0, 1.0).scaleUniform(this.tileset.size);

    if (this.image.naturalWidth === this.tileset.size && this.image.naturalHeight === this.tileset.size)
    {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(this.image, region.left, region.top);
    }
    else
    {
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(this.image, region.left, region.top, region.width, region.height);
    }
  }
}
