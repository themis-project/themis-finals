export default function matchNetworks(netAddrList, addr) {
    for (let netAddr of netAddrList) {
        if (netAddr.contains(addr)) {
            return true
        }
    }

    return false
}
