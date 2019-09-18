import GameObject from '../GameObject.js'


// Base class for all world objects
export default class WorldObject extends GameObject
{
  // Constructor
  constructor(world, name)
  {
    super();

    // The world instance
    this.world = world;

    // The name of this entity
    this.name = name;
  }
}
