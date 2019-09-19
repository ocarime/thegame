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

    // Transformations
    this.position = new Vector(0, 0);
    this.scale = new Vector(1, 1)
  }

  // Get the position offset to center the screen at the position
  get positionOffset()
  {
    return new Vector(this.game.width / 2, this.game.height / 2);
  }

  // Transform a vector from world space to camera space
  transformVector(vector)
  {
    return vector
      .translate(this.positionOffset.scaleUniform(-1))
      .scale(this.scale.reciprocal())
      .translate(this.position);
  }

  // Transform a region from world space to camera space
  transformRegion(region)
  {
    return region
      .translate(this.positionOffset.scaleUniform(-1))
      .scale(this.scale.reciprocal())
      .translate(this.position);
  }

  // Transform a vector from camera space to world space
  inverseTransformVector(vector)
  {
    return vector
      .translate(this.position.scaleUniform(-1))
      .scale(this.scale)
      .translate(this.positionOffset);
  }

  // Transform a region from camera space to world space
  inverseTransformRegion(region)
  {
    return region
      .translate(this.position.scaleUniform(-1))
      .scale(this.scale)
      .translate(this.positionOffset);
  }

  // Begin the camera context
  beginContext(ctx)
  {
    // Save the current canvas state
    ctx.save();

    // Translate to the center of the screen
    ctx.translate(this.game.width / 2, this.game.height / 2);

    // Apply transformations
    ctx.scale(this.scale.x, this.scale.y);
    ctx.translate(this.position.scaleUniform(-1).x, this.position.scaleUniform(-1).y);
  }

  // End the camera context
  endContext(ctx)
  {
    // Restore the previous canvas state
    ctx.restore();
  }

  // Update the camera logic
  update(deltaTime)
  {
    // TODO: Implement things
  }

  // Convert to string
  toString()
  {
    return `${super.toString()}: position = ${this.position}, scale = ${this.scale}`;
  }
}
