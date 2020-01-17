import RegionInt from '../../util/RegionInt.js';
import Sprite from '../../util/Sprite.js';
import Tile from './Tile.js';


// Class that defines a tileset
export default class TileSet
{
  // Constructor
  constructor(size = 16)
  {
    // The size of the tiles
    this.size = size;

    // A list of all tiles
    this.tiles = [];

    // A list of all shortcuts
    this.shortcuts = new Map();
  }

  // Get a defined tile
  get(name, properties = {})
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
      if (typeof properties !== 'undefined' && !Object.keys(tile.properties).every(property => tile.properties[property] === properties[property]))
        continue;

      return tile;
    }

    // Nothing found
    console.warn(`No tile was found for "${name}" with properties ${JSON.stringify(properties)}`)
    return undefined;
  }

  // Get a defined tile by definition string/array
  getByArray(array, extraProperties = {})
  {
    if (typeof array === 'string')
    {
      let [name, properties] = [array, extraProperties];
      return this.get(name, properties);
    }
    else if (typeof array === 'object' && Array.isArray(array))
    {
      let [name, properties] = array;
      Object.assign(properties, extraProperties);
      return this.get(name, properties);
    }

    // Invalid definition format
    throw new Error(`Invalid tile definition format: "${array}"`);
  }

  // Get a defined tile by shortcut
  getByShortcut(name)
  {
    return this.shortcuts.get(name);
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
  static async load(string)
  {
    // Parse the YAML string
    let yaml = YAML.parse(string);

    // Create a new tileset with the specified size
    let tileset = new TileSet(yaml.size || 16);

    // Add the tile definitions
    if (typeof yaml.tiles !== 'undefined')
    {
      // Iterate over the tile names
      for (let [tileName, tileDefinitions] of Object.entries(yaml.tiles))
      {
        // Iterate over the tile definitions
        for (let tileDefinition of tileDefinitions)
        {
          // Create the sprite
          tileDefinition.sprite = await Sprite.create(tileDefinition.sprite);

          // Add the tile definition
          tileset.set(tileName, tileDefinition);
        }
      }
    }

    // Add the shortcuts
    if (typeof yaml.shortcuts !== 'undefined')
    {
      // Iterate over the shortcut names
      for (let [shortcut, array] of Object.entries(yaml.shortcuts))
        tileset.shortcuts.set(shortcut, tileset.getByArray(array));
    }

    // Return the tileset
    return tileset;
  }
}
