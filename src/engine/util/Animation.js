import GameObject from '../GameObject.js';


// Class that defines an animation
export default class Animation extends GameObject
{
  // Constructor
  constructor(object, ...keyframes)
  {
    super();

    // Animation variables
    this.object = object;
    this.keyframes = keyframes.sort((a, b) => a[0] - b[0]);

    // The current animation state
    this.initialState = {};
    Object.assign(this.initialState, this.object);

    this.currentTime = 0;
    this.currentKeyframe = this.keyframes.shift();
    this.lastKeyframe = [0, this.initialState];

    // Update the animation
    this.update(0);

    // Debug variables
    this.debugInfo = {color: 'silver', level: 2};
  }

  // Get if the animation is finished, i.e. no keyframe is selected
  get finished()
  {
    return typeof this.currentKeyframe === 'undefined';
  }

  // Update the animation
  update(deltaTime)
  {
    // Increase the time
    this.currentTime += deltaTime;

    // Check if we are currently animating
    if (typeof this.currentKeyframe !== 'undefined')
    {
      // Check if we are arrived at the current keyframe
      if (this.currentTime >= this.currentKeyframe[0])
      {
        // Set the properties
        Object.assign(this.object, this.currentKeyframe[1]);

        // Select the next keyframe
        this.lastKeyframe = this.currentKeyframe;
        this.currentKeyframe = this.keyframes.shift();
      }
      else
      {
        // Interpolate the properties
        let progress = (this.currentTime - this.lastKeyframe[0]) / (this.currentKeyframe[0] - this.lastKeyframe[0]);
        let interpolated = Animation.lerpObject(this.lastKeyframe[1], this.currentKeyframe[1], progress);
        Object.assign(this.object, interpolated);
      }
    }
  }

  // Convert to string
  toString()
  {
    return `${super.toString()} [${this.currentTime}]`
  }

  // Linearly interpolate a number
  static lerp(from, to, t)
  {
    return (1 - t) * from + t * to;
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
      interpolated[property] = Animation.lerp(from[property], to[property], t);
    }

    // Return the object
    return interpolated;
  }
}
