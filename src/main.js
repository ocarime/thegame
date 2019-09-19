import Debugger from './engine/Debugger.js';
import Game from './engine/Game.js';
import Vector from './engine/util/Vector.js';
import TilesetLoader from './engine/tileset/TilesetLoader.js';
import WorldLoader from './engine/world/worldLoader.js';

import Character from './game/Character.js';
import Door from './game/world/Door.js';
import Piano from './game/world/Piano.js';


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

  // Initialize the tileset
  this.world.map.tileset = TilesetLoader.loadUrl('assets/tilesets/indoor-test.tileset');
};
