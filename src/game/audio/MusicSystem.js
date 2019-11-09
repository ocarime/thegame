import Game from '../../engine/Game.js';
import GameObject from '../../engine/GameObject.js';


// Class that defines the non-linear music system
export default class MusicSystem extends GameObject
{
  // Constructor
  constructor()
  {
    super();

    // State of the system
    this.state = 'suspended';

    // Reference to the audio sources
    this.sources = [];
  }

  // Update the music system logic
  update(deltaTime)
  {

  }

  // Event handler when the pointer is pressed
  onPointerPressed(e)
  {
    // Check if the music system is started
    if (this.state === 'suspended')
    {
      this.getObjectInHierarchy(Game).audioContext.listener.gain.value = 0.0;
      this.getObjectInHierarchy(Game).audioContext.listener.gain.linearRampToValueAtTime(1.0, 3.0);

      for (let source of this.sources)
        source.play();

      this.state = 'playing';
    }
  }
}
