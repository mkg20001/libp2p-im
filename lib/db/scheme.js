"use strict"

const prom = require("promisify").func
const {
  map
} = require("async")

module.exports = function DBScheme(name, scheme, dbw) {
  const self = this
  dbw[name] = self
  const db = dbw.db

  function n() {
    return [name].concat([...arguments]).join(".")
  }
  self.allKeys = prom(cb =>
    db.get(n("keys"), (err, res) => cb(err ? [] : res.split(","))))
  self.all = prom(cb =>
    self.allKeys().catch(cb).then(keys => map(keys, self.get, cb)))
  self.get = prom((key, cb) =>
    db.get(n("key", key), cb))
  self.find = prom((cond, cb) =>
    self.all().catch(cb).then(res => cb(res.filter(cond))))
}
