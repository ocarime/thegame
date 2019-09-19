import GameObject from './GameObject.js';


// Class for debugging purposes
export default class Debugger extends GameObject
{
  // Constructor
  constructor(game)
  {
    super();

    // The game instance
    this.game = game;

    // The pointer position
    this.pointerPosition = undefined;
    this.pointerDown = false;
  }

  // Draw the debugger
  draw(ctx)
  {
    // Print all game objects
    let line = 0;

    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = 'lime';

    this.game._each(function(gameObject, parents) {
      let tx = 16 + 12 * parents.length;
      let ty = 16 + 14 * line;
      ctx.fillText(`${gameObject}`, tx, ty);
      line ++;
    });

    // Draw the pointer
    if (typeof this.pointerPosition !== 'undefined')
    {
      ctx.fillStyle = (this.pointerDown ? 'white': 'lime');
      ctx.fillRect(this.pointerPosition.x - 5, this.pointerPosition.y - 5, 10, 10);

      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = 'lime';
      ctx.fillText(`${this.pointerPosition}`, this.pointerPosition.x - 5, this.pointerPosition.y - 10);
    }
  }

  // Pointer hovered event
  onPointerHovered(e)
  {
    this.pointerPosition = e.position;
  };

  // Pointer pressed event
  onPointerPressed(e)
  {
    this.pointerDown = true;
  }

  // Pointer released event
  onPointerReleased(e)
  {
    this.pointerDown = false;
  }
}
