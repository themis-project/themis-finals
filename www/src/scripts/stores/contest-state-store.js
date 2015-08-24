import alt from '../alt'
import ContestStateActions from '../actions/contest-state-actions'
import eventManager from '../event-manager'
import ContestState from '../models/contest-state'


class ContestStateStore {
    constructor() {
        this.state = {
            loading: true,
            err: null,
            models: null
        }

        this.bindListeners({
            handleUpdate: ContestStateActions.UPDATE,
            handleFetch: ContestStateActions.FETCH,
            handleFailed: ContestStateActions.FAILED
        })

        if (eventManager.enabled) {
            eventManager.eventSource.addEventListener('contest/state', (e) => {
                let data = JSON.parse(e.data)
                console.log((new Date()), data)
                ContestStateActions.update(new ContestState(data))
            })
        }
    }

    handleUpdate(contestState) {
        this.setState({
            loading: false,
            err: null,
            model: contestState
        })
    }

    handleFetch() {
        this.setState({
            loading: true,
            err: null,
            model: null
        })
    }

    handleFailed(err) {
        this.setState({
            loading: false,
            err: err,
            model: null
        })
    }
}


export default alt.createStore(ContestStateStore, 'ContestStateStore')
