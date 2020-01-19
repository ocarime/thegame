import Modal from '../../ui/Modal.js';
import NonPlayerCharacter from '../../engine/world/character/NonPlayerCharacter.js';
import Sprite from '../../engine/util/Sprite.js';


// Class that defines a talking NPC
export default class TalkingNonPlayerCharacter extends NonPlayerCharacter
{
  // Constructor
  constructor(world, name, position, properties)
  {
    super(world, name, position, properties);
  }

  // Interaction event handler
  onInteract(character, action = 'interact')
  {
    // Create the avatar image
    Sprite.create(this.avatar).then(function(avatar) {
      // Create the image
      let avatarImage = $(avatar.image)
        .addClass('mr-3');

      // Create a modal and show it
      let modal = new Modal({
        title: this.name,
        body: `
          <div class="media">
            ${avatar.image.outerHTML}
            <div class="media-body">
              ${this.lines}
            </div>
          </div>
        `
      }).show();
    }.bind(this));

    return true;
  }
}
