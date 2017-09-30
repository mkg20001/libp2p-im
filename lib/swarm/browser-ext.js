"use strict"

const debug = require("debug")
const log = debug("libp2p-im:swarm:node")

module.exports = function BrowserExtendedSwarm(peerInfo, opt, res) {
  log("browser")
  res.browser = true
}
