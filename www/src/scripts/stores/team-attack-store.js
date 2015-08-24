import alt from '../alt'
import TeamAttackActions from '../actions/team-attack-actions'
import { List } from 'immutable'


class TeamAttackStore {
    constructor() {
        this.state = {
            loading: true,
            err: null,
            collection: new List()
        }

        this.bindListeners({
            handleUpdate: TeamAttackActions.UPDATE,
            handleFetch: TeamAttackActions.FETCH,
            handleFailed: TeamAttackActions.FAILED
        })
    }

    handleUpdate(teamAttacks) {
        this.setState({
            loading: false,
            err: null,
            collection: teamAttacks
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


export default alt.createStore(TeamAttackStore, 'TeamAttackStore')
