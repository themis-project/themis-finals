import 'whatwg-fetch'
import { Promise } from 'es6-promise'

import alt from '../alt'
import ContestStateModel from '../models/contest-state-model'


class ContestStateActions {
    static fetchPromise() {
        return new Promise((resolve, reject) => {
           fetch('/api/contest/state')
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
                resolve(new ContestStateModel(data))
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    update(contestState) {
        this.dispatch(contestState)
    }

    fetch() {
        this.dispatch()

        ContestStateActions
        .fetchPromise()
        .then((contestState) => {
            this.actions.update(contestState)
        })
        .catch((err) => {
            this.actions.failed(err)
        })
    }

    failed(err) {
        this.dispatch(err)
    }
}


export default alt.createActions(ContestStateActions)
