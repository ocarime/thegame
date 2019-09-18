// Class that represents a 2D vector
export default class Vector
{
  // Constructor
  constructor(x, y)
  {
    this.x = x;
    this.y = y;
  }

  // Invert this vector
  invert()
  {
    return new Vector(-1 * this.x, -1 * this.y);
  }

  // Translate this vector
  translate(vector)
  {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  // Scale this vector
  scale(scale)
  {
    return new Vector(this.x * scale, this.y * scale);
  }
}

// Constants
Vector.origin = new Vector(0, 0);
