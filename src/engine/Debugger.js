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
      let ty = 16 + 16 * line;
      ctx.fillText(`${gameObject}`, tx, ty);
      line ++;
    });
  }
}
