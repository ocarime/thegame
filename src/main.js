import Debugger from './engine/Debugger.js';
import Door from './game/entity/Door.js';
import Game from './engine/Game.js';
import Piano from './game/entity/Piano.js';
import PlayerCharacter from './engine/world/character/PlayerCharacter.js';
import TilesetLoader from './engine/tileset/TilesetLoader.js';
import Vector from './engine/util/Vector.js';
import WorldLoader from './engine/world/WorldLoader.js';


// Create the game
let game = new Game('#canvas');
let debug = game.addGameObject(new Debugger(game));

// Preload the game assets
game.preload = function() {
  // Initialize the world
  let worldLoader = new WorldLoader({
    entities: {door: Door, piano: Piano}
  });

  this.world = worldLoader.loadUrl(game, 'assets/worlds/indoor-test.world');

  if (typeof this.world.playerSpawn !== 'undefined')
    this.player = this.world.addGameObject(new PlayerCharacter(this.world, 'Player', this.world.playerSpawn));

  // Initialize the tileset
  this.world.tileset = TilesetLoader.loadUrl('assets/tilesets/indoor-test.tileset');
};

// Game update
game.update = function() {
  this.camera.position = this.world.tileset.transformVector(this.player.position);
};
