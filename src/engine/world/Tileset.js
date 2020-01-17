import Tile from './Tile.js';


// Class that defines a tileset
export default class Tileset
{
  // Constructor
  constructor(size = 16)
  {
    // The size of the tiles
    this.size = size;

    // A list of all tiles
    this.tiles = [];
  }

  // Get a defined tile
  get(name, conditions = {})
  {
    if (typeof name === 'undefined')
      return undefined;

    // Iterate over the tiles
    for (let tile of this.tiles)
    {
      // Check if the name equals
      if (tile.name !== name)
        continue;

      // Check if the conditions are met
      if (!Object.keys(conditions).every(property => tile.conditions.hasOwnProperty(property) && tile.conditions[property] === conditions[property]))
        continue;

      return tile;
    }

    // Nothing found
    return undefined;
  }

  // Set a defined tile
  set(name, definition)
  {
    // Create a new tile
    let tile = new Tile(this, name, definition);

    // Add the tile to the list
    this.tiles.push(tile);
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
      // Iterate over the tile names
      for (let tileName in yaml.tiles)
      {
        if (!yaml.tiles.hasOwnProperty(tileName))
          continue;

        // Iterate over the tile definitions
        for (let tileDefinition of yaml.tiles[tileName])
          tileset.set(tileName, tileDefinition);
      }
    }

    // Return the tileset
    return tileset;
  }
}
