import Area from './Area.js';
import BinaryHeap from '../util/BinaryHeap.js';
import Entity from './Entity.js';
import GameObject from '../GameObject.js';
import PlayerCharacter from './character/PlayerCharacter.js';
import RegionInt from '../util/RegionInt.js';
import Tileset from './Tileset.js';
import Vector from '../util/Vector.js';
import WorldInfo from './WorldInfo.js';


// Class that defines the world
export default class World extends GameObject
{
  // Constructor
  constructor(width = 16, height = 16, tileset)
  {
    super();

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

  // Transform a vector from local space to world space
  transformVector(vector)
  {
    vector = vector.scaleUniform(this.tileset.size);
    vector = super.transformVector(vector);
    return vector;
  }

  // Transform a region from local space to world space
  transformRegion(region)
  {
    region = region.scaleUniform(this.tileset.size);
    region = super.transformRegion(region);
    return region;
  }

  // Transform a vector from world space to local space
  inverseTransformVector(vector)
  {
    vector = super.inverseTransformVector(vector);
    vector = vector.scaleUniform(1 / this.tileset.size);
    return vector;
  }

  // Transform a region from world space to local space
  inverseTransformRegion(region)
  {
    region = super.inverseTransformRegion(region);
    region = region.scaleUniform(1 / this.tileset.size);
    return region;
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

  // Get the player character
  get player()
  {
    return this.entities.find(entity => entity instanceof PlayerCharacter);
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

  // Get a path between two positions using the A* algorithm
  getPath(start, end)
  {
    // Check if the end is reachable
    let endInfo = this.getInfo(end);
    if (!endInfo.passable)
      return undefined;

    // For node n, parent[n] is the node immediately preceding it on the cheapest path from start to n currently known
    let parent = new Map();

    // For node n, gScore[n] is the cost of the cheapest path from start to n currently known
    let gScore = new Map([[start.toString(), 0]]);

    // For node n, fScore[n] = gScore[n] + h(n)
    let fScore = new Map([[start.toString(), 0]]);

    // The heap of discovered nodes that need to be (re-)expanded
    let openHeap = new BinaryHeap(node => fScore.get(node.toString()) || 0);
    openHeap.push(start);

    // The set of closed nodes
    let closedSet = new Set();

    // Iterate while the heap is not empty
    while (openHeap.size > 0)
    {
      // Grab the lowest f(x) to process next
      let node = openHeap.pop();

      // End case -- result has been found, return the traced path
      if (node.x === end.x && node.y === end.y)
      {
        let path = [node];
        while (parent.has(node.toString()))
        {
          node = parent.get(node.toString());
          path.unshift(node);
        }
        return path;
      }

      // Normal case -- move node from open to closed, process each of its neighbors
      closedSet.add(node.toString());

      // Find all neighbors for the current node
      for (let neighbor of this.getNeighbors(node))
      {
        let neighborInfo = this.getInfo(neighbor);

        // If the neighbor is already closed or is not passable, then continue
        if (closedSet.has(neighbor.toString()) || !neighborInfo.passable)
          continue;

        // The g score is the shortest distance from start to current node
        // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet
        let gScoreTentative = gScore.get(node.toString()) + neighborInfo.cost;
        if (!gScore.has(neighbor.toString()) || gScoreTentative < gScore.get(neighbor.toString()))
        {
          parent.set(neighbor.toString(), node);
          gScore.set(neighbor.toString(), gScoreTentative);
          fScore.set(neighbor.toString(), gScoreTentative + Vector.manhattanDistance(neighbor, end));

          if (!openHeap.has(neighbor))
            openHeap.push(neighbor);
          else
            openHeap.rescoreElement(neighbor);
        }
      }
    }
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
          tile.draw(ctx, position);
      }
    }
  }

  // Event handler when the pointer is hovered
  onPointerHovered(e)
  {
    let position = this.inverseTransformVector(e.position).trunc();

    // Check if the tile is in the world
    if (!this.region.contains(position))
      return;

    // Get the entity at the position
    let entity = this.getEntityAtPosition(position);
    if (entity !== undefined && entity.can('onInspect'))
      entity.onInspect(e);
  }

  // Event handler when the pointer is pressed
  onPointerPressed(e)
  {
    let position = this.inverseTransformVector(e.position).trunc();

    console.log(position);

    // Check if the tile is in the world
    if (!this.region.contains(position))
      return;

    // Get the entity at the position
    let entity = this.getEntityAtPosition(position);
    if (entity !== undefined && entity.can('onInteract'))
    {
      // Interact with the entity
      entity.onInteract(e);
    }
    else
    {
      // Move the player if present
      if (typeof this.player !== 'undefined')
      {
        let path = this.getPath(this.player.position, position);
        if (path !== undefined)
          this.player.moveTo(...path.slice(1));
      }
    }
  }

  // Convert to string
  toString()
  {
    return `${super.toString()} [${this.entities.length} entities]: width = ${this.width}, height = ${this.height}`;
  }
}
