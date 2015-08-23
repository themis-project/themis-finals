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

    updateContestState(contestState) {
        this.dispatch(contestState)
    }

    fetchContestState() {
        this.dispatch()

        ContestStateActions
        .fetchPromise()
        .then((contestState) => {
            this.actions.updateContestState(contestState)
        })
        .catch((err) => {
            this.actions.contestStateFailed(err)
        })
    }

    realtimeContestState() {
        this.dispatch()

        eventManager.eventSource.addEventListener('contest/state', (e) => {
            let data = JSON.parse(e.data)
            console.log((new Date()), data)
            this.actions.updateContestState(new ContestState(data))
        })
    }

    contestStateFailed(err) {
        this.dispatch(err)
    }
}


export default alt.createActions(ContestStateActions)
