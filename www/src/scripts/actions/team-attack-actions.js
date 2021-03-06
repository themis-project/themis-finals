import 'whatwg-fetch'
import { Promise } from 'es6-promise'

import alt from '../alt'
import TeamAttackModel from '../models/team-attack-model'
import { List } from 'immutable'


class TeamAttackActions {
    static fetchPromise() {
        return new Promise((resolve, reject) => {
           fetch('/api/team/attacks')
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
                let teamAttacks = data.map((props) => {
                    return new TeamAttackModel(props)
                })
                resolve(new List(teamAttacks))
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    update(teamAttacks) {
        this.dispatch(teamAttacks)
    }

    updateSingle(teamAttack) {
        this.dispatch(teamAttack)
    }

    fetch() {
        this.dispatch()

        TeamAttackActions
        .fetchPromise()
        .then((teamAttacks) => {
            this.actions.update(teamAttacks)
        })
        .catch((err) => {
            this.actions.failed(err)
        })
    }

    failed(err) {
        this.dispatch(err)
    }
}


export default alt.createActions(TeamAttackActions)
