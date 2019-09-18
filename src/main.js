import Vector from './engine/Vector.js';
import Game from './engine/Game.js';
import Entity from './engine/Entity.js';


// Create the game
let game = new Game('#canvas');
let greg = new Entity(game.world, 'greg', new Vector(10, 10));

console.log(game);
console.log(greg);
