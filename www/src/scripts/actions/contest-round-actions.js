import 'whatwg-fetch'
import { Promise } from 'es6-promise'

import alt from '../alt'
import ContestRound from '../models/contest-round'
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
                resolve(new ContestRound(data))
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    updateContestRound(contestRound) {
        this.dispatch(contestRound)
    }

    fetchContestRound() {
        this.dispatch()

        ContestRoundActions
        .fetchPromise()
        .then((contestRound) => {
            this.actions.updateContestRound(contestRound)
        })
        .catch((err) => {
            this.actions.contestRoundFailed(err)
        })
    }

    realtimeContestRound() {
        this.dispatch()

        eventManager.eventSource.addEventListener('contest/round', (e) => {
            let data = JSON.parse(e.data)
            console.log((new Date()), data)
            this.actions.updateContestRound(new ContestRound(data))
        })
    }

    contestRoundFailed(err) {
        this.dispatch(err)
    }
}


export default alt.createActions(ContestRoundActions)
