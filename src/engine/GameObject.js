// Base class for all game objects
export default class GameObject
{
  // Overridable methods:
  //   draw(ctx)          Draws this game object using the canvas context
  //   update(deltaTime)  Updates the logic of this game object
  //   beginContext(ctx)  Is called before drawing itself and all children
  //   endContext(ctx)    Is called after drawing itself and all children

  // Constructor
  constructor()
  {
    this.gameObjects = [];
  }

  // Add a game object and return it
  addGameObject(gameObject)
  {
    this.gameObjects.push(gameObject);
    return gameObject;
  }

  // Remove a game object and return it
  removeGameObject(gameObject)
  {
    return this.gameObjects.splice(this.gameObjects.indexOf(gameObject), 1);
  }

  // Execute a function on the game object and all its children
  _each(fn)
  {
    // Execute the function on this game object
    fn(this);

    // Execute the function on its children
    for (let gameObject of this.gameObjects)
      gameObject._each(fn);
  }

  // Execute a function with canvas context
  _eachContext(ctx, fn)
  {
    // Check if this game object can begin a context
    if (this.can('beginContext'))
      this.beginContext(ctx);

      // Execute the function on this game object
      fn(this);

      // Execute the contextual function on its children
      for (let gameObject of this.gameObjects)
        gameObject._eachContext(ctx, fn);

    // Check if this game object can end a context
    if (this.can('endContext'))
      this.endContext(ctx);
  }
}
