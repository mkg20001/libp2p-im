const Swarm = require("../swarm")
const Protocol = require("../protocol")

module.exports = function Libp2pIMNode(opt) {
  const self = this
  const swarm = self.swarm = self.libp2p = Swarm(opt.swarm || {})
  Protocol(self)

}
