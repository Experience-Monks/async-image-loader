var each = require('async-each')
var loadImage = require('img')
var Emitter = require('events').EventEmitter

module.exports = asyncImages

function asyncImages (tiles, opt, cb) {
  if (typeof opt === 'function') {
    cb = opt
    opt = {}
  }

  opt = opt || {}

  var emitter = new Emitter()
  process.nextTick(load)
  return emitter

  function load () {
    var count = 0
    var total = tiles.length
    each(tiles, function (item, next) {
      var url = typeof item === 'string' ? item : item.url
      loadImage(url, opt, function (err, image) {
        if (err) {
          emitter.emit('not-found', item)
          image = opt.defaultImage || null
        }

        emitter.emit('progress', {
          count: ++count,
          total: total,
          image: image,
          tile: item
        })

        next(null, image)
      })
    }, function (nil, images) {
      if (typeof cb === 'function') {
        cb(images)
      }
    })
  }
}
