import RegionInt from '../geometry/RegionInt.js';
import Vector from '../geometry/Vector.js';


// Class that defines a sprite
export default class Sprite
{
  // Constructor
  constructor(image, imageRegion = undefined)
  {
    this.image = image;
    this.imageRegion = imageRegion;
  }

  // Draw the sprite
  draw(ctx, region)
  {
    ctx.imageSmoothingEnabled = !(this.imageRegion.width === region.width && this.imageRegion.height === region.height);
    ctx.drawImage(this.image, this.imageRegion.left, this.imageRegion.top, this.imageRegion.width, this.imageRegion.height, region.left, region.top, region.width, region.height);
  }

  // Create a sprite from a definition string/array
  static async create(array)
  {
    let imageSource, imageRegion;

    // Parse the definition string/array
    if (typeof array === 'string')
      imageSource = array
    else if (typeof array === 'object' && Array.isArray(array))
      [imageSource, ...imageRegion] = array;
    else
      throw new Error(`Invalid sprite definition format: "${array}"`);

    // Create the image
    imageSource = `${imageSource}?${Sprite.timestamp}`;
    let image = Sprite.images.get(imageSource);
    if (typeof image === 'undefined')
    {
      image = await Sprite.createImage(imageSource);
      Sprite.images.set(imageSource, image);
    }

    // Create the default image region
    if (typeof imageRegion === 'undefined')
      imageRegion = new RegionInt(0, 0, image.naturalWidth, image.naturalHeight)
    else if (typeof imageRegion === 'object' && Array.isArray(imageRegion))
      imageRegion = new RegionInt(...imageRegion);

    // Create the sprite
    return new Sprite(image, imageRegion);
  }

  // Create a synchronously loaded image
  static async createImage(src)
  {
    return new Promise(function(resolve, reject) {
      let image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.src = src;
    });
  }
}


// Create a map for storing images
Sprite.images = new Map();

// Create a timestamp for non-caching images
Sprite.timestamp = Date.now();
