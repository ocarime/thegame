import Debugger from './engine/Debugger.js';
import Game from './engine/Game.js';
import Vector from './engine/util/Vector.js';
import Character from './game/Character.js';


// Create the game
let game = new Game('#canvas');
let debug = game.addGameObject(new Debugger(game));

// Add characters
let greg = game.world.addGameObject(new Character(game.world, 'greg', new Vector(10, 10)));
let bastiaan = game.world.addGameObject(new Character(game.world, 'bastiaan', new Vector(-10, 20)));
