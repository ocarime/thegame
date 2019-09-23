import AssetLoader from './engine/util/AssetLoader.js';
import AudioSource from './engine/audio/AudioSource.js';
import Camera from './engine/Camera.js';
import Debugger from './engine/Debugger.js';
import Door from './game/entity/Door.js';
import Game from './engine/Game.js';
import NonPlayerCharacter from './engine/world/character/NonPlayerCharacter.js';
import Piano from './game/entity/Piano.js';
import PlayerCharacter from './engine/world/character/PlayerCharacter.js';
import Tileset from './engine/tileset/Tileset.js';
import TilesetLoader from './engine/tileset/TilesetLoader.js';
import Vector from './engine/util/Vector.js';
import World from './engine/world/World.js';
import WorldLoader from './engine/world/WorldLoader.js';


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
  assets.register('music_thomas', 'assets/audio/music-thomas.ogg', this.audioContext.createClip, this.audioContext);

  // Register world and tileset files
  assets.register('tileset_indoor_test', 'assets/tilesets/indoor-test.tileset', response => response.text());
  assets.register('world_indoor_test', 'assets/worlds/indoor-test.world', response => response.text());

  // Load the assets
  await assets.load();

  // Add a camera to the game
  this.camera = new Camera(this);
  this.addGameObject(this.camera);

  // Add a world to the game
  let tilesetLoader = new TilesetLoader(this);
  this.tileset = await tilesetLoader.load(assets.tileset_indoor_test);

  let worldLoader = new WorldLoader(this, {
    entities: {
      door: Door,
      piano: Piano,
      npc: NonPlayerCharacter
    },
    assets: assets
  });
  this.world = await worldLoader.load(assets.world_indoor_test, this.tileset);
  this.camera.addGameObject(this.world);

  if (typeof this.world.playerSpawn !== 'undefined')
    this.player = this.world.addGameObject(new PlayerCharacter(this.world, 'Player', this.world.playerSpawn));

  // Add a debugger to the game
  this.debugger = new Debugger(this);
  this.addGameObject(this.debugger);
};

// Game update
game.update = function() {
  this.camera.position = this.tileset.transformVector(this.player.position);
};
