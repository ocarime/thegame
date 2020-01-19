// Class with math utility functions
export default class MathUtil
{
  // Linear interpolate two numbers
  static lerp(n1, n2, t)
  {
    return n1 * (1 - t) + n2 * t;
  }
}
