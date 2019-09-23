import Vector from './Vector.js';


// Class that represents a 2D region with integers as coordinates
export default class RegionInt
{
  // Constructor
  constructor(left, top, right, bottom)
  {
    this.left = Math.trunc(Math.min(left, right));
    this.right = Math.trunc(Math.max(left, right));
    this.top = Math.trunc(Math.min(top, bottom));
    this.bottom = Math.trunc(Math.max(top, bottom));
  }

  // Convenient methods to get the dimensions
  get width()
  {
    return this.right - this.left;
  }
  get height()
  {
    return this.bottom - this.top;
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
    return new Vector(this.left, this.top);
  }
  get topRight()
  {
    return new Vector(this.right, this.top);
  }
  get bottomLeft()
  {
    return new Vector(this.left, this.bottom);
  }
  get bottomRight()
  {
    return new Vector(this.right, this.bottom);
  }

  // Return if a vector is inside this region
  contains(vector)
  {
    return vector.x >= this.left && vector.x < this.right && vector.y >= this.top && vector.y < this.bottom;
  }

  // Expand this region
  expand(region)
  {
    return new RegionInt(this.left - region.left, this.top - region.top, this.right + region.right, this.bottom + region.bottom);
  }

  // Contract this region
  contract(region)
  {
    return new RegionInt(this.left + region.left, this.top + region.top, this.right - region.right, this.bottom - region.bottom);
  }

  // Translate this region
  translate(vector)
  {
    return new RegionInt(this.left + vector.x,  this.top + vector.y, this.right + vector.x, this.bottom + vector.y);
  }

  // Scale this region
  scale(vector)
  {
    return new RegionInt(this.left * vector.x, this.top * vector.y, this.right * vector.x, this.bottom * vector.y);
  }

  // Scale this region uniformly
  scaleUniform(scalar)
  {
    return this.scale(new Vector(scalar, scalar));
  }

  // Convert to string
  toString()
  {
    return `${this.constructor.name}(${this.left}, ${this.top}, ${this.right}, ${this.bottom})`;
  }

  // Create a region from a corner vector and dimensions
  static fromVector(vector, width = 1, height = 1)
  {
    return new RegionInt(vector.x, vector.y, vector.x + width, vector.y + height);
  }

  // Create a region from two corner vectors
  static fromVectorCorners(vector1, vector2)
  {
    return new RegionInt(vector1.x, vector1.y, vector2.x, vector2.y);
  }
}
