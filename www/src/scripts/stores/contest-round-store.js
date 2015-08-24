import alt from '../alt'
import ContestRoundActions from '../actions/contest-round-actions'
import eventManager from '../event-manager'
import ContestRound from '../models/contest-round'


class ContestRoundStore {
    constructor() {
        this.state = {
            contestRound: {
                loading: true,
                err: null,
                model: null
            }
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

    handleUpdate(contestRound) {
        this.setState({
            contestRound: {
                loading: false,
                err: null,
                model: contestRound
            }
        })
    }

    handleFetch() {
        this.setState({
            contestRound: {
                loading: true,
                err: null,
                model: null
            }
        })
    }

    handleFailed(err) {
        this.setState({
            contestRound: {
                loading: false,
                err: err,
                model: null
            }
        })
    }
}


export default alt.createStore(ContestRoundStore, 'ContestRoundStore')
