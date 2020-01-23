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
  }

  // Click event handler
  onClick()
  {
    this.state = !this.state;

    // Toggle the volume of the audio
    this.audioContext.listener.gain.value = this.state ? 1.0 : 0.0;
  }

  // Convert to string
  toString()
  {
    return `${this.constructor.name} [${this.region.toArray()}]: ${this.state}`;
  }
}
