"use strict"

const debug = require("debug")
const log = debug("libp2p-im:db")

const levelup = require("levelup")
// const leveldown = require("leveldown")
const Scheme = require("./scheme")

module.exports = function DB(file, schemes) {
  const self = this
  log("db file", file)
  const db = self.db = levelup(file) //levelup(leveldown(file))
  self.start = db.open.bind(db)
  self.stop = db.close.bind(db)
  for (var scheme in schemes)
    new Scheme(scheme, schemes[scheme], self)
}
