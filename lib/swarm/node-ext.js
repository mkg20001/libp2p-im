"use strict"

const debug = require("debug")
const log = debug("libp2p-im:swarm:node")

//discovery
const MulticastDNS = require('libp2p-mdns')

//dht
const DHT = require('libp2p-kad-dht')

module.exports = function NodeExtendedSwarm(peerInfo, opt, res) {
  if (opt.mdns) {
    res.discovery.push(new MulticastDNS(peerInfo, "libp2p-im"))
    log("enabled multicast-dns")
  }
  if (opt.dht) res.dht = DHT
  if (opt.custom_dht) res.dht = opt.custom_dht
  if (res.dht) log("enabled dht")
}
