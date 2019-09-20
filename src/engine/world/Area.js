import AudioSource from '../audio/AudioSource.js';
import GameObject from '../GameObject.js';
import RegionInt from '../util/RegionInt.js';


// Class that defines an area in the world
export default class Area extends GameObject
{
  // Constructor
  constructor(world, left, top, right, bottom, audioClip = undefined)
  {
    super();

    // The world reference
    this.world = world;

    // The underlying region that this object represents
    this.region = new RegionInt(left, top, right, bottom);

    // Background audio
    if (typeof audioClip !== 'undefined')
    {
      this.audioSource = this.addGameObject(new AudioSource(this.world.game));
      this.audioSource.clip = audioClip;
      this.audioSource.loop = true;
    }
  }

  // Conveert to string
  toString()
  {
    return `${super.toString()}: ${this.region}`;
  }
}
