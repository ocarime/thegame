import Entity from '../../engine/world/Entity.js';
import Modal from '../../ui/Modal.js';
import Vector from '../../engine/geometry/Vector.js';


// Class that defines a piano entity
export default class Painting extends Entity
{
  // Return if a character can currently interact with this entity
  canInteract(character, action = 'interact')
  {
    // The character can interact with the painting when standing next to it
    return Vector.manhattanDistance(this.position, character.position) <= 1;
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

      let mediaBodyDiv = $('<div>')
        .addClass('media-body')
        .appendTo(mediaDiv);

      $('<p>')
        .html(this.description)
        .appendTo(mediaBodyDiv);

      if (typeof this.image !== 'undefined')
      {
        $('<img>')
          .addClass('w-25 mr-3')
          .attr('src', this.image)
          .prependTo(mediaDiv);
      }

      if (typeof this.url !== 'undefined')
      {
        $('<a>')
          .addClass('btn btn-dark')
          .attr('href', this.url)
          .attr('target', '_blank')
          .html(this.urlDescription || 'Visit website')
          .appendTo(mediaBodyDiv);
      }

      // Create a modal and show it
      let modal = new Modal({
        title: this.title,
        body: div.html()
      }).show();

      return true;
    }

    // No valid action
    return false;
  }
}
