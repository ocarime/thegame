import AssetLoader from './engine/util/AssetLoader.js';
import Camera from './engine/Camera.js';
import Door from './game/entity/Door.js';
import Entity from './engine/world/Entity.js';
import Game from './engine/Game.js';
import MusicSystem from './game/audio/MusicSystem.js';
import NonPlayerCharacter from './engine/world/character/NonPlayerCharacter.js';
import Painting from './game/entity/Painting.js';
import PlayerCharacter from './engine/world/character/PlayerCharacter.js';
import Speaker from './game/entity/Speaker.js';
import Sprite from './engine/util/Sprite.js';
import TileSet from './engine/world/tileset/TileSet.js';
import UIMuteToggle from './engine/gui/UIMuteToggle.js';
import Vector from './engine/geometry/Vector.js';
import World from './engine/world/World.js';
import WorldContext from './engine/world/WorldContext.js';


// Create the game
let game = new Game('#canvas', '#loadingScreen');

// Preload the game assets
game.preload = async function() {
  // Create an asset loader
  let assets = new AssetLoader('#loadingScreen');

  // Register audio files
  assets.register('music_amber', 'assets/audio/music-amber.ogg', async response => this.audioContext.createClip(await response.arrayBuffer()));
  assets.register('music_bastiaan', 'assets/audio/music-bastiaan.ogg', async response => this.audioContext.createClip(await response.arrayBuffer()));
  assets.register('music_common', 'assets/audio/music-common.ogg', async response => this.audioContext.createClip(await response.arrayBuffer()));
  assets.register('music_danae', 'assets/audio/music-danae.ogg', async response => this.audioContext.createClip(await response.arrayBuffer()));
  assets.register('music_greg', 'assets/audio/music-greg.ogg', async response => this.audioContext.createClip(await response.arrayBuffer()));
  assets.register('music_stijn', 'assets/audio/music-stijn.ogg', async response => this.audioContext.createClip(await response.arrayBuffer()));
  assets.register('music_thomas', 'assets/audio/music-thomas.ogg', async response => this.audioContext.createClip(await response.arrayBuffer()));

  // Register world and tileset files
  assets.register('ocarime_tileset', 'assets/tilesets/ocarime_tileset.yml', async response => TileSet.load(await response.text()));
  assets.register('ocarime_world', 'assets/worlds/ocarime_world.yml', response => response.text());

  // Load the assets
  await assets.load();

  // Add a music system to the game
  this.musicSystem = new MusicSystem(this.audioContext).appendTo(this);

  // Add a camera to the game
  this.camera = new Camera(this).appendTo(this);

  // Add a world to the game
  this.world = new WorldContext(this)
    .registerAssets(assets)
    .registerTileset('ocarime_tileset', assets.ocarime_tileset)
    .registerEntityType('NonPlayerCharacter', {constructor: NonPlayerCharacter, tileDefinition: 'npc'})
    .registerEntityType('Door', {constructor: Door, properties: {state: 'closed', orientation: 'horizontal'}, tileDefinition: 'door'})
    .registerEntityType('Window', {constructor: Entity, tileDefinition: 'window'})
    .registerEntityType('Furniture', {constructor: Entity, properties: {type: undefined}, tileDefinition: 'furniture'})
    .registerEntityType('Painting', {constructor: Painting, properties: {url: undefined}, tileDefinition: 'painting'})
    .registerEntityType('Speaker', {constructor: Speaker, properties: {orientation: 'right'}, tileDefinition: 'speaker'})
    .create(assets.ocarime_world)
    .appendTo(this.camera);

  if (typeof this.world.playerSpawn !== 'undefined')
  {
    this.player = new PlayerCharacter(this.world, 'Player', this.world.playerSpawn, {velocity: 10}).appendTo(this.world);
    this.audioListener = this.audioContext.createListener(this.world, 'AudioListener', this.player.position).appendTo(this.player);
  }

  // Add a mute toggle to the game
  this.muteToggle = new UIMuteToggle(new Vector(16, 16), new Vector(32, 32), {state: true, hotkey: 'm', offSprite: await Sprite.create('assets/images/volume-mute-solid.png'), onSprite: await Sprite.create('assets/images/volume-down-solid.png')}, this.audioContext).appendTo(this);
};

// Game update
game.update = function() {
  this.camera.position = this.world.transformVector(this.player.position);
};
