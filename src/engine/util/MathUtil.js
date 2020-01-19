// Class with math utility functions
export default class MathUtil
{
  // Linear interpolate two numbers
  static lerp(n1, n2, t)
  {
    return n1 * (1 - t) + n2 * t;
  }

  // Linearly interpolate numeric properties of an object
  static lerpObject(from, to, t)
  {
    // Create an interpolated object
    let interpolated = {};

    // Iterate over the properties
    for (let property in from)
    {
      // Check if the property is valid
      if (!from.hasOwnProperty(property) || !to.hasOwnProperty(property))
        continue;

      // Check if the property is a number
      if (typeof from[property] !== 'number' || typeof to[property] !== 'number')
        continue;

      // Interpolate the property
      interpolated[property] = MathUtil.lerp(from[property], to[property], t);
    }

    // Return the object
    return interpolated;
  }
}
