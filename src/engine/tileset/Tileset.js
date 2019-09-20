import GameObject from '../GameObject.js';
import Vector from '../../engine/util/Vector.js';


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

  // Transform a vector from tile space to world space
  transformVector(vector, centered)
  {
    return vector
      .scaleUniform(this.tileSize)
      .translate(new Vector(this.tileSize / 2, this.tileSize / 2));
  }

  // Transform a region from tile space to world space
  transformRegion(region)
  {
    return region
      .expand(0, 0, 1, 1)
      .scaleUniform(this.tileSize);
  }

  // Transform a vector from world space to tile space
  inverseTransformVector(vector)
  {
    return vector
      .translate(new Vector(this.tileSize / 2, this.tileSize / 2).scaleUniform(-1))
      .scaleUniform(1 / this.tileSize);
  }

  // Transform a region from world space to tile space
  inverseTransformRegion(region)
  {
    return region
      .scaleUniform(1 / this.tileSize)
      .contract(0, 0, 1, 1);
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
    {
      let worldRegion = this.transformRegion(position.toRegion());
      ctx.drawImage(tile.image, worldRegion.minX, worldRegion.minY, worldRegion.width, worldRegion.height);
    }
  }

  // Convert to string
  toString()
  {
    return `${super.toString()} [${this.tiles.size} tiles]`;
  }
}
