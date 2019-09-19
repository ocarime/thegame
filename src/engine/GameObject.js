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

  // Add a game object before every other object and return it
  prependGameObject(gameObject)
  {
    this.gameObject.unshift(gameObject);
    return gameObject;
  }

  // Remove a game object and return it
  removeGameObject(gameObject)
  {
    this.gameObjects.splice(this.gameObjects.indexOf(gameObject), 1);
    return undefined;
  }

  // Replace a game object and return it
  replaceGameObject(gameObject, newGameObject)
  {
    this.gameObjects.splice(this.gameObjects.indexOf(gameObject), 1, newGameObject);
    return newGameObject;
  }

  // Get all direct child game objects
  *getGameObjects(type = undefined)
  {
    // Iterate over the game objects
    for (let gameObject of this.gameObjects)
    {
      // Check the type
      if (type === undefined || gameObject instanceof type)
      {
        // Yield the game object
        yield gameObject;
      }
    }
  }

  // Get all direct child game objects
  *getGameObjectsRecursive(type = undefined)
  {
    // Iterate over the game objects
    for (let gameObject of this.gameObjects)
    {
      // Check the type
      if (type === undefined || gameObject instanceof type)
      {
        // Yield the game object
        yield gameObject;

        // yield its children
        yield* gameObject.getGameObjectsRecursive(type);
      }
    }
  }

  // Execute a function on the game object and all its children
  _each(fn, parents = [])
  {
    // Execute the function on this game object
    fn(this, parents);

    // Execute the function on its children
    parents.push(this);
    for (let gameObject of this.gameObjects)
      gameObject._each(fn, parents);
    parents.pop();
  }

  // Execute a function with canvas context
  _eachContext(ctx, fn, parents = [])
  {
    // Check if this game object can begin a context
    if (this.can('beginContext'))
      this.beginContext(ctx);

    // Execute the function on this game object
    fn(this, parents);

    // Execute the contextual function on its children
    parents.push(this);
    for (let gameObject of this.gameObjects)
      gameObject._eachContext(ctx, fn);
    parents.pop();

    // Check if this game object can end a context
    if (this.can('endContext'))
      this.endContext(ctx);
  }

  // Convert to string
  toString()
  {
    return `${this.constructor.name}`;
  }
}
