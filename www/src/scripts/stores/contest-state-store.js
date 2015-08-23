import alt from '../alt'
import ContestStateActions from '../actions/contest-state-actions'


class ContestStateStore {
    constructor() {
        this.contestState = null
        this.err = null

        this.bindListeners({
            handleUpdateContestState: ContestStateActions.UPDATE_CONTEST_STATE,
            handleFetchContestState: ContestStateActions.FETCH_CONTEST_STATE,
            handleContestStateFailed: ContestStateActions.CONTEST_STATE_FAILED,
            handleRealtimeContestState: ContestStateActions.REALTIME_CONTEST_STATE
        })
    }

    handleUpdateContestState(contestState) {
        this.contestState = contestState
        this.err = null
    }

    handleFetchContestState() {
        this.contestState = null
    }

    handleContestStateFailed(err) {
        this.err = err
    }

    handleRealtimeContestState() {
    }
}


export default alt.createStore(ContestStateStore, 'ContestStateStore')
