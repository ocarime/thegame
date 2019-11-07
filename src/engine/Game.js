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
  constructor(canvas, loadingScreen)
  {
    super();

    // Initialize the canvas
    this.canvas = document.querySelector(canvas);
    this.ctx = this.canvas.getContext('2d');

    // Initialize the loading screen
    this.loadingScreen = document.querySelector(loadingScreen);

    // Initialize the audio context
    this.audioContext = new GameAudioContext();

    // Enable debugger drawing
    this.showDebug = false;

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

    // Add event handlers for key pressed
    document.addEventListener('keydown', function(e) {
      // Toggle the debugger
      if (e.code === 'F9')
        this.showDebug = !this.showDebug;

      // Create the keyboard event
      let event = e;

      // Handle the key pressed event
      this._each(function(gameObject) {
        // Check if this game object can handle key pressed events
        if (gameObject.can('onKeyPressed'))
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
        if (gameObject.can('onKeyReleased'))
          gameObject.onKeyReleased(event);
      }.bind(this));
    }.bind(this));

    // Add event handlers for pointer hovered
    document.addEventListener('pointermove', function(e) {
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
    document.addEventListener('pointerdown', function(e) {
      if (this.audioContext.context.state === 'suspended')
        this.audioContext.context.resume();

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
      if (gameObject.can('draw'))
        gameObject.draw(this.ctx);

      // Check if this game object can draw a debug mode
      if (this.showDebug && gameObject.can('debug'))
        gameObject.debug(this.ctx);
    }.bind(this));

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
    ctx.fillStyle = 'lime';

    this._each(function(gameObject, parents) {
      let tx = 16 + 12 * parents.length;
      let ty = 16 + 14 * line;
      ctx.fillText(`${gameObject}`, tx, ty);
      line ++;
    });
  }

  // Convert to string
  toString()
  {
    return `${super.toString()}: width = ${this.width}, height = ${this.height}`;
  }
}
