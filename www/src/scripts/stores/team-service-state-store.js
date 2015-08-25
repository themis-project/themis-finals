import alt from '../alt'
import TeamServiceStateActions from '../actions/team-service-state-actions'
import { List } from 'immutable'
import eventManager from '../event-manager'
import TeamServiceStateModel from '../models/team-service-state-model'


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
            handleFailed: TeamServiceStateActions.FAILED,
            handleUpdateSingle: TeamServiceStateActions.UPDATE_SINGLE
        })

        if (eventManager.enabled) {
            eventManager.eventSource.addEventListener('team/service', (e) => {
                let data = JSON.parse(e.data)
                console.log((new Date()), data)
                TeamServiceStateActions.updateSingle(new TeamServiceStateModel(data))
            })
        }
    }

    handleUpdate(teamServiceStates) {
        this.setState({
            loading: false,
            err: null,
            collection: teamServiceStates
        })
    }

    handleUpdateSingle(teamServiceState) {
        let ndx = this.state.collection.findIndex(x => (x.teamId === teamServiceState.teamId && x.serviceId === teamServiceState.serviceId))
        this.setState({
            loading: false,
            err: null,
            collection: (ndx === -1) ? this.state.collection.push(teamServiceState) : this.state.collection.set(ndx, teamServiceState)
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
