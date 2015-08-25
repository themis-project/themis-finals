import 'whatwg-fetch'
import { Promise } from 'es6-promise'

import alt from '../alt'
import ContestRoundModel from '../models/contest-round-model'
import eventManager from '../event-manager'


class ContestRoundActions {
    static fetchPromise() {
        return new Promise((resolve, reject) => {
           fetch('/api/contest/round')
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
                resolve(new ContestRoundModel(data))
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    update(contestRound) {
        this.dispatch(contestRound)
    }

    fetch() {
        this.dispatch()

        ContestRoundActions
        .fetchPromise()
        .then((contestRound) => {
            this.actions.update(contestRound)
        })
        .catch((err) => {
            this.actions.failed(err)
        })
    }

    failed(err) {
        this.dispatch(err)
    }
}


export default alt.createActions(ContestRoundActions)
