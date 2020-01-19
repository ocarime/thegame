// Class that defines information about a particular position in the world
export default class WorldPositionInfo
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
    if (typeof this.tile !== 'undefined' && this.tile.passable !== true)
      return this.tile.passable;

    // Check if there is an entity
    if (typeof this.entity !== 'undefined')
    {
      // Check if the entity has its own passable variable
      if (typeof this.entity.passable !== 'undefined' && this.entity.passable !== true)
        return this.entity.passable;

      // Check if the entity has an associated tile
      if (typeof this.entity.tile !== 'undefined' && this.entity.tile.passable !== true)
        return this.entity.tile.passable;
    }

    // All checks passed
    return true;
  }

  // Return the mute factor of this position
  get muteFactor()
  {
    // Check if there is a tile
    if (typeof this.tile === 'undefined')
      return 0.0;

    let muteFactor = 1.0;

    // Cechk if the tile has a mute factor
    if (typeof this.tile.muteFactor === 'number')
      muteFactor *= this.tile.muteFactor;

    // Check if there is an entity
    if (typeof this.entity !== 'undefined')
    {
      // Check if the entity has its own muteFactor variable
      if (typeof this.entity.muteFactor === 'number')
        muteFactor *= this.entity.muteFactor;

      // Check if the entity has an associated tile
      if (typeof this.entity.tile !== 'undefined' && typeof this.entity.muteFactor === 'number')
        muteFactor *= this.entity.tile.muteFactor;
    }

    return muteFactor;
  }

  // Return the cost it takes to travel onto this position
  get cost()
  {
    // Check if there is a tile
    if (typeof this.tile !== 'undefined')
      return this.tile.cost;

    return 1;
  }
}
