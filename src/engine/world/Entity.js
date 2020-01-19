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

    // Entity specific properties
    if (typeof properties.entityType !== 'undefined')
    {
      // Set defained or default properties
      if (typeof properties.entityType.properties !== 'undefined')
        for (let [property, defaultValue] of Object.entries(properties.entityType.properties))
          this[property] = typeof properties[property] != 'undefined' ? properties[property] : defaultValue;

      // Set the tile definition
      if (typeof properties.entityType.tileDefinition !== 'undefined')
        this.tileDefinition = properties.entityType.tileDefinition;
    }

    // Debug variables
    this.debugInfo = {color: 'silver', level: 2};
  }

  // Release the entity
  release()
  {
    // Remove the entity from the world
    this.world.removeGameObject(this);
  }

  // Get the defined tile for this entity
  get tile()
  {
    if (typeof this.tileDefinition === 'undefined')
      return undefined;
    else
      return this.world.tileset.getByArray(this.tileDefinition, this);
  }

  // Draw the entity
  draw(ctx)
  {
    // Check if a tile for this entity exists in the tileset
    if (typeof this.tile !== 'undefined')
      this.tile.draw(ctx, this.position);
  }

  // Convert to string
  toString()
  {
    let displayName = (this.can('toDisplayName') ? this.toDisplayName() : this.name);
    return `${super.toString()}: ${displayName}`;
  }
}
