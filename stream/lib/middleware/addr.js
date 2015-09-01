import { Addr } from 'netaddr'

export default function(request, response, next) {
    request.remoteAddr = Addr(request.ip)
    next()
}
