import GameObject from '../GameObject.js';


// Class that defines a tileset
export default class Tileset extends GameObject
{
  // Constructor
  constructor()
  {
    super();

    // The size of the tiles
    this.tileSize = 16;

    // A map of all tiles, indexed by name
    this.tiles = new Map();

    // A map of all aliases
    this.aliases = new Map();
  }

  // Register a tile definition
  registerTile(name, url, aliases = [])
  {
    // Create the image
    let image = new Image(this.tileSize, this.tileSize);
    image.src = url;

    // Create the tile object
    this.tiles.set(name, {image: image});

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
      ctx.drawImage(tile.image, position.x * this.tileSize, position.y * this.tileSize, this.tileSize, this.tileSize);
  }

  // Convert to string
  toString()
  {
    return `${super.toString()} [${this.tiles.size} tiles]`;
  }
}
