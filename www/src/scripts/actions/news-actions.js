import 'whatwg-fetch'
import { Promise } from 'es6-promise'

import alt from '../alt'
import Post from '../models/post'
import eventManager from '../event-manager'
import { List } from 'immutable'


class NewsActions {
    static fetchPromise() {
        return new Promise((resolve, reject) => {
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
                let posts = data.map((props) => {
                    return new Post(props)
                })
                resolve(new List(posts))
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    update(posts) {
        this.dispatch(posts)
    }

    add(post) {
        this.dispatch(post)
    }

    edit(post) {
        this.dispatch(post)
    }

    remove(postId) {
        this.dispatch(postId)
    }

    fetch() {
        this.dispatch()

        NewsActions
        .fetchPromise()
        .then((posts) => {
            this.actions.update(posts)
        })
        .catch((err) => {
            this.actions.failed(err)
        })
    }

    failed(err) {
        this.dispatch(err)
    }
}


export default alt.createActions(NewsActions)
