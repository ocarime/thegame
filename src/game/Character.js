import Entity from '../engine/world/Entity.js';


// Class that represents an in-game character
export default class Character extends Entity
{
  // Constructor
  constructor(world, name, position)
  {
    super(world, name, position);
  }

  // Event handler when the pointer is pressed
  onPointerPressed(e)
  {
    console.log(`You clicked ${this.name}!`);
  }
}
