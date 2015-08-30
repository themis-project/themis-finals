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
            handleOnAdd: NewsActions.ON_ADD,
            handleOnEdit: NewsActions.ON_EDIT,
            handleOnRemove: NewsActions.ON_REMOVE,
            handleRemove: NewsActions.REMOVE,
            handleAdd: NewsActions.ADD,
            handleEdit: NewsActions.EDIT
        })

        if (eventManager.enabled) {
            eventManager.eventSource.addEventListener('posts/add', (e) => {
                let data = JSON.parse(e.data)
                NewsActions.onAdd(new PostModel(data))
            })

            eventManager.eventSource.addEventListener('posts/remove', (e) => {
                let data = JSON.parse(e.data)
                NewsActions.onRemove(data.id)
            })

            eventManager.eventSource.addEventListener('posts/edit', (e) => {
                let data = JSON.parse(e.data)
                NewsActions.onEdit(new PostModel(data))
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

    handleOnAdd(post) {
        this.setState({
            loading: false,
            err: null,
            collection: this.state.collection.push(post)
        })
    }

    handleOnEdit(post) {
        let ndx = this.state.collection.findIndex(x => x.id === post.id)
        this.setState({
            loading: false,
            err: null,
            collection: (ndx === -1) ? this.state.collection.push(post) : this.state.collection.set(ndx, post)
        })
    }

    handleOnRemove(postId) {
        this.setState({
            loading: false,
            err: null,
            collection: this.state.collection.filter(x => x.id !== postId)
        })
    }

    handleRemove() {
        this.setState({
            loading: false,
            err: null,
            collection: this.state.collection
        })
    }

    handleAdd() {
        this.setState({
            loading: false,
            err: null,
            collection: this.state.collection
        })
    }

    handleEdit() {
        this.setState({
            loading: false,
            err: null,
            collection: this.state.collection
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
