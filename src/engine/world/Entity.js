import GameObject from '../GameObject.js';


// Base class for defining entities
export default class Entity extends GameObject
{
  // Constructor
  constructor(world, name, position, options)
  {
    super();

    // The world instance
    this.world = world;

    // Name of the entity
    this.name = name;

    // Position of the entity
    this.position = position;
  }

  // Release the entity
  release()
  {
    // Remove the entity from the world
    this.world.removeGameObject(this);
  }

  // Convert to string
  toString()
  {
    let displayName = (this.can('toDisplayName') ? this.toDisplayName() : this.name);
    return `${super.toString()} ${displayName}`;
  }
}
