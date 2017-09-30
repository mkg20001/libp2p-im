"use strict"

const debug = require("debug")
const log = debug("libp2p-im:db")
const {
  series,
  each
} = require("async")

const levelup = require("levelup")
const leveldown = require("leveldown")
const Scheme = require("./scheme")

module.exports = function DB(file, schemes) {
  const self = this
  log("db file", file)
  const db = self.db = levelup(file, {
    db: file => new leveldown(file)
  })
  db.set = db.put
  self.start = cb => series([
    cb => db.open(cb),
    cb => each(Object.keys(schemes), (s, cb) => self[s].start(cb), cb)
  ], cb)
  self.stop = db.close.bind(db)
  for (var scheme in schemes)
    new Scheme(scheme, schemes[scheme], self)
}
