import CommandParser from '../util/CommandParser.js';
import Tileset from './Tileset.js';


// Class that loads a tileset from a definition
export default class TilesetLoader
{
  // Load from JSON
  static load(string)
  {
    // Create a new tileset
    let tileset = new Tileset();

    // Create a new command parser
    let parser = new CommandParser();

    // Register command for defining tile size
    parser.registerCommand('size', function(size) {
      // Set the size of the tiles
      tileset.tileSize = parseInt(size);
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

  // Load from JSON using a URL
  static loadUrl(url)
  {
    // Create the request
    var request = new XMLHttpRequest();

    // Open the URL
    request.open('GET', url, false);
    request.send();

    // Check if the request was succesful
    if (request.readyState === 4 && request.status === 200)
      return TilesetLoader.load(request.responseText);
    else
      throw new Error(`Could not load ${url}: ${request.statusText}`);
  }
}
