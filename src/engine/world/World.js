import GameObject from '../GameObject.js'
import Entity from './Entity.js';
import WorldMap from './WorldMap.js';
import Tileset from '../tileset/Tileset.js';


// Class that defines the world
export default class World extends GameObject
{
  // Constructor
  constructor(game, tileset = undefined)
  {
    super();

    // The game instance
    this.game = game;

    // The map for this world
    this.map = new WorldMap(16, 16);
  }

  // Get and set the map
  get map()
  {
    return this._map;
  }
  set map(value)
  {
    if (typeof this._map === 'undefined')
      this._map = this.addGameObject(value);
    else
      this._map = this.replaceGameObject(this._map, value);
  }

  // Get all entities
  get entities()
  {
    return Array.from(this.getGameObjects(Entity));
  }

  // Get an entity
  getEntity(name)
  {
    return this.entities.find(entity => entity.name === name);
  }

  // Get an entity at a position
  getEntityAtPosition(position)
  {
    return this.entities.find(entity => position.distanceTo(entity.position) < 5.0);
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
    return `${super.toString()} [${this.entities.length} entities]`;
  }
}
