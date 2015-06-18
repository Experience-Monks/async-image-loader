# async-image-loader

[![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

A small utility to load images asynchronously, with `progress` events and simple error handling.

## Examples

At its basic form, it can be used to load image URLs.

```js
var load = require('async-image-loader')

var images = [ 'foo.png', 'blah.png' ]
load(images, function (images) {
  // by default, "not found" images will be null
  images
    .filter(Boolean)
    .forEach(function (img) {
      document.body.appendChild(img)
    })
})
```

Here is a more complex example, where each "tile" holds some data in an object. The same object will be passed to `"progress"` events as `ev.data`.

```js
var loadTiles = require('async-image-loader')
var canvas = document.createElement('canvas')
var context = canvas.getContext('2d')

var tiles = [
  { url: 'foobar.png', x: 0, y: 0 }
  { url: 'some-tile.png', x: 50, y: 50 }
]

loadTiles(tiles, {
  crossOrigin: 'Anonymous',
  defaultImage: defaultImage
}).on('progress', function (ev) {
  console.log("Progress: ", ev.count / ev.total)
  
  // stitch the image onto canvas
  context.drawImage(ev.image, ev.data.x, ev.data.y)
})
```

## Install

```sh
npm install async-image-loader --save
```

## Usage

[![NPM](https://nodei.co/npm/async-image-loader.png)](https://www.npmjs.com/package/async-image-loader)

#### `emitter = loader(urls, [opt], [cb])`

Starts loading the specified `urls`. Elements in the `urls` array can either be strings, or objects containing `{ url }`.

The `opt` settings can be:

- `crossOrigin` the CORS setting for image loading (default undefined)
- `defaultImage` the fallback Image to use when a load 404s (default null) 

On complete, `cb` is called with an array of HTMLImageObjects as the first paramter (same order as input). Any images not found will be replaced with `defaultImage`, or null.

#### `emitter.on('progress', fn)`

Each resource will trigger a `progress` event when it completes loading, or when it fails. The function is passed an `event` parameter:

```js
{
  total: Number        // total # of images,  N
  count: Number        // # of loaded images, [ 1 .. N ]
  image: Image         // loaded image element, or defaultImage
  data:  String|Object // the value provided in the input array
}
```

Since the loading is done in parallel, the order is not the same as the input. This event will be triggered regardless of whether the `image` resource loaded successfully, so `image` may be null.

Here, `ev.data` is the same element that was given in the input array, either a string URL or the object containing `{ url }`.

#### `emitter.on('not-found', fn)`

Emitted for each resource that cannot be loaded (i.e. 404). The passed value is the `data` that was unable to load; either a String or `{ url }` object depending on what was passed to input.

This is emitted before the `progress` event.

## License

MIT, see [LICENSE.md](http://github.com/Jam3/async-image-loader/blob/master/LICENSE.md) for details.
