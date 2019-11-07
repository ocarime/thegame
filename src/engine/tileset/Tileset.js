import CommandParser from '../util/CommandParser.js';
import RegionInt from '../../engine/util/RegionInt.js';
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

    // A map of all aliases
    this.aliases = new Map();
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

  // Register a tile definition
  registerTile(name, url, passable, ...aliases)
  {
    // Create the image
    let image = new Image(this.size, this.size);
    image.src = url;

    // Create the tile object
    this.tiles.set(name, {name: name, passable: passable, image: image});

    // Register the aliases
    aliases.forEach(alias => this.aliases.set(alias, name));
  }

  // Unregister a tile definition
  unregisterTile(name)
  {
    this.tiles.remove(name);
  }

  // Get a tile by its alias
  getTile(name)
  {
    if (this.tiles.has(name))
      return this.tiles.get(name);

    if (this.aliases.has(name))
      return this.tiles.get(this.aliases.get(name));

    return undefined;
  }

  // Draw a tile
  drawTile(name, position, ctx)
  {
    // Check if the tile exists
    let tile = this.getTile(name);
    if (typeof tile !== 'undefined')
    {
      let worldRegion = this.transformRegion(RegionInt.fromVector(position));
      ctx.drawImage(tile.image, worldRegion.left, worldRegion.top, worldRegion.width, worldRegion.height);
    }
  }

  // Load a tileset from a definition string
  static load(string)
  {
    // Create a new tileset
    let tileset = new Tileset();

    // Create a new command parser
    let parser = new CommandParser();

    // Register command for defining tile size
    parser.registerCommand('size', function(size) {
      // Set the size of the tiles
      tileset.size = parseInt(size);
    }.bind(this));

    /// Register command for defining tiles
    parser.registerCommand('tile', function(name, url, passable, ...aliases) {
      // Register a new tile
      tileset.registerTile(name, url, (passable === 'true'), ...aliases);
    }.bind(this));

    // Iterate over the lines
    for (let line of string.split(/\r?\n/))
    {
      // Skip empty lines
      if (line.trim() === '')
        continue;

      // Parse the command
      parser.parse(line);
    }

    // Return the tileset
    return tileset;
  }
}
