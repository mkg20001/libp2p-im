const protobuf = require("protons")
const pull = require("pull-stream")
const pproto = require("pull-protocol-buffers")

function pipe(conn, def) {
  if (!def) def = conn.def
  if (!def) throw new Error("No definition found! Attach one using conn.def = protobuf(...)")
  return new Connection({
    source: pull(conn, pproto.decode(conn.isServer ? def.Client : def.Server)), // recieve definition
    sink: pull(pproto.encode(conn.isServer ? def.Server : def.Client), conn) // send definition
  }, conn)
}

function reqRes(conn, fnc, cb) {
  const p = pipe(conn)
  pull(
    p.source,
    pull.collect((err, res) => {
      if (err) return cb(err)
      if (!res.length || !res[0].length || res.length != 1) return cb(new Error("Invalid amount of data"))
      return fnc(res[0], (err, res) => {
        if (err) return cb(err)
        pull(
          pull.values(res),
          p.sink
        )
      })
    })
  )
}

function justRes(conn, res) {
  pull(
    pull.values(Array.isArray(res) ? res : [res]),
    pipe(conn),
    pull.drain()
  )
}

module.exports = function Protocol(node) {
  const swarm = node.swarm
  const defs = node.defs = {
    profile: protobuf("message Server { string name = 1; string desc = 2; int64 avatar = 3; bool freind = 4; } message Client {}")
  }
  const handle = (type, handle) => {
    swarm.handle("/im/" + type + "/1.0.0", (proto, conn) => {
      conn.isServer = true
      conn.def = defs[type]
      handle(conn)
    })
  }
  handle("profile", conn => {
    justRes(conn, {
      name: "test",
      desc: "alive",
      avatar: 123,
      friend: false
    })
  })
}
