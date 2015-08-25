import alt from '../alt'
import NewsActions from '../actions/news-actions'
import eventManager from '../event-manager'
import PostModel from '../models/post-model'
import { List } from 'immutable'


class NewsStore {
    constructor() {
        this.state = {
            loading: true,
            err: null,
            collection: new List()
        }

        this.bindListeners({
            handleUpdate: NewsActions.UPDATE,
            handleFetch: NewsActions.FETCH,
            handleFailed: NewsActions.FAILED,
            handleAdd: NewsActions.ADD,
            handleEdit: NewsActions.EDIT,
            handleRemove: NewsActions.REMOVE
        })

        if (eventManager.enabled) {
            eventManager.eventSource.addEventListener('posts/add', (e) => {
                let data = JSON.parse(e.data)
                console.log((new Date()), data)
                NewsActions.add(new PostModel(data))
            })

            eventManager.eventSource.addEventListener('posts/remove', (e) => {
                let data = JSON.parse(e.data)
                console.log((new Date()), data)
                NewsActions.remove(data.id)
            })

            eventManager.eventSource.addEventListener('posts/edit', (e) => {
                let data = JSON.parse(e.data)
                console.log((new Date()), data)
                NewsActions.edit(new PostModel(data))
            })
        }
    }

    handleUpdate(posts) {
        this.setState({
            loading: false,
            err: null,
            collection: posts
        })
    }

    handleAdd(post) {
        this.setState({
            loading: false,
            err: null,
            collection: this.state.collection.push(post)
        })
    }

    handleEdit(post) {
        let ndx = this.state.collection.findIndex(x => x.id === post.id)
        this.setState({
            loading: false,
            err: null,
            collection: (ndx === -1) ? this.state.collection.push(post) : this.state.collection.set(ndx, post)
        })
    }

    handleRemove(postId) {
        this.setState({
            loading: false,
            err: null,
            collection: this.state.collection.filter(x => x.id !== postId)
        })
    }

    handleFetch() {
        this.setState({
            loading: true,
            err: null,
            collection: new List()
        })
    }

    handleFailed(err) {
        this.setState({
            loading: false,
            err: err,
            collection: new List()
        })
    }
}


export default alt.createStore(NewsStore, 'NewsStore')
