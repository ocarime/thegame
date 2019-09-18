// Class that represents a tile on the map
export default class MapTile
{
  // Constructor
  constructor(map, x, y, passable, texture)
  {
    this.x = x;
    this.y = y;
    this.passable = passable;
    this.texture = texture;
  }
}
