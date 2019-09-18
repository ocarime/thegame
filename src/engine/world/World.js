import GameObject from '../GameObject.js'


// Class that defines the world
export default class World extends GameObject
{
  // Constructor
  constructor(game)
  {
    super();

    // The game instance
    this.game = game;

    // Entities are visible objects in the world
    this.entities = [];
  }

  // Get an entity
  getEntity(name)
  {
    return this.entities.find(entity => entity.name === name);
  }

  // Get an entity at a position
  getEntityAtPosition(position)
  {
    return this.entities.find(entity => position.distanceTo(entity.position) < 10.0);
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
    // Iterate over the entities and update them
    for (let entity of this.entities)
      entity.update(deltaTime);
  }

  // Event handler when the pointer is pressed
  onPointerPressed(e)
  {
    let position = this.game.camera.screenToCam(e.position);

    // Get the entity at the position
    let entity = this.getEntityAtPosition(position);
    if (entity !== undefined && entity.can('onPointerPressed'))
      entity.onPointerPressed(e);
  }

  // Event handler when the pointer is released
  onPointerReleased(e)
  {
    let position = this.game.camera.screenToCam(e.position);

    // Get the entity at the position
    let entity = this.getEntityAtPosition(position);
    if (entity !== undefined && entity.can('onPointerReleased'))
      entity.onPointerReleased(e);
  }
}
