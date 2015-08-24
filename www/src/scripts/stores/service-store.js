import alt from '../alt'
import ServiceActions from '../actions/service-actions'
import { List } from 'immutable'


class ServiceStore {
    constructor() {
        this.state = {
            loading: true,
            err: null,
            collection: new List()
        }

        this.bindListeners({
            handleUpdate: ServiceActions.UPDATE,
            handleFetch: ServiceActions.FETCH,
            handleFailed: ServiceActions.FAILED
        })
    }

    handleUpdate(services) {
        this.setState({
            loading: false,
            err: null,
            collection: services
        })
    }

    handleFetch() {
        this.setState({
            loading: true,
            err: null,
            collection: new List()
        })
    }

    handleFailed(err) {
        this.setState({
            loading: false,
            err: err,
            collection: new List()
        })
    }
}


export default alt.createStore(ServiceStore, 'ServiceStore')
