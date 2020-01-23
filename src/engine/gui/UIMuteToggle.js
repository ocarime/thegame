import UIObject from './UIObject.js'


// Class that defines a clickable UI toggle that mutes the audio
export default class UIMuteToggle extends UIObject
{
  // Constructor
  constructor(position, size, properties, audioContext)
  {
    super(position, size, properties);

    this.audioContext = audioContext;

    // Variable that holds the toggle state
    this.state = properties.state || false;

    // Draw variables
    this.offSprite = properties.offSprite;
    this.onSprite = properties.onSprite;
  }

  // Draw the UI object
  draw(ctx)
  {
    if (!this.state && typeof this.offSprite !== 'undefined')
      this.offSprite.draw(ctx, this.region);
    else if (this.state && typeof this.onSprite !== 'undefined')
      this.onSprite.draw(ctx, this.region);
    else
      super.draw(ctx);
  }

  // Click event handler
  onClick()
  {
    this.state = !this.state;

    // Toggle the volume of the audio
    if (this.state)
      this.audioContext.listener.gainNode.connect(this.audioContext.webAudioContext.destination);
    else
      this.audioContext.listener.gainNode.disconnect();
  }

  // Convert to string
  toString()
  {
    return `${this.constructor.name} [${this.region.toArray()}]: ${this.state}`;
  }
}
