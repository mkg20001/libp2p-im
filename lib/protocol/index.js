"use strict"

const debug = require("debug")
const log = debug("libp2p-im:protocol")

const protobuf = require("protons")
const pull = require("pull-stream")
const pproto = require("pull-protocol-buffers")
const Connection = require("interface-connection").Connection

function pipe(conn, def) {
  if (!def) def = conn.def
  if (!def) throw new Error("No definition found! Attach one using conn.def = protobuf(...)")
  return new Connection({
    source: pull(conn, pproto.decode(conn.isServer ? def.Client : def.Server)), // recieve definition
    sink: pull(pproto.encode(conn.isServer ? def.Server : def.Client), conn) // send definition
  }, conn)
}

module.exports = function Protocol(node) {
  const swarm = node.swarm
  const defs = node.defs = {
    profile: protobuf("message Server { required string name = 1; string desc = 2; int64 avatar = 3; required bool friend = 4; } message Client {}")
  }
  const cmds = node.cmds = {}
  const middleware = (conn, type) => {
    conn.def = defs[type]
    conn.pipe = pipe.bind(null, conn)
  }
  const handle = (type, handle) => {
    log("handle", type)
    swarm.handle("/im/" + type + "/1.0.0", (proto, conn) => {
      conn.isServer = true
      middleware(conn, type)
      handle(conn)
    })
  }
  const cmd = (type, handle) => {
    log("add cmd", type)
    cmds[type] = function CMD(peer) {
      const a = [...arguments]
      a.shift()
      const cb = a.pop()
      if (typeof cb != "function") throw new Error("Last argument for .cmd. *must* be function!")
      swarm.dial(peer, "/im/" + type + "/1.0.0", (err, conn) => {
        if (err) return cb(err)
        a.push(cb)
        middleware(conn, type)
        a.unshift(conn)
        try {
          handle.apply(null, a)
        } catch (e) {
          return cb(err)
        }
      })
    }
  }

  swarm.cmd = function CMD(type) {
    const a = [...arguments]
    a.shift()
    const cmd = cmds[type]
    if (!cmd) throw new Error("Unknown cmd " + type + "!")
    cmd.apply(null, a)
  }

  handle("profile", conn =>
    pull(
      pull.values([{
        name: "test",
        desc: "alive",
        avatar: 123,
        friend: false
      }]),
      conn.pipe(),
      pull.drain()
    ))
  cmd("profile", (conn, cb) =>
    pull(
      pull.values([]),
      conn.pipe(),
      pull.collect((err, res) => {
        if (err) return cb(err)
        if (!res.length || !res[0] || res.length !== 1) return cb(new Error("Invalid amount of data"))
        return cb(null, res)
      })
    ))
}
