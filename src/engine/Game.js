import GameObject from './GameObject.js'
import Camera from './Camera.js';
import Vector from './util/Vector.js';
import World from './world/World.js';
import PointerEvent from './event/PointerEvent.js';


// Class that handles high-level game logic
export default class Game extends GameObject
{
  // Overridable methods:
  //   preload()          Loads resources before the game starts
  //   draw(ctx)          Draws this game object using the canvas context
  //   update(deltaTime)  Updates the logic of this game object
  //   beginContext(ctx)  Is called before drawing itself and all children
  //   endContext(ctx)    Is called after drawing itself and all children

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

    // Timing variables
    this._lastRender = Date.now()

    // Add event handler for window loaded
    window.addEventListener('load', function() {
      // Set the canvas dimensions
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;

      // Preload the assets
      if (this.can('preload'))
        this.preload.bind(this)();

      // Send preload finish event
      window.dispatchEvent(new Event('game.preload'));
    }.bind(this));

    // Add event handler for preload finished
    window.addEventListener('game.preload', function() {
      // Start the game loop
      window.requestAnimationFrame(this._loop.bind(this));
    }.bind(this));

    // Add event handler for window resized
    window.addEventListener('resize', function() {
      // Set the canvas dimensions
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }.bind(this));

    // Add event handlers for pointer pressed
    document.addEventListener('pointerdown', function(e) {
      // Create the pointer event
      let event = new PointerEvent('press', new Vector(e.x, e.y));

      // Handle the pointer pressed event
      this._each(function(gameObject) {
        // Check if this game object can handle pointer pressed events
        if (gameObject.can('onPointerPressed'))
          gameObject.onPointerPressed(event);
      }.bind(this));
    }.bind(this));

    // Add event handler for pointer released
    document.addEventListener('pointerup', function(e) {
      // Create the pointer event
      let event = new PointerEvent('release', new Vector(e.x, e.y));

      // Handle the pointer released event
      this._each(function(gameObject) {
        // Check if this game object can handle pointer released events
        if (gameObject.can('onPointerReleased'))
          gameObject.onPointerReleased(event);
      }.bind(this));
    }.bind(this));
  }

  // Return the dimensions of the canvas
  get width()
  {
    return this.canvas.width;
  }
  get height()
  {
    return this.canvas.height;
  }

  // Get and set the camera
  get camera()
  {
    return this._camera;
  }
  set camera(value)
  {
    if (typeof this._camera === 'undefined')
      this._camera = this.addGameObject(value);
    else
      this._camera = this.replaceGameObject(this._camera, value);
  }

  // Get and set the world
  get world()
  {
    return this._world;
  }
  set world(value)
  {
    if (typeof this._world === 'undefined')
      this._world = this.camera.addGameObject(value);
    else
      this._world = this.camera.replaceGameObject(this._world, value);
  }

  // Game loop
  _loop()
  {
    // Calculate the delta timestamp
    let deltaTime = Date.now() - this._lastRender;

    // Update all game objects
    this._each(function(gameObject) {
      // Check if this game object can update
      if (gameObject.can('update'))
        gameObject.update(deltaTime);
    }.bind(this));

    // Draw the background
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw all game objects
    this._eachContext(this.ctx, function(gameObject) {
      // Check if this game object can draw
      if (gameObject.can('draw'))
        gameObject.draw(this.ctx);
    }.bind(this));

    // Update timestamp and request new frame
    this._lastRender = Date.now();
    window.requestAnimationFrame(this._loop.bind(this));
  }

  // Convert to string
  toString()
  {
    return `${super.toString()}: width = ${this.width}, height = ${this.height}`;
  }
}
