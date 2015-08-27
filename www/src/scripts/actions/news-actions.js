import 'whatwg-fetch'
import { Promise } from 'es6-promise'

import alt from '../alt'
import PostModel from '../models/post-model'
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
                    return new PostModel(props)
                })
                resolve(new List(posts))
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    static removePromise(postId) {
        return new Promise((resolve, reject) => {
            fetch(`/api/post/${postId}`, {
                method: 'delete'
            })
            .then((response) => {
                if (response.status === 204) {
                    resolve()
                } else {
                    reject('Unexpected status code')
                }
            })
            .catch((err) => {
                reject(err)
            })
        })
    }

    update(posts) {
        this.dispatch(posts)
    }

    onAdd(post) {
        this.dispatch(post)
    }

    onEdit(post) {
        this.dispatch(post)
    }

    onRemove(postId) {
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

    remove(postId) {
        this.dispatch()

        NewsActions
        .removePromise(postId)
        .then(() => {
            this.actions.onRemove(postId)
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
