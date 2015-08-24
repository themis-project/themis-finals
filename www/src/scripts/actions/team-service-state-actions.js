import 'whatwg-fetch'
import { Promise } from 'es6-promise'

import alt from '../alt'
import TeamServiceState from '../models/team-service-state'
import { List } from 'immutable'


class TeamServiceStateActions {
    static fetchPromise() {
        return new Promise((resolve, reject) => {
           fetch('/api/team/services')
            .then((response) => {
                if (response.status >= 200 && response.status < 300) {
                    return response.json()
                } else {
                    let err = new Error(response.statusText)
                    err.response = response
                    throw err
                }
            })
            .then((data) => {
                let teamServiceStates = data.map((props) => {
                    return new TeamServiceState(props)
                })
                resolve(new List(teamServiceStates))
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    update(teamServiceStates) {
        this.dispatch(teamServiceStates)
    }

    fetch() {
        this.dispatch()

        TeamServiceStateActions
        .fetchPromise()
        .then((teamServiceStates) => {
            this.actions.update(teamServiceStates)
        })
        .catch((err) => {
            this.actions.failed(err)
        })
    }

    failed(err) {
        this.dispatch(err)
    }
}


export default alt.createActions(TeamServiceStateActions)
