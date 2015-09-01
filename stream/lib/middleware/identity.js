import config from '../utils/config'
import matchNetworks from '../utils/netaddr'

export default function(request, response, next) {
    request.identity = null
    let remoteAddr = request.remoteAddr

    if (request.identity == null && matchNetworks(config.network.teams, remoteAddr)) {
        request.identity = 'teams'
    }

    if (request.identity == null && matchNetworks(config.network.internal, remoteAddr)) {
        request.identity = 'internal'
    }

    if (request.identity == null && matchNetworks(config.network.other, remoteAddr)) {
        request.identity = 'other'
    }

    next()
}
