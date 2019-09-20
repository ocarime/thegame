import Vector from './Vector.js';


// Class that represents a 2D region
export default class Region
{
  // Constructor
  constructor(minX, minY, maxX, maxY)
  {
    this.minX = Math.min(minX, maxX);
    this.maxX = Math.max(minX, maxX);
    this.minY = Math.min(minY, maxY);
    this.maxY = Math.max(minY, maxY);
  }

  // Convenient methods to get the dimensions
  get width()
  {
    return this.maxX - this.minX;
  }
  get height()
  {
    return this.maxY - this.minY;
  }
  get dimensions()
  {
    return new Vector(this.width, this.height);
  }
  get area()
  {
    return this.width * this.height;
  }

  // Convenient methods to get the corners as vectors
  get topLeft()
  {
    return new Vector(this.minX, this.minY);
  }
  get topRight()
  {
    return new Vector(this.maxX, this.minY);
  }
  get bottomLeft()
  {
    return new Vector(this.minX, this.maxY);
  }
  get bottomRight()
  {
    return new Vector(this.maxX, this.maxY);
  }

  // Return if a vector is inside this region
  contains(vector)
  {
    return vector.x >= this.minX && vector.x <= this.maxX && vector.y >= this.minY && vector.y <= this.maxY;
  }

  // Expand this region
  expand(left, top, right, bottom)
  {
    return new Region (this.minX - left, this.minY - top, this.maxX + right, this.maxY + bottom);
  }

  // Contract this region
  contract(left, top, right, bottom)
  {
    return new Region (this.minX + left, this.minY + top, this.maxX - right, this.maxY - bottom);
  }

  // Translate this region
  translate(vector)
  {
    return new Region(this.minX + vector.x,  this.minY + vector.y, this.maxX + vector.x, this.maxY + vector.y);
  }

  // Scale this region
  scale(vector)
  {
    return new Region(this.minX * vector.x, this.minY * vector.y, this.maxX * vector.x, this.maxY * vector.y);
  }

  // Scale this region uniformly
  scaleUniform(scalar)
  {
    return this.scale(new Vector(scalar, scalar));
  }

  // Convert to string
  toString()
  {
    return `(${this.minX}, ${this.minY}, ${this.maxX}, ${this.maxY})`;
  }
}
