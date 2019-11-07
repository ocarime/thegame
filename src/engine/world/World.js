import Area from './Area.js';
import BinaryHeap from '../util/BinaryHeap.js';
import Entity from './Entity.js';
import GameObject from '../GameObject.js';
import RegionInt from '../util/RegionInt.js';
import Tileset from '../tileset/Tileset.js';
import Vector from '../util/Vector.js';
import WorldInfo from './WorldInfo.js';


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

  // Get neighboring positions
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
  getInfo(position)
  {
    return new WorldInfo(this, position);
  }

  // Get information about all positions in the world
  *[Symbol.iterator]()
  {
    for (let y = this.region.top; y < this.region.bottom; y ++)
      for (let x = this.region.left; x < this.RegionInt.right; x ++)
        yield this.getPosition(new Vector(x, y));
  }

  // Get a path between two positions using the A* algorithm
  getPath(start, end, heuristic)
  {
    heuristic = heuristic || Vector.manhattanDistance;

    // Create the grid and populate it
    let grid = [];
    for (let x = 0; x < this.width; x ++)
    {
      grid[x] = [];
      for (let y = 0; y < this.height; y ++)
      {
        grid[x][y] = this.getInfo(new Vector(x, y));
        grid[x][y].f = 0;
        grid[x][y].g = 0;
        grid[x][y].h = 0;
        grid[x][y].visited = false;
        grid[x][y].closed = false;
        grid[x][y].parent = undefined;
      }
    }

    let heap = new BinaryHeap(node => node.f);
    heap.push(grid[start.x][start.y]);

    // Iterate while the heap is not empty
    while (heap.size() > 0)
    {
      // Grab the lowest f(x) to process next
      let node = heap.pop();

      // End case -- result has been found, return the traced path
      if (node.position.x === end.x && node.position.y === end.y)
      {
        let path = [];
        while (typeof node.parent !== 'undefined')
        {
          path.push(node);
          node = node.parent;
        }
        return path.reverse();
      }

      // Normal case -- move node from open to closed, process each of its neighbors
      node.closed = true;

      // Find all neighbors for the current node
      for (let position of this.getNeighbors(node.position))
      {
        let neighbor = grid[position.x][position.y];

        // If the neighbor is already closed or is not passable, then continue
        if (neighbor.closed || !neighbor.passable)
          continue;

        // The g score is the shortest distance from start to current node
        // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet
        let g = node.g + neighbor.cost;
        let visited = neighbor.visited;

        if (!visited || g < neighbor.g)
        {
          // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
          neighbor.visited = true;
          neighbor.parent = node;
          neighbor.h = neighbor.h || heuristic(neighbor.position, end.position);
          neighbor.g = g;
          neighbor.f = neighbor.g + neighbor.h;

          if (!visited)
            // Pushing to heap will put it in proper place based on the f value
            heap.push(neighbor);
          else
            // Already seen the node, but since it has been rescored we need to reorder it in the heap
            heap.rescoreElement(neighbor);
        }
      }
    }
  }

  // Find a path between two positions using A*
  findPath(start, goal)
  {
    // The set of discovered nodes that need to be (re-)expanded
    // Initially, only the start node is known
    let openSet = [start];

    // The set of closed nodes
    let closedSet = [];

    // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start to n currently known
    let cameFrom = new Map();

    // For node n, gScore[n] is the cost of the cheapest path from start to n currently known
    let gScore = new Map([[start, 0]]);

    // For node n, fScore[n] := gScore[n] + h(n)
    let fScore = new Map([[start, 0]]);

    while (openSet.length > 0)
    {
      // The current node is the node in openSet having the lowest fScore[] value
      let current = undefined;
      for (let node of openSet)
      {
        if (typeof current === 'undefined' || (fScore.has(node) && fScore.get(node) < fScore.get(current)))
          current = node;
      }

      // Check if the current node is the goal
      if (current.x === goal.x && current.y === goal.y)
      {
        let path = [current];
        while (cameFrom.has(current))
        {
          current = cameFrom.get(current);
          path.unshift(current);
        }
        return path;
      }

      openSet.splice(openSet.indexOf(current), 1);
      closedSet.push(current);

      console.log(openSet);

      // Iterate over the neighbors of the current node
      for (let neighbor of this.getNeighbors(current))
      {
        let neighborInfo = this.getTileInfo(neighbor);

        // Check if the node is already visited
        if (closedSet.includes(neighbor))
          continue;

        // Check if the node is passable
        if (!neighborInfo.isPassable())
          continue;

        // gScoreTentative is the distance from start to the neighbor through current
        let gScoreTentative = gScore.get(current) + 1;
        if (!gScore.has(neighbor) || gScoreTentative < gScore.get(neighbor))
        {
          cameFrom.set(neighbor, current);
          gScore.set(neighbor, gScoreTentative);
          fScore.set(neighbor, gScoreTentative + Vector.manhattanDistance(neighbor, goal));

          if (!openSet.includes(neighbor))
            openSet.push(neighbor);
        }
      }
    }

    return [];
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
      let path = this.getPath(this.game.player.position, tilePosition);
      path.shift();
      console.log(path);
      this.game.player.moveTo(...path);

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
