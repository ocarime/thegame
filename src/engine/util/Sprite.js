import RegionInt from './RegionInt.js';


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
    ctx.drawImage(this.image, this.imageRegion.left, this.imageRegion.top, this.imageRegion.width - 1, this.imageRegion.height - 1, region.left, region.top, region.width, region.height);
  }

  // Create a sprite from a definition string/array
  static async create(array)
  {
    if (typeof array === 'string')
    {
      let imageSource = array;

      // Create the image
      let image = Sprite.images.get(imageSource);
      if (typeof image === 'undefined')
      {
        image = await Sprite.createImage(imageSource);
        Sprite.images.set(imageSource, image);
      }

      // Create the image region
      let imageRegion = new RegionInt(0, 0, image.naturalWidth, image.naturalHeight)

      // Create the sprite
      return new Sprite(image, imageRegion);
    }
    else if (typeof array === 'object' && Array.isArray(array))
    {
      let [imageSource, ...imageRegionArray] = array;

      // Create the image
      let image = Sprite.images.get(imageSource);
      if (typeof image === 'undefined')
      {
        image = await Sprite.createImage(imageSource);
        Sprite.images.set(imageSource, image);
      }

      // Create the image region
      let imageRegion = new RegionInt(...imageRegionArray);

      // Create the sprite
      return new Sprite(image, imageRegion);
    }

    // Invalid definition format
    throw new Error(`Invalid sprite definition format: "${array}"`);
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
