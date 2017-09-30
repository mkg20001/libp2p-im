"use strict"

const IMNode = require("./lib/node")
//const merge = require("merge-recursive").recursive
const Id = require("peer-id")

const TCP = require("libp2p-tcp")
const WS = require("libp2p-websockets")

const opt = {
  swarm: {
    dht: true,
    mdns: true,
    transports: [
      new TCP(),
      new WS()
    ],
    listen: [
      "/ip4/0.0.0.0/tcp/54323",
      "/ip4/0.0.0.0/tcp/54324/ws",
    ],
    wstar_ignore: true
  }
}
/*const Servers = require("./servers.js")
for (var p in Servers)
  opt.swarm[p] = Servers[p]*/

Id.createFromJSON({
  "id": "QmcnYDzTaFvfgbmtoJppk1A6keGd1P9ixPZxyfQWoBtA9s",
  "privKey": "CAASpwkwggSjAgEAAoIBAQCdNG9NX80vg3jNi6PedwrHMxZ3Y5FmjPyU4rgd7pwiHxDxMrJ6aShevXnWrHHsZr0EuGcQJ8eNnrpbGdoc849jnuBLvaMlspZ88Sr/bZo8Ji3M5x2swB+7YqhhcEWxuGBktSi1klJI/8JknW8CiGTSjB4m/MtWntEWB54MPGYGn7uR/qtRYlKyQ41NkBBe2ozEMkE20GAroZc2/hgJqqo8WrzkpPvvbj6xh5yRCLPGur6PLOUpJDnA2a/3YBAU+pOovETeLlz7Dzj8OhmYvmcjZ3DTXn4E9h2USF5aw2lTbfhLPUQtKsIkqkXpYTPlsE7GHGz6SoY6e5yhhIyommiTAgMBAAECggEBAItYDgxsjai/BZZUX4VyyVf2ncRnultHPyANspu9hCHunYreoDtG+OS5WMUDh9u+2W7UsW4thIGwn4je6mndLk1kZ3ZbesCQgznuX2mX0i3cvZ4xgik9ByOG+K+d3/j+8Fp0BcikEVHpenrK3bpGAfBrCNMQIoD+N2EqkVpRMzJMgJhA8e8dGaDJHavV42qjNSDOuxJiAENSAZeKEeMBc9wLFxnDD6XOAwSEuKVUQ1axShsmuA7b+y0XYnoJoy3Ow3WJlMHK3Et5zM5ceGlKzvIyMBqgdLLeQ5hNlp3T/1v1ahQRYQb52zZL03BiGAynT/6XPM+hCKFM+CiyzVn6UokCgYEA3Ru7sWL6qYWL9/c1XX4y6E2jUBYAV0d+YCsZjaZA7c4Mi5MqaJoQrps0Lm1PBUySV6IT5xQsWMa4IQuELHMQYGKO9GWyu6cHL3o+Ui3htiF5EoV9COmmCeas8v8v1K6f4V9E0FQquziADyyXlidfmjyN6ToA4B7CrXBsMUyPxRcCgYEAtgMlrJO6lPF1fcqlG5dsSYbwebkpmymxzewgAnCwgJeTehpaOitvfsZPtKiAJZUD1axqCvuSPikDbiwEqAFlAE6n2chuB7mZyNuuDkx4pTpaD/bFmIF24/9kwJyCVxEPnqJFs0Y4gBfoTAEOfCfBzg7YnDJY4v8lQyBskVTgneUCgYBgLGH1hFH3TolVMAfcRLor5Sk1+nvnesdzWQviWwA+77LxOu/lU64R5JxL3WvTqDy3NV5m0pV/f+AzL2ksVFg5NGVt1JZrnPk5I3jcEeztZZ3d+oYqTEbWY6mygGDzp4kPZHrwCswTZz38W68LttCUq+YmHf6nfXm8KvxEbULTvQKBgHU687IC+ILkPnuF4PAziHCXNB4Cb9TbdwUd18QaluRMPJXBkWmz/j0WN9IxUVBjeTPPuAFY5WmZ+vaj7V/UfhxDjQLNgGkDVxSywZm+EVrCia2MkNpYUJ4rKdaRN7YibAANnn0Idm2yeFEzwQOgi8hPcZ6xIuUZ1wM0SBkXJREtAoGAdnDLEsA12ZosLhtbd4ikGnTAKhmpZ9OlSOGJnLx/agKYS8OEabzRfzgKrMsIbgSVFF/5FZFpJTEmTc46g4qemvyPf1XR7Zkdk6VX0revxwbGDzFrukARq02eWx5ggWyvBE/OD/I1dDT1zhZcZlwZyOSxkHUd7Z6wZfQeGD+APk0=",
  "pubKey": "CAASpgIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCdNG9NX80vg3jNi6PedwrHMxZ3Y5FmjPyU4rgd7pwiHxDxMrJ6aShevXnWrHHsZr0EuGcQJ8eNnrpbGdoc849jnuBLvaMlspZ88Sr/bZo8Ji3M5x2swB+7YqhhcEWxuGBktSi1klJI/8JknW8CiGTSjB4m/MtWntEWB54MPGYGn7uR/qtRYlKyQ41NkBBe2ozEMkE20GAroZc2/hgJqqo8WrzkpPvvbj6xh5yRCLPGur6PLOUpJDnA2a/3YBAU+pOovETeLlz7Dzj8OhmYvmcjZ3DTXn4E9h2USF5aw2lTbfhLPUQtKsIkqkXpYTPlsE7GHGz6SoY6e5yhhIyommiTAgMBAAE="
}, (err, id) => {
  if (err) throw err
  opt.swarm.id = id
  const node = new IMNode(opt)
  node.swarm.start(console.log)
})
