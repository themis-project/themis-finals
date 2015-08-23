import 'whatwg-fetch'
import { Promise } from 'es6-promise'

import alt from '../alt'
import ContestState from '../models/contest-state'
import eventManager from '../event-manager'


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
                resolve(new ContestState(data))
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    update(contestState) {
        this.dispatch({
            contestState: contestState,
            err: null
        })
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
        this.dispatch({
            contestState: null,
            err: err
        })
    }
}


export default alt.createActions(ContestStateActions)
