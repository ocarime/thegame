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
