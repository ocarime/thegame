import UUID from '../util/UUID.js';
import Vector from '../geometry/Vector.js';
import World from './World.js';


// Class that defines a context for loading worlds
export default class WorldContext
{
  // Constructor
  constructor(game)
  {
    // Reference to the game
    this.game = game;

    this.assets = {};
    this._tilesets = new Map();
    this._entities = new Map();
  }

  // Register assets
  registerAssets(assets)
  {
    Object.assign(this.assets, assets);
    return this;
  }

  // Register a new tileset
  registerTileset(name, tileset)
  {
    this._tilesets.set(name, tileset);
    return this;
  }

  // Unregister a tileset
  unregisterTileset(name)
  {
    this._tilesets.delete(name);
    return this;
  }

  // Register a new entity type
  registerEntityType(name, definition)
  {
    this._entities.set(name, definition);
    return this;
  }

  // Unregister an entity type
  unregisterEntityType(name)
  {
    this._entities.delete(name);
    return this;
  }

  // Create a new entity
  createEntity(object, world)
  {
    // Assert if all required properties are present
    if (typeof object.type === 'undefined' || typeof object.position === 'undefined')
    {
      console.warn(`Cannot create an antity without "type" and "position" keys`);
      return undefined;
    }

    // Determine the entity type
    let type = this._entities.get(object.type);
    if (typeof type === 'undefined')
    {
      console.warn(`Cannot create an antity for type "${object.type}"`);
      return undefined;
    }

    // Determine the entity name and position
    let name = object.name || `${object.type}-${UUID.generate()}`;
    let position = new Vector(...object.position);

    // Create the object properties including type information and world context
    let properties = {};
    Object.assign(properties, object.properties);
    Object.assign(properties, {entityType: type, game: this.game, worldContext: this});

    // Construct the entity
    return new type.constructor(world, name, position, properties);
  }

  // Load a world from a YAML string
  create(string)
  {
    // Parse the YAML string
    let yaml = YAML.parse(string);

    // Load the tileset
    let tileset = this._tilesets.get(yaml.tileset.name);
    if (typeof tileset === 'undefined')
      return undefined;

    // Read the map
    let map = yaml.tilemap
      .split(/(?:\r?\n)+/)
      .map(row => row.split(/\s+/).map(tile => tileset.getByShortcut(tile)));

    // Create a new world
    let world = new World(map[0].length, map.length, tileset);

    // Add the tiles to the map
    for (let y = 0; y < map.length; y ++)
      for (let x = 0; x < map[y].length; x ++)
        world.setTile(new Vector(x, y), map[y][x]);

    // Add entities
    if (typeof yaml.entities !== 'undefined')
    {
      for (let entity of yaml.entities)
        this.createEntity(entity, world).appendTo(world);
    }

    // Add the player spawn
    if (typeof yaml.playerSpawn !== 'undefined')
      world.playerSpawn = new Vector(...yaml.playerSpawn);

    // Return the world
    return world;
  }
}
