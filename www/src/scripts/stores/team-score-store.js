import alt from '../alt'
import TeamScoreActions from '../actions/team-score-actions'
import { List } from 'immutable'
import eventManager from '../event-manager'
import TeamScoreModel from '../models/team-score-model'


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
            handleFailed: TeamScoreActions.FAILED,
            handleUpdateSingle: TeamScoreActions.UPDATE_SINGLE
        })

        if (eventManager.enabled) {
            eventManager.eventSource.addEventListener('team/score', (e) => {
                let data = JSON.parse(e.data)
                console.log((new Date()), data)
                TeamScoreActions.updateSingle(new TeamScoreModel(data))
            })
        }
    }

    handleUpdate(teamScores) {
        this.setState({
            loading: false,
            err: null,
            collection: teamScores
        })
    }

    handleUpdateSingle(teamScore) {
        let ndx = this.state.collection.findIndex(x => x.teamId === teamScore.teamId)
        this.setState({
            loading: false,
            err: null,
            collection: (ndx === -1) ? this.state.collection.push(teamScore) : this.state.collection.set(ndx, teamScore)
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
