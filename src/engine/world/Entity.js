import GameObject from '../GameObject.js';


// Base class for defining entities
export default class Entity extends GameObject
{
  // Constructor
  constructor(world, name, position, properties)
  {
    super();

    // The world instance
    this.world = world;

    // Name of the entity
    this.name = name;

    // Position of the entity
    this.position = position;

    // Tile definition for the entity
    this.tileDefinition = typeof properties.type !== 'undefined' && typeof properties.type.tileDefinition !== 'undefined' ? properties.type.tileDefinition : undefined;
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
    // Check if a tile for this entity is defined
    if (typeof this.tileDefinition === 'undefined')
      return;

    // Check if a tile for this entity exists in the tileset
    let tile = this.world.tileset.getByArray(this.tileDefinition, this);
    if (typeof tile === 'undefined')
      return;

    // Draw the tile at the position of the entity
    tile.draw(ctx, this.position);
  }

  // Convert to string
  toString()
  {
    let displayName = (this.can('toDisplayName') ? this.toDisplayName() : this.name);
    return `${super.toString()} ${displayName}`;
  }
}
