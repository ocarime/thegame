import GameObject from '../../../GameObject.js';


// Class that defines an action that a character can do
export default class Action extends GameObject
{
  // Constructor
  constructor(character)
  {
    super();

    // The character that executes the action
    this.character = character;

    // The status of the action
    this.status = 'waiting';

    // Debug variables
    this.debugInfo = {level: 2};
  }

  // Execute the action
  execute()
  {
    // Overridden by subclasses
    return 'finished';
  }

  // Convert to string
  toString()
  {
    return `${super.toString()}: ${this.status}`;
  }
}
