"use strict"

const debug = require("debug")
const log = debug("libp2p-im:core")

module.exports = function Core(opt, node) {
  const self = this
  // TODO: add
  self.start = cb => cb()
  self.stop = cb => cb()
}
