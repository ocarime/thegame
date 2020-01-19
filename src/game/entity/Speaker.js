import AudioSource from '../../engine/audio/AudioSource.js';
import Entity from '../../engine/world/Entity.js';
import Game from '../../engine/Game.js';
import MusicSystem from '../audio/MusicSystem.js';


// Class that defines a speaker entity
export default class Speaker extends Entity
{
  // Constructor
  constructor(world, name, position, properties)
  {
    super(world, name, position, properties);

    // Create a reference to the music system
    this.musicSystem = properties.game.getObjectInChildren(MusicSystem);

    // Create an audio source
    this.audioClip = typeof properties.audioClip !== 'undefined' ? properties.worldContext.assets[properties.audioClip] : undefined;
    this.audioSource = properties.game.audioContext.createSource(world, `${name}_AudioSource`, position, {
      clip: this.audioClip,
      loop: properties.loop,
      minDistance: properties.minDistance,
      maxDistance: properties.maxDistance
    }).appendTo(this);
    this.musicSystem.sources.push(this.audioSource);

    // Debug variables
    this.debugInfo = {color: 'white', level: 1};
  }
}
