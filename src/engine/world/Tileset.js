import RegionInt from '../../engine/util/RegionInt.js';
import Tile from './Tile.js';
import Vector from '../../engine/util/Vector.js';


// Class that defines a tileset
export default class Tileset
{
  // Constructor
  constructor(size = 16)
  {
    // The size of the tiles
    this.size = size;

    // A map of all tiles, indexed by name
    this.tiles = new Map();
  }

  // Transform a vector from tile space to world space
  transformVector(vector, centered)
  {
    return vector
      .scaleUniform(this.size)
      .translate(new Vector(this.size / 2, this.size / 2));
  }

  // Transform a region from tile space to world space
  transformRegion(region)
  {
    return region
      .scaleUniform(this.size);
  }

  // Transform a vector from world space to tile space
  inverseTransformVector(vector)
  {
    return vector
      .translate(new Vector(this.size / 2, this.size / 2).scaleUniform(-1))
      .scaleUniform(1 / this.size);
  }

  // Transform a region from world space to tile space
  inverseTransformRegion(region)
  {
    return region
      .scaleUniform(1 / this.size);
  }

  // Load a tileset from a definition string
  static load(string)
  {
    // Parse the YAML string
    let yaml = YAML.parse(string);

    // Create a new tileset with the specified size
    let tileset = new Tileset(yaml.size || 16);

    // Add the tile definitions
    if (typeof yaml.tiles !== 'undefined')
    {
      for (let name in yaml.tiles)
      {
        if (!yaml.tiles.hasOwnProperty(name))
          continue;

        tileset.tiles.set(name, new Tile(tileset, name, yaml.tiles[name]))
      }
    }

    // Return the tileset
    return tileset;
  }
}
