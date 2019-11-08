// Class that defines information about a particular position in the world
export default class WorldInfo
{
  // Constructor
  constructor(world, position)
  {
    this.world = world;
    this.position = position;
    this.tile = world.getTile(position);
    this.entity = world.getEntityAtPosition(position);
  }

  // Return if this position is passable by characters
  get passable()
  {
    // Check if there is a tile
    if (typeof this.tile === 'undefined' || !this.tile.passable)
      return false;

    // All checks passed
    return true;
  }

  // Return the cost it takes to travel onto this position
  get cost()
  {
    return 1;
  }
}
