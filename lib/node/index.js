"use strict"

const Swarm = require("../swarm")
const DB = require("../db")
const Core = require("../core")

const Protocol = require("../protocol")

const {
  series
} = require("async")

module.exports = function Libp2pIMNode(opt) {
  const self = this

  //parts
  const swarm = self.swarm = self.libp2p = Swarm(opt.swarm || {})
  const db = self.db = new DB(opt.db)
  const core = self.core = new Core(opt.core || {}, self)

  //functions
  self.start = cb => series([swarm, db, core].map(t => cb => t.start(cb)), cb)
  self.stop = cb => series([core, swarm, db].map(t => cb => t.stop(cb)), cb)

  //the protocol
  Protocol(self)

}
