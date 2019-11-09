import AudioSource from '../../engine/audio/AudioSource.js';
import Entity from '../../engine/world/Entity.js';
import Game from '../../engine/Game.js';


// Class that defines a speaker entity
export default class Speaker extends Entity
{
  // Constructor
  constructor(world, name, position, options)
  {
    super(world, name, position, options);

    // Create an audio source
    this.audioClip = typeof options.audioClip !== 'undefined' ? options.context.assets[options.audioClip] : undefined;
    this.audioSource = options.game.audioContext.createSource(world, `${name}_AudioSource`, position, {
      clip: this.audioClip
    }).appendTo(this);
    //this.audioSource.play();

    console.log(this);
  }

  // Draw the door
  draw(ctx)
  {
    this.world.tileset.tiles.get('speaker')._draw(ctx, this.position);
  }
}
