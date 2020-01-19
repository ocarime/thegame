import Region from '../../geometry/Region.js';
import Vector from '../../geometry/Vector.js';


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
    this.size = typeof options.size != 'undefined' ? new Vector(...options.size) : new Vector(1, 1);
    this.anchor = typeof options.anchor != 'undefined' ? new Vector(...options.anchor) : new Vector(0, 0);
  }

  // Draw the tile
  draw(ctx, position)
  {
    let region = Region.fromVector(position.translate(this.anchor.invert()), this.size.x, this.size.y).scaleUniform(this.tileset.size);
    this.sprite.draw(ctx, region);
  }
}
