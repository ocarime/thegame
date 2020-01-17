import Entity from '../../engine/world/Entity.js';


// Class that defines a piano entity
export default class Piano extends Entity
{
  // Constructor
  constructor(world, name, position, properties)
  {
    super(world, name, position, properties);

    // Properties of the entity
    this.url = properties.url;
  }

  // Interaction event handler
  onInteract(e)
  {
    window.open(this.url, '_blank');
  }
}
