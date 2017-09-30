const Swarm = require("../swarm")

module.exports=function Libp2pIMNode(opt) {
  const self = this
  const swarm = self.swarm = self.libp2p = Swarm(opt.swarm || {})


}
