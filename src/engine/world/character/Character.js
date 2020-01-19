import Action from './action/Action.js';
import Entity from '../Entity.js';
import InteractAction from './action/InteractAction.js';
import MoveAction from './action/MoveAction.js';
import Region from '../../geometry/Region.js';
import Vector from '../../geometry/Vector.js';


// Class that represents an in-game character
export default class Character extends Entity
{
  // Constructor
  constructor(world, name, position, options)
  {
    super(world, name, position, options);

    // Definition variables
    this.color = options.color || 'green';
    this.sprite = options.sprite || undefined;
    this.velocity = options.velocity || 10;
  }

  // Get all character actions
  get actions()
  {
    return Array.from(this.getObjects(Action));
  }

  // Move the character to a position
  moveTo(position)
  {
    // Get a path to the position
    let path = this.world.path(this.position, position);
    if (typeof path === 'undefined')
      return false;

    // Slice the path in character actions
    let actions = [];
    let vectors = [];
    for (let info of path)
    {
      // Check the passability of the position
      if (info.passable === true)
      {
        // Add the position to the vectors
        vectors.push(info.position);
      }
      else
      {
        // Create a new move action
        actions.push(new MoveAction(this, vectors));
        vectors = [info.position];

        // Check if we need to interact with the entity
        if (info.passable === false)
        {
          // Invalid path, so break
          break;
        }
        else
        {
          // Create a new interact action
          actions.push(new InteractAction(this, info.entity, info.passable));
        }
      }
    }

    // Finish the last move action if there are vectors left
    if (vectors.length > 0)
      actions.push(new MoveAction(this, vectors));

    // Append the actions
    for (let action of actions)
      action.appendTo(this);
    return true;
  }

  // Draw the character
  draw(ctx)
  {
    // Check if a tile for this entity is defined
    if (typeof this.tileDefinition === 'undefined')
    {
      // Draw rectangle
      let region = this.world.transformRegion(Region.fromVector(this.position, 1, 1));

      ctx.fillStyle = this.color;
      ctx.fillRect(region.left + 4, region.top + 4, region.width - 8, region.height - 8);
    }
    else
    {
      // Draw using the entity function
      super.draw(ctx);
    }
  }

  // Update the character
  update(deltaTime)
  {
    // Get the first action in the action list
    let action = this.actions[0];
    if (typeof action !== 'undefined')
    {
      // If the action is waiting
      if (action.status === 'waiting')
      {
        // Execute the action
        action.status = action.execute();
      }

      // If the action is finished or interrupted
      if (action.status === 'finished' || action.status === 'interrupted')
      {
        // Remove the action
        this.removeObject(action);
        this.update(0);
      }
    }
  }
}
