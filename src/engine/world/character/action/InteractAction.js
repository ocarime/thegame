import Action from './Action.js';


// Class that defines a character interaction action
export default class InteractAction extends Action
{
  // Constructor
  constructor(character, entity, action = 'interact')
  {
    super(character);

    // The entity to interact with
    this.entity = entity;

    // The action to perform with the entity
    this.action = action;
  }

  // Execute the action
  execute()
  {
    // Check if the entity can be interacted with
    if (typeof this.entity.canInteract === 'undefined' || !this.entity.canInteract(this.character))
      return false;

    // Interact with the entity
    if (this.entity.onInteract(this.character, this.action))
      return 'finished';
    else
      return 'interrupted';
  }
}
