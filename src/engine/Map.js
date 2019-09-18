import MapTile from './MapTile.js';


// Class for a coherent map region
export default class Map
{
  // Constructor: create a map from
  constructor(tileset, width, height)
  {
    this.tileset = tileset;
    this.tiles = Array.fill(Array.fill(null, width), height);
  }

  // Return a tile at position x, y
  getTile(x, y)
  {
    return this.tiles[y][x];
  }

  // Set a tile at position x, y
  setTile(x, y, tile)
  {
    this.tiles[y][x] = tile;
  }

  // Generate a map for testing purposes
  static generate(tileset, width, height)
  {
    let map = new Map(tileset, width, height);

    // Generate the tiles
    for (let y = 0; y < height; y ++)
    {
      tiles[y] = [];
      for (let x = 0; x < width; x ++)
      {
        if (x == 0 || x == width - 1 || y == 0 || y == height - 1)
          // Add a wall
          tiles[y][x] = new MapTile();
        else
          // Add a floor
          tiles[y][x] = new MapTile();
      }
    }
  }

  // Create the map
  map =
}
