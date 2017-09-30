"use strict"

//basics
const libp2p = require("libp2p")
const debug = require("debug")
const log = debug("libp2p-im:swarm")

//multiformats
const PeerInfo = require('peer-info')
const multiaddr = require('multiaddr')

//connection
const SPDY = require('libp2p-spdy')
const MULTIPLEX = require('libp2p-multiplex')
const SECIO = require('libp2p-secio')

//websocket-star
const WebsocketStarMulti = require("libp2p-websocket-star-multi")

//discovery
const Railing = require("libp2p-railing")

const EXT = require("./node-ext") //is replaced by browser-ext

function Libp2pSwarm(opt) {
  log("creating swarm")

  const peerInfo = new PeerInfo(opt.id);
  (opt.listen || []).forEach(addr => peerInfo.multiaddrs.add(multiaddr(addr)))
  let discovery = []

  let transport = opt.transports || []

  if (opt.bootstrap && opt.bootstrap.length) {
    discovery.push(new Railing(opt.bootstrap))
    log("enabled bootstrap with %s peer(s)", opt.bootstrap.length)
  }

  if (opt.wstar) { //wstar is an array with servers for wstar multi
    const wsm = new WebsocketStarMulti({
      servers: opt.wstar,
      ignore_no_online: opt.wstar_ignore,
      id: opt.id
    })
    peerInfo.multiaddrs.add(multiaddr("/p2p-websocket-star"))
    transport.push(wsm)
    discovery.push(wsm.discovery)
    log("enabled websocket-star-multi with %s server(s) (ignore if unreachable %s)", opt.wstar.length, opt.wstar_ignore || false)
  }

  let l
  EXT(peerInfo, opt, l = {
    discovery,
    transport
  })

  const modules = {
    transport,
    connection: {
      muxer: [
        MULTIPLEX,
        SPDY
      ],
      crypto: [SECIO]
    },
    discovery: (opt.discover || []).concat(discovery),
    dht: l.dht
  }

  return new libp2p(modules, peerInfo /*, peerBook*/ )
}
module.exports = Libp2pSwarm
