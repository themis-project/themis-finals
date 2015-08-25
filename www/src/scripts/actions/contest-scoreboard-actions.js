import 'whatwg-fetch'
import { Promise } from 'es6-promise'

import alt from '../alt'
import ContestScoreboardModel from '../models/contest-scoreboard-model'
import eventManager from '../event-manager'


class ContestScoreboardActions {
    static fetchPromise() {
        return new Promise((resolve, reject) => {
           fetch('/api/contest/scoreboard')
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
                resolve(new ContestScoreboardModel(data))
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    update(contestScoreboard) {
        this.dispatch(contestScoreboard)
    }

    fetch() {
        this.dispatch()

        ContestScoreboardActions
        .fetchPromise()
        .then((contestScoreboard) => {
            this.actions.update(contestScoreboard)
        })
        .catch((err) => {
            this.actions.failed(err)
        })
    }

    failed(err) {
        this.dispatch(err)
    }
}


export default alt.createActions(ContestScoreboardActions)
