import Vector from './util/Vector.js';


// Class that can handle input events
export default class InputEventHandler
{
  // Constructor
  constructor()
  {
    // Add event handlers
    document.addEventListener('pointerdown', this.pointerDown.bind(this));
    document.addEventListener('pointerup', this.pointerUp.bind(this));
  }

  // Pointer down event handler
  pointerDown(e)
  {
    // Fire the game pointer down event
    this.onPointerDown(new Vector(e.x, e.y));
  }

  // Pointer up event handler
  pointerUp(e)
  {
    // Fire the game pointer down event
    this.onPointerUp(new Vector(e.x, e.y));
  }

  // Pointer down event: implementation left for the user
  onPointerDown(position)
  {
  }

  // Pointer up event: implementation left for the user
  onPointerUp(position)
  {
  }
}
