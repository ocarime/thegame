import Action from './Action.js';
import Animation from '../../../util/Animation.js';


// Class that defines a character movement action
export default class MoveAction extends Action
{
  // Constructor
  constructor(character, vectors)
  {
    super(character);

    // The vectors to move to
    this.vectors = vectors;
  }

  // Execute the action
  execute()
  {
    // Create the animation
    let keyframes = Array.from(this.vectors.entries()).map(entry => [(entry[0] + 1) * (1000 / this.character.velocity), entry[1]]);
    this.animation = new Animation(this.character.position, ...keyframes).appendTo(this);

    return 'running';
  }

  // Update the action logic
  update(deltaTime)
  {
    if (this.status === 'running')
    {
      if (this.animation.finished)
        this.status = 'finished';
    }
  }
}
