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

  // Calculate the distance between two vectors
  static distance(vector1, vector2)
  {
    return Math.sqrt(Math.pow(vector2.x - vector1.x, 2) + Math.pow(vector2.y - vector1.y, 2));
  }

  // Calculate the Manhattan distance between two vectors
  static manhattanDistance(vector1, vector2)
  {
    return Math.abs(vector2.x - vector1.x) + Math.abs(vector2.y - vector1.y);
  }
}

// Constants
Vector.origin = new Vector(0, 0);
Vector.right = new Vector(1, 0);
Vector.left = new Vector(-1, 0);
Vector.down = new Vector(0, 1);
Vector.up = new Vector(-1, 0);
