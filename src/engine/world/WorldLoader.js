import World from './World.js';
import CommandParser from '..//util/CommandParser.js';
import Vector from '..//util/Vector.js';


// Class that loads a world from a definition
export default class WorldLoader
{
  // Constructor
  constructor(assets)
  {
    // Asset list
    this.assets = assets;
  }

  // Load a world from a definition string
  load(game, string)
  {
    // Create a new world
    let world = new World(game);

    let lines = string.split(/\r?\n/);
    let line = null;

    // Read the map
    let cols = [];
    do
    {
      line = lines.shift().trim();

      let tiles = line.split(/\s+/);
      cols.push(tiles);
    } while (typeof line !== 'undefined' && line !== "")

    // Add the tiles to the map
    for (let y = 0; y < cols.length; y ++)
    {
      for (let x = 0; x < cols[y].length; x ++)
        world.map.setTile(new Vector(x, y), cols[y][x]);
    }

    // Create a new command parser
    let parser = new CommandParser();

    // Register command for spawning entities
    parser.registerCommand('spawn', function(x, y, type, name, ...args) {
      // Get the entity asset
      if (this.assets.entities.hasOwnProperty(type))
      {
        // Create the entity
        let entityClass = this.assets.entities[type];
        let entity = new entityClass(world, name, new Vector(x, y), ...args);
        world.addGameObject(entity);
      }
      else
        console.warn(`Found unknown entity '${type}'`);
    }.bind(this));

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

  // Load a world from a definition URL
  loadUrl(game, url)
  {
    // Create the request
    var request = new XMLHttpRequest();

    // Open the URL
    request.open('GET', url, false);
    request.send();

    // Check if the request was succesful
    if (request.readyState === 4 && request.status === 200)
      return this.load(game, request.responseText);
    else
      throw new Error(`Could not load ${url}: ${request.statusText}`);
  }
}
