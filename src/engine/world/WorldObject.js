import GameObject from '../GameObject.js'


// Base class for all world objects
export default class WorldObject extends GameObject
{
  // Constructor
  constructor(world, name)
  {
    super(world.game);

    this.world = world;
    this.name = name;
  }
}
