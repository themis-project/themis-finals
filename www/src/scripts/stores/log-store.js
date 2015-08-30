import alt from '../alt'
import LogActions from '../actions/log-actions'
import { List } from 'immutable'
import eventManager from '../event-manager'
import LogModel from '../models/log-model'


class LogStore {
    constructor() {
        this.state = {
            loading: false,
            err: null,
            collection: new List()
        }

        this.bindListeners({
            handleUnshift: LogActions.UNSHIFT
        })

        if (eventManager.enabled) {
            eventManager.eventSource.addEventListener('log', (e) => {
                let data = JSON.parse(e.data)
                LogActions.unshift(new LogModel(data))
            })
        }
    }

    handleUnshift(log) {
        while (this.state.collection.size > 500) {
            this.state.collection = this.state.collection.pop()
        }

        this.setState({
            loading: false,
            err: null,
            collection: this.state.collection.unshift(log)
        })
    }
}


export default alt.createStore(LogStore, 'LogStore')
