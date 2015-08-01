import 'whatwg-fetch'
// import 'es6-promise'



class DataManager {
    constructor() {
        this.identity = null
        this.teams = null
        this.services = null
        this.posts = null
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
                    this.identity = data
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
                    this.teams = data
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
                    this.services = data
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
                    this.posts = data
                    resolve(this.posts)
                })
                .catch((err) => {
                    reject(err)
                })
            }
        })
    }
}


export default new DataManager()
