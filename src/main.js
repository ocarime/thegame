import AssetLoader from './engine/util/AssetLoader.js';
import AudioSource from './engine/audio/AudioSource.js';
import Camera from './engine/Camera.js';
import Door from './game/entity/Door.js';
import Game from './engine/Game.js';
import NonPlayerCharacter from './engine/world/character/NonPlayerCharacter.js';
import Piano from './game/entity/Piano.js';
import Painting from './game/entity/Painting.js';
import PlayerCharacter from './engine/world/character/PlayerCharacter.js';
import Tileset from './engine/world/Tileset.js';
import Vector from './engine/util/Vector.js';
import World from './engine/world/World.js';
import WorldContext from './engine/world/WorldContext.js';


// Create the game
let game = new Game('#canvas', '#loadingScreen');

// Preload the game assets
game.preload = async function() {
  // Create an asset loader
  let assets = new AssetLoader('#loadingScreen');

  // Register audio files
  assets.register('music_amber', 'assets/audio/music-amber.ogg', this.audioContext.createClip, this.audioContext);
  assets.register('music_bastiaan', 'assets/audio/music-bastiaan.ogg', this.audioContext.createClip, this.audioContext);
  assets.register('music_common', 'assets/audio/music-common.ogg', this.audioContext.createClip, this.audioContext);
  assets.register('music_danae', 'assets/audio/music-danae.ogg', this.audioContext.createClip, this.audioContext);
  assets.register('music_greg', 'assets/audio/music-greg.ogg', this.audioContext.createClip, this.audioContext);
  assets.register('music_stijn', 'assets/audio/music-stijn.ogg', this.audioContext.createClip, this.audioContext);
  assets.register('music_thomas', 'assets/audio/music-thomas.ogg', this.audioContext.createClip, this.audioContext);

  // Register world and tileset files
  assets.register('ocarime_tileset', 'assets/tilesets/ocarime_tileset.yml', async response => Tileset.load(await response.text()));
  assets.register('ocarime_world', 'assets/worlds/ocarime_world.yml', response => response.text());

  // Load the assets
  await assets.load();

  // Add a camera to the game
  this.camera = new Camera(this).appendTo(this);

  // Add a world to the game
  this.world = new WorldContext(this)
    .registerTileset('ocarime_tileset', assets.ocarime_tileset)
    .registerEntityType('NonPlayerCharacter', {constructor: NonPlayerCharacter})
    .registerEntityType('Door', {constructor: Door})
    .registerEntityType('Painting', {constructor: Painting})
    .create(assets.ocarime_world)
    .appendTo(this.camera);

  if (typeof this.world.playerSpawn !== 'undefined')
    this.player = new PlayerCharacter(this.world, 'Player', this.world.playerSpawn).appendTo(this.world);
};

// Game update
game.update = function() {
  this.camera.position = this.world.tileset.transformVector(this.player.position);
};
