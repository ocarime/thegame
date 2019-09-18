import GameObject from '../GameObject.js'
import Entity from './Entity.js';


// Class that defines the world
export default class World extends GameObject
{
  // Constructor
  constructor(game)
  {
    super();

    // The game instance
    this.game = game;
  }

  // Get all entities
  getEntities()
  {
    return Array.from(this.getGameObjects(Entity));
  }

  // Get an entity
  getEntity(name)
  {
    return this.getEntities().find(entity => entity.name === name);
  }

  // Get an entity at a position
  getEntityAtPosition(position)
  {
    return this.getEntities().find(entity => position.distanceTo(entity.position) < 5.0);
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

  // Convert to string
  toString()
  {
    return `${super.toString()}: ${this.getEntities().length} entities`;
  }
}
