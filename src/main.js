import AudioSource from './engine/audio/AudioSource.js';
import Camera from './engine/Camera.js';
import Debugger from './engine/Debugger.js';
import Door from './game/entity/Door.js';
import Game from './engine/Game.js';
import Piano from './game/entity/Piano.js';
import PlayerCharacter from './engine/world/character/PlayerCharacter.js';
import Tileset from './engine/tileset/Tileset.js';
import TilesetLoader from './engine/tileset/TilesetLoader.js';
import Vector from './engine/util/Vector.js';
import World from './engine/world/World.js';
import WorldLoader from './engine/world/WorldLoader.js';


// Create the game
let game = new Game('#canvas');

// Preload the game assets
game.preload = async function() {
  // Add a camera to the game
  this.camera = new Camera(this);
  this.addGameObject(this.camera);

  // Add a world to the game
  let tilesetLoader = new TilesetLoader(this);
  this.tileset = await tilesetLoader.loadUrl('assets/tilesets/indoor-test.tileset');

  let worldLoader = new WorldLoader(this, {
    entities: {
      door: Door,
      piano: Piano
    },
    audioClips: {
      amber: await this.audioContext.createClipFromUrl('assets/audio/music-amber.ogg'),
      bastiaan: await this.audioContext.createClipFromUrl('assets/audio/music-bastiaan.ogg'),
      common: await this.audioContext.createClipFromUrl('assets/audio/music-common.ogg'),
      danae: await this.audioContext.createClipFromUrl('assets/audio/music-danae.ogg'),
      greg: await this.audioContext.createClipFromUrl('assets/audio/music-greg.ogg'),
      thomas: await this.audioContext.createClipFromUrl('assets/audio/music-thomas.ogg')
    }
  });
  this.world = await worldLoader.loadUrl('assets/worlds/indoor-test.world', this.tileset);
  this.camera.addGameObject(this.world);

  if (typeof this.world.playerSpawn !== 'undefined')
    this.player = this.world.addGameObject(new PlayerCharacter(this.world, 'Player', this.world.playerSpawn));

  // Add a debugger to the game
  //this.debugger = new Debugger(this);
  //this.addGameObject(this.debugger);
};

// Game update
game.update = function() {
  this.camera.position = this.tileset.transformVector(this.player.position);
};
