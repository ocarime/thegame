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

    // Transformations of the camera
    this.position = Vector.origin;
    this.scale = 1.0;
  }

  // Convert camera to screen coordinates
  screenToCam(vector)
  {
    return vector
      .translate(this.position.invert())
      .scale(1.0 / this.scale)
      .translate(new Vector(this.game.width / 2, this.game.height / 2).invert());
  }

  // Convert screen to camera coordinates
  camToScreen(vector)
  {
    return vector
      .translate(new Vector(this.game.width / 2, this.game.height / 2))
      .scale(this.scale)
      .translate(this.position);
  }

  // Move the camera target to a position
  moveTo(x, y)
  {
    this.position.x = x;
    this.position.y = y;
  }

  // Scale the camera to a factor
  scaleTo(scale)
  {
    this.scale = scale;
  }

  // Begin the camera context
  beginContext(ctx)
  {
    // Save the current canvas state
    ctx.save();

    // Translate to the center of the screen
    ctx.translate(this.game.width / 2, this.game.height / 2);

    // Apply transformations
    ctx.scale(this.scale, this.scale);
    ctx.translate(this.position.x, this.position.y);
  }

  // End the camera context
  endContext(ctx)
  {
    // Restore the previous canvas state
    ctx.restore();
  }

  // Draw the camera
  draw(ctx)
  {
    // Draw the gizmo
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(10, 0);
    ctx.stroke();

    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 10);
    ctx.stroke();
  }

  // Update the camera logic
  update(deltaTime)
  {
    // TODO: Implement things
  }

  // Convert to string
  toString()
  {
    return super.toString() + `: position: ${this.position}, scale: ${this.scale}`;
  }
}
