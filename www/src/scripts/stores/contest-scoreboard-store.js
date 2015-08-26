import alt from '../alt'
import ContestScoreboardActions from '../actions/contest-scoreboard-actions'
import eventManager from '../event-manager'
import ContestScoreboardModel from '../models/contest-scoreboard-model'


class ContestScoreboardStore {
    constructor() {
        this.state = {
            loading: true,
            err: null,
            model: null
        }

        this.bindListeners({
            handleUpdate: ContestScoreboardActions.UPDATE,
            handleFetch: ContestScoreboardActions.FETCH,
            handleFailed: ContestScoreboardActions.FAILED
        })

        if (eventManager.enabled) {
            eventManager.eventSource.addEventListener('contest/scoreboard', (e) => {
                let data = JSON.parse(e.data)
                console.log((new Date()), data)
                ContestScoreboardActions.update(new ContestScoreboardModel(data))
            })
        }
    }

    handleUpdate(contestScoreboard) {
        this.setState({
            loading: false,
            err: null,
            model: contestScoreboard
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


export default alt.createStore(ContestScoreboardStore, 'ContestScoreboardStore')
