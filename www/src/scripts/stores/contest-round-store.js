import alt from '../alt'
import ContestRoundActions from '../actions/contest-round-actions'
import eventManager from '../event-manager'
import ContestRoundModel from '../models/contest-round-model'


class ContestRoundStore {
    constructor() {
        this.state = {
            loading: true,
            err: null,
            model: null
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
                ContestRoundActions.update(new ContestRoundModel(data))
            })
        }
    }

    handleUpdate(contestRound) {
        this.setState({
            loading: false,
            err: null,
            model: contestRound
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


export default alt.createStore(ContestRoundStore, 'ContestRoundStore')
