var each = require('async-each')
var loadImage = require('load-img')
var Emitter = require('events').EventEmitter

module.exports = asyncImages

function asyncImages (data, opt, cb) {
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
    var total = data.length
    each(data, function (item, next) {
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
          data: item
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
