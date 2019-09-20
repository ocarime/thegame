import Camera from './Camera.js';
import GameAudioContext from './audio/GameAudioContext.js';
import GameObject from './GameObject.js';
import PointerEvent from './event/PointerEvent.js';
import Vector from './util/Vector.js';
import World from './world/World.js';


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

    // Initialize the audio context
    this.audioContext = new GameAudioContext();

    // Timing variables
    this._lastRender = Date.now();

    // Add event handler for window loaded
    window.addEventListener('load', function() {
      // Set the canvas dimensions
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;

      // Execute the preload function
      Promise.all(this.can('preload') ? [this.preload()] : []).then(function() {
        // Start the game loop
        window.requestAnimationFrame(this._loop.bind(this));
      }.bind(this));
    }.bind(this));

    // Add event handler for window resized
    window.addEventListener('resize', function() {
      // Set the canvas dimensions
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }.bind(this));

    // Add event handlers for pointer hovered
    this.canvas.addEventListener('pointermove', function(e) {
      // Create the pointer event
      let event = new PointerEvent('hover', new Vector(e.x, e.y));

      // Handle the pointer hovered event
      this._each(function(gameObject) {
        // Check if this game object can handle pointer hovered events
        if (gameObject.can('onPointerHovered'))
          gameObject.onPointerHovered(event);
      }.bind(this));
    }.bind(this));

    // Add event handlers for pointer pressed
    this.canvas.addEventListener('pointerdown', function(e) {
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
    this.canvas.addEventListener('pointerup', function(e) {
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

  // Load a tileset
  loadTileset(url, ...args)
  {
    return new TilesetLoader().loadUrl(url, ...args);
  }

  // Load a world
  loadWorld(url, ...args)
  {
    return new WorldLoader().loadUrl(url, ...args);
  }

  // Convert to string
  toString()
  {
    return `${super.toString()}: width = ${this.width}, height = ${this.height}`;
  }
}
