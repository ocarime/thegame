import GameObject from '../GameObject.js';
import Tileset from '../tileset/Tileset.js';
import Vector from '../util/Vector.js';


// Class that defines a tile map
export default class WorldMap extends GameObject
{
  // Constructor
  constructor(width, height, tileset = undefined)
  {
    super();

    // Dimensions of the map
    this._width = width;
    this._height = height;

    // The tileset reference
    this.tileset = tileset || new Tileset();

    // tile array
    this.tiles = Array.fill(undefined, this.width * this.height);
  }

  // Get the dimensions of the map
  get width()
  {
    return this._width;
  }
  get height()
  {
    return this._height;
  }

  // Get and set the tileset
  get tileset()
  {
    return this._tileset;
  }
  set tileset(value)
  {
    if (typeof this._tileset === 'undefined')
      this._tileset = this.addGameObject(value);
    else
      this._tileset = this.replaceGameObject(this._tileset, value);
  }

  // Get a tile at a position
  getTile(position)
  {
    return this.tiles[position.y * this.height + position.x];
  }

  // Set a tile at a position
  setTile(position, tile)
  {
    this.tiles[position.y * this.height + position.x] = tile;
  }

  // Draw the map
  draw(ctx)
  {
    // Draw the tiles
    for (let y = this.height - 1; y >= 0; y --)
    {
      for (let x = 0; x < this.width; x ++)
      {
        let position = new Vector(x, y);
        let tile = this.getTile(position);
        if (typeof tile !== 'undefined')
        {
          this.tileset.drawTile(tile, position, ctx);
        }
      }
    }
  }

  // Convert to string
  toString()
  {
    return `${super.toString()}: width = ${this.width}, height = ${this.height}`;
  }
}
