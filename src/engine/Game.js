import Camera from './util/Camera.js';
import Vector from './util/Vector.js';
import World from './world/World.js';
import Entity from './world/Entity.js';
import PointerEvent from './event/PointerEvent.js';


// Class that handles high-level game logic
export default class Game
{
  // Constructor
  constructor(canvas)
  {
    // Initialize the canvas
    this.canvas = document.querySelector(canvas);
    this.ctx = this.canvas.getContext('2d');

    // Initialize the game objects
    this.camera = new Camera(this);
    this.world = new World(this);

    // Timing variables
    this._lastRender = Date.now()

    // Add event handlers for window
    window.addEventListener('load', function() {
      // Set the canvas dimensions
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;

      // Start the game loop
      window.requestAnimationFrame(this._loop.bind(this));
    }.bind(this));

    window.addEventListener('resize', function() {
      // Set the canvas dimensions
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }.bind(this));

    // Add event handlers for document
    document.addEventListener('pointerdown', function(e) {
      // Handle the ponter pressed event
      this.onPointerPressed(new PointerEvent('press', new Vector(e.x, e.y)));
    }.bind(this));

    document.addEventListener('pointerup', function(e) {
      // Handle the pointer released event
      this.onPointerReleased(new PointerEvent('release', new Vector(e.x, e.y)));
    }.bind(this));

    // Preload resources
    this.preload();
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

  // Preload method
  preload()
  {
    // Implementation left for the user
  }

  // Event handler when the pointer is pressed
  onPointerPressed(e)
  {
    // Handle events in game objects
    this.world.onPointerPressed(e);
  }

  // Event handler when the pointer is released
  onPointerReleased(e)
  {
    // Handle events in game objects
    this.world.onPointerReleased(e);
  }
}
