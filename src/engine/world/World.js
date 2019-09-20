import GameObject from '../GameObject.js'
import Area from './Area.js';
import Entity from './Entity.js';
import Tileset from '../tileset/Tileset.js';
import Region from '../util/Region.js';
import Vector from '../util/Vector.js';


// Class that defines the world
export default class World extends GameObject
{
  // Constructor
  constructor(game, width = 16, height = 16, tileset = undefined)
  {
    super();

    // The game instance
    this.game = game;

    // Dimensions of the world
    this._width = width;
    this._height = height;
    this.region = new Region(0, 0, this.width - 1, this.height - 1);

    // The tileset reference
    this.tileset = tileset || new Tileset();

    // Tile array
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
    return this.tiles[position.y * this.width + position.x];
  }

  // Set a tile at a position
  setTile(position, tile)
  {
    this.tiles[position.y * this.width + position.x] = tile;
  }

  // Get all entities
  get entities()
  {
    return Array.from(this.getGameObjects(Entity));
  }

  // Get an entity
  getEntity(name)
  {
    return this.entities.find(entity => entity.name === name);
  }

  // Get an entity at a position
  getEntityAtPosition(position)
  {
    return this.entities.find(entity => entity.position.x == position.x && entity.position.y == position.y);
  }

  // Get all areas
  get areas()
  {
    return Array.from(this.getGameObjects(Area));
  }

  // Get all areas at a position
  getAreasAtPosition(position)
  {
    return this.areas.filter(area => area.region.contains(position));
  }

  // Draw the world
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

  // Event handler when the pointer is hovered
  onPointerHovered(e)
  {
    let position = this.game.camera.inverseTransformVector(e.position);
    let tilePosition = this.tileset.inverseTransformVector(position).round();

    // Check if the tile is in the world
    if (!this.region.contains(tilePosition))
      return;

    // Get the entity at the position
    let entity = this.getEntityAtPosition(tilePosition);
    if (entity !== undefined && entity.can('onInspect'))
      entity.onInspect(e);
  }

  // Event handler when the pointer is pressed
  onPointerPressed(e)
  {
    let position = this.game.camera.inverseTransformVector(e.position);
    let tilePosition = this.tileset.inverseTransformVector(position).round();

    // Check if the tile is in the world
    if (!this.region.contains(tilePosition))
      return;

    // Get the entity at the position
    let entity = this.getEntityAtPosition(tilePosition);
    if (entity !== undefined && entity.can('onInteract'))
    {
      // Interact with the entity
      entity.onInteract(e);
    }
    else
    {
      // Move the player
      this.game.player.position = tilePosition;
      console.log("Player in areas:", this.getAreasAtPosition(this.game.player.position));
    }
  }

  // Convert to string
  toString()
  {
    return `${super.toString()} [${this.entities.length} entities]: width = ${this.width}, height = ${this.height}`;
  }
}
