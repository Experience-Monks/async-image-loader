# async-image-loader

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

A small utility to load images asynchronously, providing `progress` event and skipping images that could not be loaded. 

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

A more complex example, where images are "tile" objects holding other data.

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
  context.drawImage(ev.image, ev.tile.x, ev.tile.y)
})
```

## Install

```sh
npm install async-image-loader --save
```

## Usage

[![NPM](https://nodei.co/npm/async-image-loader.png)](https://www.npmjs.com/package/async-image-loader)

#### `emitter = loader(tiles, [opt], [cb])`

Starts loading the specified `tiles`, which is an array of URLs and/or objects with `url` field.

The `opt` settings can be:

- `crossOrigin` the CORS setting for image loading (default undefined)
- `defaultImage` the fallback Image to use when a load 404s (default null) 

On complete, `cb` is called with the `images` array as the first paramter, which is in the same order as they were specified in the input. Each element is an HTMLImageElement, or the value of `defaultImage` if that URL couldn't be found.

#### `emitter.on('progress', fn)`

After each resource is loaded, or failed, a `progress` is emitted with the following `event` parameter:

```js
{
  total: Number        // total # of images,  N
  count: Number        // # of loaded images, [ 1 .. N ]
  image: Image         // loaded image element, or defaultImage
  tile:  String|Object // the element provided in `tiles` input
}
```

Since the loading is done in parallel, this is not called in the same order as the input. This is called regardless of whether the image loaded successfully, which is why `ev.image` might be null.

#### `emitter.on('not-found', fn)`

URLs or tile objects that 404 or cannot be loaded will emit this event before `progress`, and will pass the `tile` as the first parameter (i.e. the URL or element from your array input).

## License

MIT, see [LICENSE.md](http://github.com/Jam3/async-image-loader/blob/master/LICENSE.md) for details.
