import alt from '../alt'
import TeamScoreActions from '../actions/team-score-actions'
import { List } from 'immutable'


class TeamScoreStore {
    constructor() {
        this.state = {
            loading: true,
            err: null,
            collection: new List()
        }

        this.bindListeners({
            handleUpdate: TeamScoreActions.UPDATE,
            handleFetch: TeamScoreActions.FETCH,
            handleFailed: TeamScoreActions.FAILED
        })
    }

    handleUpdate(teamScores) {
        this.setState({
            loading: false,
            err: null,
            collection: teamScores
        })
    }

    handleFetch() {
        this.setState({
            loading: true,
            err: null,
            collection: new List()
        })
    }

    handleFailed(err) {
        this.setState({
            loading: false,
            err: err,
            collection: new List()
        })
    }
}


export default alt.createStore(TeamScoreStore, 'TeamScoreStore')
