import alt from '../alt'
import ContestStateActions from '../actions/contest-state-actions'
import eventManager from '../event-manager'
import ContestState from '../models/contest-state'


class ContestStateStore {
    constructor() {
        this.state = {
            contestState: null,
            err: null
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

    handleUpdate(state) {
        this.setState(state)
    }

    handleFetch() {
        this.setState({
            contestState: null,
            err: null
        })
    }

    handleFailed(state) {
        this.setState(state)
    }
}


export default alt.createStore(ContestStateStore, 'ContestStateStore')
