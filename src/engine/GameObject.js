import Camera from './Camera.js';
import Vector from './geometry/Vector.js';


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
    // Transformation
    this.position = new Vector(0, 0);
    this.scale = new Vector(1, 1);

    // List of child game objects
    this.parent = undefined;
    this.gameObjects = [];
  }

  // Return the hierarchy from the game object root to this object
  get hierarchy()
  {
    let hierarchy = [];
    let parent = this;
    while (typeof parent !== 'undefined')
    {
      hierarchy.push(parent);
      parent = parent.parent;
    }
    return hierarchy;
  }

  // Add this game object to another game object and return this
  appendTo(gameObject)
  {
    this.parent = gameObject;
    this.parent.gameObjects.push(this);
    return this;
  }

  // Prepend this game object to another game object and return this
  prependTo(gameObject)
  {
    this.parent = gameObject;
    this.parent.gameObjects.unshift(this);
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

  // Search for all objects of a type in the hierarchy
  *getObjectsInHierarchy(type = undefined)
  {
    // Iterate over the game objects
    for (let gameObject of this.hierarchy)
    {
      // Yield the game object if the type matches
      if (typeof type === 'undefined' || gameObject instanceof type)
        yield gameObject;
    }
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
    let next = this.getObjects(type).next();
    return next.done ? undefined : next.value;
  }

  // Search for an object of a type in the hierarchy
  getObjectInHierarchy(type)
  {
    let next = this.getObjectsInHierarchy(type).next();
    return next.done ? undefined : next.value;
  }

  // Search for an object of a type in all children using depth-first search
  getObjectInChildren(type)
  {
    let next = this.getObjectsInChildren(type).next();
    return next.done ? undefined : next.value;
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

  // Transform a vector from local space to world space
  transformVector(vector)
  {
    // Apply transformations of this game object
    vector = vector
      .translate(this.position.scaleUniform(-1))
      .scale(this.scale);

    // Apply transformations of the parents
    if (typeof this.parent !== 'undefined' || parent instanceof Camera)
      vector = this.parent.transformVector(vector);

    return vector;
  }

  // Transform a region from local space to world space
  transformRegion(region)
  {
    // Apply transformations of this game object
    region = region
      .translate(this.position.scaleUniform(-1))
      .scale(this.scale);

    // Apply transformations of the parents
    if (typeof this.parent !== 'undefined')
      region = this.parent.transformRegion(region);

    return region;
  }

  // Transform a vector from world space to local space
  inverseTransformVector(vector)
  {
    // Apply inverse transformations of the parents
    if (typeof this.parent !== 'undefined')
      vector = this.parent.inverseTransformVector(vector);

    // Apply inverse transformations of this game object
    return vector
      .scale(this.scale.reciprocal())
      .translate(this.position);
  }

  // Transform a region from world space to local space
  inverseTransformRegion(region)
  {
    // Apply inverse transformations of the parents
    if (typeof this.parent !== 'undefined' || parent instanceof Camera)
      region = this.parent.inverseTransformRegion(region);

    // Apply inverse transformations of this game object
    return region
      .scale(this.scale.reciprocal())
      .translate(this.position);
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

  // Convert to string
  toString()
  {
    return `${this.constructor.name} [${this.position.toArray()}] [${this.scale.toArray()}]`;
  }
}
