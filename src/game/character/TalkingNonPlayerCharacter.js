import Modal from '../../ui/Modal.js';
import NonPlayerCharacter from '../../engine/world/character/NonPlayerCharacter.js';


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
    if (action === 'interact')
    {
      let div = $('<div>');

      let mediaDiv = $('<div>')
        .addClass('media')
        .appendTo(div);

      let imageDiv = $('<img>')
        .addClass('mr-3')
        .attr('src', this.image)
        .appendTo(mediaDiv);

      let mediaBodyDiv = $('<div>')
        .addClass('media-body')
        .appendTo(mediaDiv);

      for (let line of this.lines)
      {
        $('<p>')
          .html(line)
          .appendTo(mediaBodyDiv);
      }

      // Create a modal and show it
      let modal = new Modal({
        title: this.name,
        body: div.html()
      }).show();

      return true;
    }

    // No valid action
    return false;
  }
}
