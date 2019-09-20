import CommandParser from '../util/CommandParser.js';
import Tileset from './Tileset.js';


// Class that loads a tileset from a definition
export default class TilesetLoader
{
  // Load a tileset from a definition string
  load(string)
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
    parser.registerCommand('tile', function(name, url, ...aliases) {
      // Register a new tile
      tileset.registerTile(name, url, aliases);
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

  // Load a tileset from a definition URL
  async loadUrl(url, ...args)
  {
    // Fetch the URL
    let response = await fetch(url);
    let responseText = await response.text();

    // Load the world
    return this.load(responseText, ...args);
  }
}
