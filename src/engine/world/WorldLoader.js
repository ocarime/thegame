import Area from './Area.js';
import CommandParser from '..//util/CommandParser.js';
import Vector from '..//util/Vector.js';
import World from './World.js';


// Class that loads a world from a definition
export default class WorldLoader
{
  // Constructor
  constructor(game, assets)
  {
    this.game = game;

    // Asset list
    this.assets = assets;
  }

  // Load a world from a definition string
  load(string, ...args)
  {
    let lines = string.split(/\r?\n/);
    let line = "";

    // Read the map
    let cols = [];
    line = lines.shift().trim();
    while (typeof line !== 'undefined' && line !== "")
    {
      let tiles = line.split(/\s+/);
      cols.push(tiles);

      line = lines.shift().trim();
    }

    // Create a new world
    let world = new World(this.game, cols[0].length, cols.length, ...args);

    // Add the tiles to the map
    for (let y = 0; y < cols.length; y ++)
    {
      for (let x = 0; x < cols[y].length; x ++)
        world.setTile(new Vector(x, y), cols[y][x]);
    }

    // Create a new command parser
    let parser = new CommandParser();

    // Register command for defining areas
    parser.registerCommand('area', function(left, top, right, bottom, audioClip) {
      // Define the area
      let worldRegion = new Area(world, parseInt(left), parseInt(top), parseInt(right), parseInt(bottom), typeof audioClip !== 'undefined' ? this.assets.audioClips[audioClip] : undefined);
      world.addGameObject(worldRegion);
    }.bind(this));

    // Register command for spawning entities
    parser.registerCommand('entity', function(x, y, type, name, ...args) {
      // Get the entity asset
      if (this.assets.entities.hasOwnProperty(type))
      {
        // Create the entity
        let entityClass = this.assets.entities[type];
        let entity = new entityClass(world, name, new Vector(parseInt(x), parseInt(y)), ...args);
        world.addGameObject(entity);
      }
      else
        console.warn(`Found unknown entity '${type}'`);
    }.bind(this));

    // Register command for player spawnpoint
    parser.registerCommand('playerspawn', function(x, y) {
      world.playerSpawn = new Vector(parseInt(x), parseInt(y));
    });

    // Iterate over the lines
    for (let line of lines)
    {
      // Skip empty lines
      if (line.trim() === '')
        continue;

      // Parse the command
      parser.parse(line);
    }

    // Return the world
    return world;
  }
}
