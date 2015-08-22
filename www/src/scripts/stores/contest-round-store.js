import alt from '../alt'
import ContestRoundActions from '../actions/contest-round-actions'


class ContestRoundStore {
    constructor() {
        this.contestRound = null
        this.err = null

        this.bindListeners({
            handleUpdateContestRound: ContestRoundActions.UPDATE_CONTEST_ROUND,
            handleFetchContestRound: ContestRoundActions.FETCH_CONTEST_ROUND,
            handleContestRoundFailed: ContestRoundActions.CONTEST_ROUND_FAILED,
            handleRealtimeContestRound: ContestRoundActions.REALTIME_CONTEST_ROUND
        })
    }

    handleUpdateContestRound(contestRound) {
        this.contestRound = contestRound
        this.err = null
    }

    handleFetchContestRound() {
        this.contestRound = null
    }

    handleContestRoundFailed(err) {
        this.err = err
    }

    handleRealtimeContestRound() {
    }
}


export default alt.createStore(ContestRoundStore, 'ContestRoundStore')
