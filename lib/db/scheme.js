"use strict"

const prom = require("promisify-es6")
const debug = require("debug")
const {
  map,
  each,
  series
} = require("async")

module.exports = function DBScheme(name, scheme, dbw) {
  const self = this
  dbw[name] = self
  const db = dbw.db
  const log = debug("libp2p-im:db:scheme#" + name)

  log("create")

  const primary = scheme.primary || "id"
  const secondary = scheme.secondary || []
  const bool = scheme.bool || []
  const cache = {
    secondary: {},
    bool: {}
  }

  function createCache(name, list, cb) {
    each(list, (thing, cb) => {
      log("load cache for " + name + "." + thing)
      getArr(n(name, thing))
        .then(a => {
          cache[name] = a
          return set(n(name, thing), a.join(","))
        })
        .then(() => cb())
        .catch(cb)
    }, cb)
  }

  function addToCache(name, thing, entry, cb) {
    if (cache[name][thing].indexOf(entry) != -1) return cb()
    cache[name][thing].push(entry)
    set(n(name, thing), cache[name][thing], cb)
  }

  const getArr = prom((key, cb) => db.get(key, (err, res) => err ? cb(null, []) : cb(null, res.split(","))))
  const set = prom((key, value, cb) => db.set(key, Array.isArray(value) ? value.join(",") : value, cb))

  function n() {
    return [name].concat([...arguments]).join(".")
  }
  self.allKeys = prom(cb => getArr("keys", cb))
  self.all = prom(cb =>
    self.allKeys().then(keys => map(keys, self.get, cb)).catch(cb))
  self.get = prom((key, cb) =>
    db.get(n("key", key), (err, res) => err ? cb(err) : cb(null, JSON.parse(res))))
  self.find = prom((cond, cb) =>
    self.all().then(res => cb(null, res.filter(cond))).catch(cb))
  self.is = prom((what, cb) => {
    if (!cache.bool[what]) return cb(new Error("Unknown bool id " + what + "!"))
    map(cache.bool[what].slice(0), self.get, cb)
  })
  self.find = prom((what, is, cb) => {
    if (!cache.secondary[what]) return cb(new Error("Unknown secondary id " + what + "!"))
    if (cache.secondary[what].indexOf(is) == -1) return cb(null, [])
    getArr(n("secondary", what, is)).then(a => map(a, self.get, cb))
  })
  self.put = prom((value, cb) => {
    if (!prom[primary]) return cb(new Error("Missing primary value " + primary + "!"))
    const id = prom[primary]
    log("insert", id)
    series([
      cb => each(bool, (b, cb) => {
        if (value[b]) addToCache("bool", b, value, id, cb)
        else cb()
      }, cb),
      cb => each(secondary, (sec, cb) => {
        if (value[sec]) series([
          cb => addToCache("secondary", sec, value[sec], cb),
          cb => getArr(n("secondary", sec, value[sec])).then(a => set(n("secondary", sec, value[sec]), a)).then(cb).catch(cb)
        ], cb)
        else cb()
      }, cb),
      cb => db.set(n("key", id), JSON.stringify(value), cb)
    ])
  })

  self.start = cb => series([
    cb => db.open(cb),
    cb => createCache("bool", bool, cb),
    cb => createCache("secondary", secondary, cb)
  ], cb)
}
