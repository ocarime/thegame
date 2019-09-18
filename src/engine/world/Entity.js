import WorldObject from './WorldObject.js';


// Base class for defining entities
export default class Entity extends WorldObject
{
  // Constructor
  constructor(world, name, position)
  {
    super(world, name);

    // Position of the entity
    this.position = position;

    // Add the entity to the world
    this.world.entities.push(this);
  }

  // Release the entity
  release()
  {
    // Remove the entity from the world
    this.world.entities.splice(this.world.entities.indexOf(this), 1);
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
}
