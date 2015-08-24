import alt from '../alt'
import TeamActions from '../actions/team-actions'
import { List } from 'immutable'


class TeamStore {
    constructor() {
        this.state = {
            loading: true,
            err: null,
            collection: new List()
        }

        this.bindListeners({
            handleUpdate: TeamActions.UPDATE,
            handleFetch: TeamActions.FETCH,
            handleFailed: TeamActions.FAILED
        })
    }

    handleUpdate(teams) {
        this.setState({
            loading: false,
            err: null,
            collection: teams
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


export default alt.createStore(TeamStore, 'TeamStore')
