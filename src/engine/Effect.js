import WorldObject from './WorldObject.js';


// Base class for defining effects
export default class Effect extends WorldObject
{
  // Constructor
  constructor(world, name)
  {
    super(world, name);

    // Add the effect to the world
    this.world.effects.push(this);
  }

  // Release the effect
  release()
  {
    // Remove the effect from the world
    this.world.effects.splice(this.world.effects.indexOf(this), 1);
  }

  // Update the effect logic
  update(deltaTime)
  {
    // Implementation left to subclasses
  }
}
