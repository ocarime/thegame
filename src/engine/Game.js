import InputEventHandler from './InputEventHandler.js';
import Camera from './Camera.js';
import World from './World.js';
import Entity from './Entity.js';


// Class that handles high-level game logic
export default class Game extends InputEventHandler
{
  // Constructor
  constructor(canvas)
  {
    super();

    // Initialize the canvas
    this.canvas = document.querySelector(canvas);
    this.ctx = this.canvas.getContext('2d');

    // Initialize the game objects
    this.camera = new Camera(this);
    this.world = new World(this);

    this.pointer = undefined;

    // Timing variables
    this._lastRender = Date.now()

    // Preload resources
    this.preload();

    // Add event handlers
    window.addEventListener('load', this._onWindowLoad.bind(this));
    window.addEventListener('resize', this._onWindowResize.bind(this));
  }

  // Draw the game
  _draw(ctx)
  {
    // Draw the background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Apply the camera context
    this.camera.beginContext(ctx);

    // Draw the game objects
    this.world.draw(ctx);
    this.camera.draw(ctx);

    // Restore the camera context
    this.camera.endContext(ctx);
  }

  // Update the game logic
  _update(deltaTime)
  {
    // Update the game objects
    this.world.update(deltaTime);
    this.camera.update(deltaTime);
  }

  // Game loop method
  _loop()
  {
    // Calculate the delta timestamp
    let deltaTime = Date.now() - this._lastRender;

    // Update the game logic
    this._update(deltaTime);

    // Draw the game state
    this._draw(this.ctx);

    // Update timestamp and request new frame
    this._lastRender = Date.now();
    window.requestAnimationFrame(this._loop.bind(this));
  }

  // Load event handler: run the game
  _onWindowLoad(e)
  {
    // Resize the canvas
    this._onWindowResize(e);

    // Start the game loop
    window.requestAnimationFrame(this._loop.bind(this));
  }

  // Resize event handler
  _onWindowResize(e)
  {
    // Set the canvas dimensions
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  // Preload method: implementation left for the user
  preload()
  {
  }

  // Pointer down event: implementation left for the user
  onPointerDown(position)
  {
    this.pointer = new Entity(this.world, 'pointer', this.camera.screenToCam(position));
  }

  // Pointer up event: implementation left for the user
  onPointerUp(position)
  {
    this.pointer.release();
    this.pointer = undefined;
  }
}
