import alt from '../alt'
import TeamAttackActions from '../actions/team-attack-actions'
import { List } from 'immutable'
import eventManager from '../event-manager'
import TeamAttackModel from '../models/team-attack-model'


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
            handleFailed: TeamAttackActions.FAILED,
            handleUpdateSingle: TeamAttackActions.UPDATE_SINGLE
        })

        if (eventManager.enabled) {
            eventManager.eventSource.addEventListener('team/attack', (e) => {
                let data = JSON.parse(e.data)
                console.log((new Date()), data)
                TeamAttackActions.updateSingle(new TeamAttackModel(data))
            })
        }
    }

    handleUpdate(teamAttacks) {
        this.setState({
            loading: false,
            err: null,
            collection: teamAttacks
        })
    }

    handleUpdateSingle(teamAttack) {
        let ndx = this.state.collection.findIndex(x => x.teamId === teamAttack.teamId)
        this.setState({
            loading: false,
            err: null,
            collection: (ndx === -1) ? this.state.collection.push(teamAttack) : this.state.collection.set(ndx, teamAttack)
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
