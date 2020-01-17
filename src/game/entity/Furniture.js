import Entity from '../../engine/world/Entity.js';


// Class that defines a piano entity
export default class Furniture extends Entity
{
  // Constructor
  constructor(world, name, position, properties)
  {
    super(world, name, position, properties);

    // Properties of the entity
    this.type = properties.type;
  }
}