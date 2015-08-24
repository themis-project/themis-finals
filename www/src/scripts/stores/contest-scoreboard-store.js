import alt from '../alt'
import ContestScoreboardActions from '../actions/contest-scoreboard-actions'


class ContestScoreboardStore {
    constructor() {
        this.state = {
            contestRound: {
                loading: true,
                err: null,
                model: null
            }
        }

        this.bindListeners({
            handleUpdate: ContestScoreboardActions.UPDATE,
            handleFetch: ContestScoreboardActions.FETCH,
            handleFailed: ContestScoreboardActions.FAILED
        })
    }

    handleUpdate(contestScoreboard) {
        this.setState({
            contestScoreboard: {
                loading: false,
                err: null,
                model: contestScoreboard
            }
        })
    }

    handleFetch() {
        this.setState({
            contestScoreboard: {
                loading: true,
                err: null,
                model: null
            }
        })
    }

    handleFailed(err) {
        this.setState({
            contestScoreboard: {
                loading: false,
                err: err,
                model: null
            }
        })
    }
}


export default alt.createStore(ContestScoreboardStore, 'ContestScoreboardStore')
