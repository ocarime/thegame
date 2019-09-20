import Region from './Region.js';


// Class that represents a 2D vector
export default class Vector
{
  // Constructor
  constructor(x, y)
  {
    this.x = x;
    this.y = y;
  }

  // Translate this vector
  translate(vector)
  {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  // Scale this vector
  scale(vector)
  {
    return new Vector(this.x * vector.x, this.y * vector.y);
  }

  // Scale this vector uniformly
  scaleUniform(scalar)
  {
    return this.scale(new Vector(scalar, scalar));
  }

  // Get the multipicative inverse of this vector
  reciprocal()
  {
    return new Vector(1 / this.x, 1 / this.y);
  }

  // Round the vector to nearest integer values
  round()
  {
    return new Vector(Math.round(this.x), Math.round(this.y));
  }

  // Truncate the vector to integer values
  trunc()
  {
    return new Vector(Math.trunc(this.x), Math.trunc(this.y));
  }

  // Calculate the distance to another vector
  distanceTo(vector)
  {
    return Math.sqrt(Math.pow(vector.x - this.x, 2) + Math.pow(vector.y - this.y, 2));
  }

  // Convert to region
  toRegion()
  {
    return new Region(this.x, this.y, this.x, this.y);
  }

  // Convert to string
  toString()
  {
    return `${this.constructor.name}(${this.x}, ${this.y})`;
  }
}

// Constants
Vector.origin = new Vector(0, 0);
Vector.right = new Vector(1, 0);
Vector.left = new Vector(-1, 0);
Vector.down = new Vector(0, 1);
Vector.up = new Vector(-1, 0);
