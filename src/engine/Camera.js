import GameObject from './GameObject.js'
import Vector from './util/Vector.js'


// Class that defines the camera
export default class Camera extends GameObject
{
  // Constructor
  constructor(game)
  {
    super();

    // The game instance
    this.game = game;
  }

  // Return the position offset to center the screen at the position
  get offset()
  {
    return new Vector(this.game.width / 2, this.game.height / 2).trunc();
  }

  // Transform a vector from camera space to world space
  transformVector(vector)
  {
    // Apply transformations of the parents
    if (typeof this.parent !== 'undefined' || parent instanceof Camera)
      vector = this.parent.transformVector(vector);

    return vector;
  }

  // Transform a region from camera space to world space
  transformRegion(region)
  {
    // Apply transformations of the parents
    if (typeof this.parent !== 'undefined')
      region = this.parent.transformRegion(region);

    return region;
  }

  // Transform a vector from world space to camera space
  inverseTransformVector(vector)
  {
    // Apply inverse camera offset
    vector = vector.translate(this.offset.scaleUniform(-1));

    // Apply inverse transformations of the parents
    if (typeof this.parent !== 'undefined')
      vector = this.parent.inverseTransformVector(vector);

    // Apply inverse transformations of this game object
    return vector
      .scale(this.scale.reciprocal())
      .translate(this.position);
  }

  // Transform a region from world space to camera space
  inverseTransformRegion(region)
  {
    // Apply inverse camera offset
    region = region.translate(this.offset.scaleUniform(-1));

    // Apply inverse transformations of the parents
    if (typeof this.parent !== 'undefined' || parent instanceof Camera)
      region = this.parent.inverseTransformRegion(region);

    // Apply inverse transformations of this game object
    return region
      .scale(this.scale.reciprocal())
      .translate(this.position);
  }

  // Begin the canvas context
  beginContext(ctx)
  {
    // Save the current canvas state
    ctx.save();

    // Translate to the center of the screen
    ctx.translate(this.offset.x, this.offset.y);

    // Apply transformations
    ctx.scale(this.scale.x, this.scale.y);
    ctx.translate(this.position.scaleUniform(-1).x, this.position.scaleUniform(-1).y);
  }

  // End the canvas context
  endContext(ctx)
  {
    // Restore the previous canvas state
    ctx.restore();
  }
}
