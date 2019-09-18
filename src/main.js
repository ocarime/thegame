import Game from './engine/Game.js';
import Vector from './engine/util/Vector.js';
import Character from './game/Character.js';


// Create the game
let game = new Game('#canvas');
let greg = new Character(game.world, 'greg', new Vector(10, 10));
let bastiaan = new Character(game.world, 'bastiaan', new Vector(-10, 20));
