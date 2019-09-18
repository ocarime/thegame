// Class that represents a pointer event
export default class PointerEvent
{
  // Constructor
  constructor(type, position)
  {
    this.type = type;
    this.position = position;
  }

  // Get the x and y coordinates
  get x()
  {
    return this.position.x;
  }
  get y()
  {
    return this.position.y;
  }
}
