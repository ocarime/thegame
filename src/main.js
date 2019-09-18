import Game from './engine/Game.js';
import Vector from './engine/util/Vector.js';
import Entity from './engine/world/Entity.js';


// Create the game
let game = new Game('#canvas');
let greg = new Entity(game.world, 'greg', new Vector(10, 10));

console.log(game);
console.log(greg);
