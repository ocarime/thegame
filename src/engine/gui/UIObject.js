import GameObject from '../GameObject.js';
import Region from '../geometry/Region.js';


// Base class for UI components
export default class UIObject extends GameObject
{
  // Constructor
  constructor(position, size, properties = {})
  {
    super();

    this.position = position;
    this.size = size;
    this.region = Region.fromVector(position, size.x, size.y);

    // Hotkey variable
    this.hotkey = typeof properties.hotkey !== 'undefined' ? properties.hotkey : null;

    // Variable that defines if the object is currently clicked on
    this.clicked = false;

    // Debug variables
    this.debugInfo = {color: 'fuchsia'};
  }

  // Draw the UI object
  draw(ctx)
  {
    ctx.fillStyle = this.clicked ? 'purple' : 'fuchsia';
    ctx.fillRect(this.region.left, this.region.top, this.region.width, this.region.height);
  }

  // Pointer pressed event handler
  onPointerPressed(e)
  {
    let worldPosition = this.parent.transformVector(e.position);

    // Check if the pointer is on this object
    if (this.region.contains(worldPosition))
    {
      this.clicked = true;

      // Click the object
       if (typeof this.onClick === 'function')
        this.onClick();
    }
  }

  // Pointer released event handler
  onPointerReleased(e)
  {
    this.clicked = false;
  }

  // Key pressed event handler
  onKeyPressed(e)
  {
    // Check if the key was the hotkey of this object
    if (typeof this.hotkey !== undefined && e.key === this.hotkey)
    {
      this.clicked = true;

      // Click the object
       if (typeof this.onClick === 'function')
        this.onClick();
    }
  }

  // Key released event handler
  onKeyReleased(e)
  {
    // Check if the key was the hotkey of this object
    if (typeof this.hotkey !== undefined && e.key === this.hotkey)
      this.clicked = false;
  }

  // Convert to string
  toString()
  {
    return `${this.constructor.name} [${this.region.toArray()}]`;
  }
}
