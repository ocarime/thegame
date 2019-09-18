import GameObject from '../GameObject.js';


// Base class for defining entities
export default class Entity extends GameObject
{
  // Constructor
  constructor(world, name, position)
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

  // Draw the entity
  draw(ctx)
  {
    // Implementation left to subclasses
  }

  // Update the entity logic
  update(deltaTime)
  {
    // Implementation left to subclasses
  }

  // Convert to string
  toString()
  {
    return `${super.toString()} ${this.name} at ${this.position}`;
  }
}
