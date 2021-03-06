import Camera from './Camera.js';
import Context from './audio/Context.js';
import GameObject from './GameObject.js';
import PointerEvent from './event/PointerEvent.js';
import Vector from './geometry/Vector.js';
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
  constructor(canvas, loadingScreen)
  {
    super();

    // Initialize the canvas
    this.canvas = document.querySelector(canvas);
    this.ctx = this.canvas.getContext('2d');

    // Initialize the loading screen
    this.loadingScreen = document.querySelector(loadingScreen);

    // Initialize the audio context
    this.audioContext = new Context(this);

    // Enable debugger drawing
    this.showDebug = 0;
    this.showDebugOffsetY = 0;

    // Timing variables
    this._lastRender = Date.now();

    // Add event handler for window loaded
    window.addEventListener('load', function() {
      // Set the canvas dimensions
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;

      // Execute the preload function
      Promise.all(typeof this.preload === 'function' ? [this.preload()] : []).then(function() {
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

    // Add event handler for wndow scrolled
    window.addEventListener('wheel', function(e) {
      // Set the scroll offset
      if (this.showDebug > 0)
        this.showDebugOffsetY = Math.max(0, this.showDebugOffsetY + e.deltaY);
    }.bind(this));

    // Add event handlers for key pressed
    document.addEventListener('keydown', function(e) {
      // Toggle the debugger
      if (e.code === 'F9')
      {
        this.showDebug = (this.showDebug + 1) % 3;
        this.showDebugOffsetY = 0;
      }

      // Create the keyboard event
      let event = e;

      // Handle the key pressed event
      this._each(function(gameObject) {
        // Check if this game object can handle key pressed events
        if (typeof gameObject.onKeyPressed === 'function')
          gameObject.onKeyPressed(e);
      }.bind(this));
    }.bind(this));

    // Add event handlers for key released
    document.addEventListener('keyup', function(e) {
      // Create the keyboard event
      let event = e;

      // Handle the key pressed event
      this._each(function(gameObject) {
        // Check if this game object can handle key pressed events
        if (typeof gameObject.onKeyReleased === 'function')
          gameObject.onKeyReleased(event);
      }.bind(this));
    }.bind(this));

    // Add event handlers for pointer hovered
    this.canvas.addEventListener('pointermove', function(e) {
      // Create the pointer event
      let event = new PointerEvent('hover', new Vector(e.x, e.y));

      // Handle the pointer hovered event
      this._each(function(gameObject) {
        // Check if this game object can handle pointer hovered events
        if (typeof gameObject.onPointerHovered === 'function')
          gameObject.onPointerHovered(event);
      }.bind(this));
    }.bind(this));

    // Add event handlers for pointer pressed
    this.canvas.addEventListener('pointerdown', function(e) {
      if (this.audioContext.webAudioContext.state === 'suspended')
        this.audioContext.webAudioContext.resume();

      // Create the pointer event
      let event = new PointerEvent('press', new Vector(e.x, e.y));

      // Handle the pointer pressed event
      this._each(function(gameObject) {
        // Check if this game object can handle pointer pressed events
        if (typeof gameObject.onPointerPressed === 'function')
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
        if (typeof gameObject.onPointerReleased === 'function')
          gameObject.onPointerReleased(event);
      }.bind(this));
    }.bind(this));

    // Debug variables
    this.debugInfo = {color: 'lime'};
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
      if (typeof gameObject.update === 'function')
        gameObject.update(deltaTime);

      // Check if the game object can be finished
      if (typeof gameObject.finished !== 'undefined' && gameObject.finished)
        this.removeObjectInChildren(gameObject);
    }.bind(this));

    // Draw the background
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw all game objects
    this._eachContext(this.ctx, function(gameObject) {
      // Check if this game object can draw
      if (typeof gameObject.draw === 'function')
        gameObject.draw(this.ctx);
    }.bind(this));

    // Draw all deug information
    if (this.showDebug)
    {
      this._eachContext(this.ctx, function(gameObject) {
        // Check if this game object can draw a debug mode
        if (typeof gameObject.debug === 'function')
          gameObject.debug(this.ctx);
      }.bind(this));
    }

    // Update timestamp and request new frame
    this._lastRender = Date.now();
    window.requestAnimationFrame(this._loop.bind(this));
  }

  // Draw the debug mode
  debug(ctx)
  {
    // Print all game objects
    let line = 0;

    ctx.font = '10px monospace';
    ctx.textAlign = 'left';

    this._each(function(gameObject) {
      ctx.fillStyle = 'white';

      // Use the debug info
      if (typeof gameObject.debugInfo !== 'undefined')
      {
        // Set the debug level
        let level = 1;
        for (let parentObject of gameObject.hierarchy)
          if (typeof parentObject.debugInfo != 'undefined' && typeof parentObject.debugInfo.level !== 'undefined')
            level = Math.max(level, parentObject.debugInfo.level);

        if (level > this.showDebug)
          return;

        // Set the debug color
        if (typeof gameObject.debugInfo.color !== 'undefined')
          ctx.fillStyle = gameObject.debugInfo.color;
      }

      // Draw the game object text
      let tx = 16 + 12 * (gameObject.hierarchy.length - 1);
      let ty = 16 + 14 * line - this.showDebugOffsetY;
      ctx.fillText(`${gameObject}`, tx, ty);
      line ++;
    }.bind(this));
  }

  // Convert to string
  toString()
  {
    return `${super.toString()}: width = ${this.width}, height = ${this.height}`;
  }
}
