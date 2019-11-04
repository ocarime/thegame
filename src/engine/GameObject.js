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

  // Add a game object and return this
  appendObject(gameObject)
  {
    this.gameObjects.push(gameObject);
    return this;
  }

  // Add this game object to another game object and return this
  appendTo(gameObject)
  {
    gameObject.appendObject(this);
    return this;
  }

  // Add a game object before every other object and return this
  prependObject(gameObject)
  {
    this.gameObject.unshift(gameObject);
    return this;
  }

  // Prepend this game object to another game object and return this
  prependTo(gameObject)
  {
    gameObject.prependObject(this);
    return this;
  }

  // Search for all objects of a type in the direct children
  *getObjects(type = undefined)
  {
    if (typeof type === 'undefined')
      yield* this.gameObjects;
    else
      yield* this.gameObjects.filter(gameObject => gameObject instanceof type);
  }

  // Search for all objects (of a type) in all children using depth-first search
  *getObjectsInChildren(type = undefined)
  {
    // Iterate over the game objects
    for (let gameObject of this.gameObjects)
    {
      // Yield the game object if the type matches
      if (typeof type === 'undefined' || gameObject instanceof type)
        yield gameObject;

      // Yield from the children
      yield* gameObject.getObjectsInChildren(type);
    }
  }

  // Search for an object of a type in the direct children
  getObject(type)
  {
    return this.gameObjects.find(gameObject => gameObject instanceof type);
  }

  // Search for an object of a type in all children using depth-first search
  getObjectInChildren(type)
  {
    return this.getObjectsInChildren(type).next();
  }

  // Remove an object in the direct children
  removeObject(object)
  {
    if (this.gameObjects.indexOf(object) > -1)
      this.gameObjects.splice(this.gameObjects.indexOf(object), 1);
  }

  // Remove an object in all children using depth-first search
  removeObjectInChildren(object)
  {
    this._each(gameObject => gameObject.removeObject(object));
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
