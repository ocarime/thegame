import Region from '../../util/Region.js';


// Class that defines a tile
export default class Tile
{
  // Constructor
  constructor(tileset, name, options)
  {
    this.tileset = tileset;

    // Definition variables
    this.name = name;
    this.properties = options.properties || {};
    this.passable = typeof options.passable !== 'undefined' ? options.passable : true;
    this.cost = options.cost || 1;

    // Drawing variables
    this.sprite = options.sprite;
  }

  // Draw the tile
  draw(ctx, position)
  {
    let region = Region.fromVector(position, 1.0, 1.0).scaleUniform(this.tileset.size);
    this.sprite.draw(ctx, region);
  }
}
