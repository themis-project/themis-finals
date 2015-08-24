import alt from '../alt'
import ContestScoreboardActions from '../actions/contest-scoreboard-actions'


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
