/*globals HTMLImageElement*/
var baboon = require('baboon-image-uri')
var test = require('tape')
var loader = require('./')

test('should load images', function (t) {
  t.plan(10)

  var tiles = [ baboon, 'nothing.png', { url: baboon, foo: 'boo' } ]
  loader(tiles, { crossOrigin: 'Anonymous' }, function (images) {
    t.deepEqual(images[1], null)
    t.ok(images[0] instanceof HTMLImageElement, 'is image')

    if (window.close) {
      setTimeout(function () {
        window.close()
      }, 500)
    }
  })
    .on('not-found', function (item) {
      t.equal(item, 'nothing.png', 'got nothing.png as not found')
    })
    .on('progress', function (ev) {
      t.equal(typeof ev.count, 'number')
      t.equal(ev.total, 3)
      if (typeof ev.data !== 'string') {
        t.equal(ev.data.foo, 'boo', 'gets tile image')
      }
    })
})
