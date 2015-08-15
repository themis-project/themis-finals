import 'whatwg-fetch'
// import 'es6-promise'

import Team from './models/team'
import Service from './models/service'
import Post from './models/post'
import TeamScore from './models/team-score'
import TeamServiceState from './models/team-service-state'
import TeamAttack from './models/team-attack'
import Identity from './models/identity'


class DataManager {
    constructor() {
        this.identity = null
        this.teams = null
        this.services = null
        this.posts = null
        this.contestState = null
        this.teamScores = null
        this.teamServiceStates = null
        this.teamAttacks = null
    }

    getIdentity() {
        return new Promise((resolve, reject) => {
            if (this.identity !== null) {
                resolve(this.identity)
            } else {
               fetch('/api/identity')
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
                    this.identity = new Identity(data)
                    resolve(this.identity)
                })
                .catch((err) => {
                    reject(err)
                })
            }
        })
    }

    getTeams() {
        return new Promise((resolve, reject) => {
            if (this.teams !== null) {
                resolve(this.teams)
            } else {
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
                    this.teams = data.map((props) => {
                        return new Team(props)
                    })
                    resolve(this.teams)
                })
                .catch((err) => {
                    reject(err)
                })
            }
        })
    }

    getServices() {
        return new Promise((resolve, reject) => {
            if (this.services !== null) {
                resolve(this.services)
            } else {
               fetch('/api/services')
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
                    this.services = data.map((props) => {
                        return new Service(props)
                    })
                    resolve(this.services)
                })
                .catch((err) => {
                    reject(err)
                })
            }
        })
    }

    getPosts() {
        return new Promise((resolve, reject) => {
            if (this.posts !== null) {
                resolve(this.posts)
            } else {
               fetch('/api/posts')
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
                    this.posts = data.map((props) => {
                        return new Post(props)
                    })
                    resolve(this.posts)
                })
                .catch((err) => {
                    reject(err)
                })
            }
        })
    }

    getContestState() {
        return new Promise((resolve, reject) => {
            if (this.contestState !== null) {
                resolve(this.contestState)
            } else {
               fetch('/api/contest')
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
                    this.contestState = data
                    resolve(this.contestState)
                })
                .catch((err) => {
                    reject(err)
                })
            }
        })
    }

    getTeamScores() {
        return new Promise((resolve, reject) => {
            if (this.teamScores !== null) {
                resolve(this.teamScores)
            } else {
               fetch('/api/team/scores')
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
                    this.teamScores = data.map((props) => {
                        return new TeamScore(props)
                    })
                    resolve(this.teamScores)
                })
                .catch((err) => {
                    reject(err)
                })
            }
        })
    }

    getTeamServiceStates() {
        return new Promise((resolve, reject) => {
            if (this.teamServiceStates !== null) {
                resolve(this.teamServiceStates)
            } else {
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
                    this.teamServiceStates = data.map((props) => {
                        return new TeamServiceState(props)
                    })
                    resolve(this.teamServiceStates)
                })
                .catch((err) => {
                    reject(err)
                })
            }
        })
    }

    getTeamAttacks() {
        return new Promise((resolve, reject) => {
            if (this.teamAttacks !== null) {
                resolve(this.teamAttacks)
            } else {
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
                    this.teamAttacks = data.map((props) => {
                        return new TeamAttack(props)
                    })
                    resolve(this.teamAttacks)
                })
                .catch((err) => {
                    reject(err)
                })
            }
        })
    }
}


export default new DataManager()
