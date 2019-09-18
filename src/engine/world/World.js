import GameObject from '../GameObject.js'


// Class that defines the world
export default class World extends GameObject
{
  // Constructor
  constructor(game)
  {
    super(game);

    // Entities are visible objects in the world and can thus be drawn
    this.entities = [];

    // Effects are invisible objects in the world
    this.effects = [];
  }

  // Get an entity
  getEntity(name)
  {
    return this.entities.find(entity => entity.name === name);
  }

  // Get an effect
  getEffect(name)
  {
    return this.effects.find(effect => effect.name === name);
  }

  // Draw all entities
  draw(ctx)
  {
    // Iterate over the entities and draw them
    for (let entity of this.entities)
      entity.draw(ctx);
  }

  // Update all entities and effects
  update(deltaTime)
  {
    // Iterate over the effects and update them
    for (let effect of this.effects)
      effect.update(deltaTime);

    // Iterate over the entities and update them
    for (let entity of this.entities)
      entity.update(deltaTime);
  }
}
