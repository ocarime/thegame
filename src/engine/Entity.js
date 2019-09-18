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
    // Draw the name of the entity
    ctx.fillStyle = 'white';
    ctx.fillRect(this.position.x-5, this.position.y-5, 10, 10);

    ctx.font = '12px monospace';
    ctx.textAlign = "center";
    ctx.fillText(`Entity: ${this.name}`, this.position.x, this.position.y - 10);
  }

  // Update the entity logic
  update(deltaTime)
  {
    // Implementation left to subclasses
  }
}
