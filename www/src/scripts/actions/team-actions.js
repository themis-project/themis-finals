import 'whatwg-fetch'
import { Promise } from 'es6-promise'

import alt from '../alt'
import TeamModel from '../models/team-model'
import { List } from 'immutable'


class TeamActions {
    static fetchPromise() {
        return new Promise((resolve, reject) => {
           fetch('/api/teams')
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
                let teams = data.map((props) => {
                    return new TeamModel(props)
                })
                resolve(new List(teams))
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    update(teams) {
        this.dispatch(teams)
    }

    fetch() {
        this.dispatch()

        TeamActions
        .fetchPromise()
        .then((teams) => {
            this.actions.update(teams)
        })
        .catch((err) => {
            this.actions.failed(err)
        })
    }

    failed(err) {
        this.dispatch(err)
    }
}


export default alt.createActions(TeamActions)
