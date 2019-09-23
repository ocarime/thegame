import Area from './Area.js';
import Entity from './Entity.js';
import GameObject from '../GameObject.js';
import RegionInt from '../util/RegionInt.js';
import Tileset from '../tileset/Tileset.js';
import Vector from '../util/Vector.js';


// Class that defines the world
export default class World extends GameObject
{
  // Constructor
  constructor(game, width = 16, height = 16, tileset)
  {
    super();

    // The game instance
    this.game = game;

    // Dimensions of the world
    this.region = new RegionInt(0, 0, width, height);

    // Reference to the tileset
    this.tileset = tileset;

    // Tile array
    this.tiles = Array.fill(undefined, this.region.area);
  }

  // Get the dimensions of the map
  get width()
  {
    return this.region.width;
  }
  get height()
  {
    return this.region.height;
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

  // Get neighboring tiles
  *getNeighbors(position)
  {
    if (position.x > this.region.left)
      yield position.translate(new Vector(-1, 0));
    if (position.x < this.region.right)
      yield position.translate(new Vector(1, 0));
    if (position.y > this.region.top)
      yield position.translate(new Vector(0, -1));
    if (position.y < this.region.bottom)
      yield position.translate(new Vector(0, 1));
  }

  // Get all entities
  get entities()
  {
    return Array.from(this.getObjects(Entity));
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
    return Array.from(this.getObjects(Area));
  }

  // Get all areas at a position
  getAreasAtPosition(position)
  {
    return this.areas.filter(area => area.region.contains(position));
  }

  // Get information about a position in the world
  getTileInfo(position)
  {
    let tile = this.tileset.getTile(this.getTile(position));
    let entity = this.getEntityAtPosition(position);

    return {
      position: position,
      tile: tile,
      entity: entity,
      isPassable: function() {
        return typeof tile !== 'undefined' && tile.passable;
      }
    };
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
      this.game.player.moveTo(tilePosition);

      // Get areas the player is in
      for (let area of this.areas)
      {
        // Check if the player is in this area
        if (area.region.contains(tilePosition))
        {
          if (typeof area.audioSource !== 'undefined' && !area.audioSource.playing)
            area.audioSource.play();
        }
        else
        {
          if (typeof area.audioSource !== 'undefined' && area.audioSource.playing)
            area.audioSource.stop();
        }
      }
    }
  }

  // Convert to string
  toString()
  {
    return `${super.toString()} [${this.entities.length} entities]: width = ${this.width}, height = ${this.height}`;
  }
}
