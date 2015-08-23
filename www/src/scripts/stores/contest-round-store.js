import alt from '../alt'
import ContestRoundActions from '../actions/contest-round-actions'
import eventManager from '../event-manager'
import ContestRound from '../models/contest-round'


class ContestRoundStore {
    constructor() {
        this.state = {
            contestRound: null,
            err: null
        }

        this.bindListeners({
            handleUpdate: ContestRoundActions.UPDATE,
            handleFetch: ContestRoundActions.FETCH,
            handleFailed: ContestRoundActions.FAILED
        })

        if (eventManager.enabled) {
            eventManager.eventSource.addEventListener('contest/round', (e) => {
                let data = JSON.parse(e.data)
                console.log((new Date()), data)
                ContestRoundActions.update(new ContestRound(data))
            })
        }
    }

    handleUpdate(state) {
        this.setState(state)
    }

    handleFetch() {
        this.setState({
            contestRound: null,
            err: null
        })
    }

    handleFailed(state) {
        this.setState(state)
    }
}


export default alt.createStore(ContestRoundStore, 'ContestRoundStore')
