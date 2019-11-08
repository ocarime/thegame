import Vector from '../util/Vector.js';
import World from './World.js';


// Class that defines a context for loading worlds
export default class WorldContext
{
  // Constructor
  constructor(game)
  {
    this.game = game;

    this._entities = new Map();
  }


  // Register a new entity type
  registerEntityType(type, typeDefinition)
  {
    this._entities.set(type, typeDefinition);
    return this;
  }

  // Unregister an entity type
  unregisterEntityType(type)
  {
    this._entities.remove(type);
    return this;
  }

  // Create a new entity
  createEntity(object, world)
  {
    // Assert if all required properties are present
    if (typeof object.type === 'undefined' || typeof object.name === 'undefined' || typeof object.position === 'undefined')
      return undefined;

    // Determine the entity type
    let type = this._entities.get(object.type);
    if (typeof type === 'undefined')
      return undefined;

    // Assign extra constructor arguments
    let args = type.constructorArgs.map(arg => object[arg]);

    // Construct the entity
    return new type.constructor(world, object.name, new Vector(...object.position), ...args);
  }

  // Load a world from a YAML string
  create(string, ...args)
  {
    // Parse the YAML string
    let yaml = YAML.parse(string);

    // Read the map
    let map = yaml.map.split(/(?:\r?\n)+/).map(row => row.split(/\s+/));

    // Create a new world
    let world = new World(this.game, map[0].length, map.length, ...args);

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
