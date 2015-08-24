import alt from '../alt'
import TeamServiceStateActions from '../actions/team-service-state-actions'
import { List } from 'immutable'


class TeamServiceStateStore {
    constructor() {
        this.state = {
            loading: true,
            err: null,
            collection: new List()
        }

        this.bindListeners({
            handleUpdate: TeamServiceStateActions.UPDATE,
            handleFetch: TeamServiceStateActions.FETCH,
            handleFailed: TeamServiceStateActions.FAILED
        })
    }

    handleUpdate(teamServiceStates) {
        this.setState({
            loading: false,
            err: null,
            collection: teamServiceStates
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


export default alt.createStore(TeamServiceStateStore, 'TeamServiceStateStore')
