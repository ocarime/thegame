// Class that handles asynchronous loading of assets
export default class AssetLoader
{
  // Constructor
  constructor(element)
  {
    // Loading screen elements
    this._element = document.querySelector(element);

    this._loadingText = document.createElement('p');
    this._loadingText.textContent = 'Loading assets';
    this._element.appendChild(this._loadingText);

    this._loadingBar = document.createElement('div');
    this._loadingBar.className = 'loadingBar';
    this._element.appendChild(this._loadingBar);

    this._loadingBarInner = document.createElement('div');
    this._loadingBarInner.className = 'loadingBarInner';
    this._loadingBar.appendChild(this._loadingBarInner);

    // Map of assets
    this._assets = new Map();
  }

  // Register an asset
  register(name, url, callback = undefined, thisArg = undefined)
  {
    this._assets.set(name, {url: url, callback: callback, thisArg: thisArg});
  }

  // Load the items
  async load()
  {
    let loadingPromises = [];
    let loadingAssets = [];

    // Iterate over the assets
    for (let [name, asset] of this._assets.entries())
    {
      // Increase the loading assets
      loadingAssets.push(name);

      // Fetch the asset
      loadingPromises.push(fetch(asset.url).then(async function(response) {
        // Check the response
        if (response.ok)
        {
          // Set the loaded response
          if (typeof asset.callback !== 'undefined')
          {
            // Apply the callback
            let result = this[name] = asset.callback.bind(asset.thisArg)(response);
            if (result instanceof Promise)
              result = await result;
            this[name] = result;
          }
          else
          {
            // Just save the response
            this[name] = response;
          }
        }
        else
        {
          console.error(`Failed loading ${asset.url}: ${response.statusText}`);
        }

        // Decrease the loading assets
        loadingAssets.splice(loadingAssets.indexOf(name), 1);

        // Update the progress
        let progress = (this._assets.size - loadingAssets.length) / this._assets.size;
        this._loadingText.textContent = `Loading assets: ${Math.round(progress * 100.0)}%`;
        this._loadingBarInner.style.width = `${progress * 100.0}%`;

        if (progress >= 1.0)
          this._element.style.display = 'none';
      }.bind(this)));
    }

    // Execute all promises
    await Promise.all(loadingPromises);
  }
}
