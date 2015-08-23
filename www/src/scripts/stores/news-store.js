import alt from '../alt'
import NewsActions from '../actions/news-actions'
import eventManager from '../event-manager'
import Post from '../models/post'
import { List } from 'immutable'


class NewsStore {
    constructor() {
        this.state = {
            loaded: false,
            posts: new List(),
            err: null
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
                NewsActions.add(new Post(data))
            })

            eventManager.eventSource.addEventListener('posts/remove', (e) => {
                let data = JSON.parse(e.data)
                console.log((new Date()), data)
                NewsActions.remove(data.id)
            })

            eventManager.eventSource.addEventListener('posts/edit', (e) => {
                let data = JSON.parse(e.data)
                console.log((new Date()), data)
                NewsActions.edit(new Post(data))
            })
        }
    }

    handleUpdate(state) {
        this.setState(state)
    }

    handleAdd(post) {
        this.setState({
            loaded: true,
            err: null,
            posts: this.state.posts.push(post)
        })
    }

    handleEdit(post) {
        let ndx = this.state.posts.findIndex(x => x.id === post.id)
        this.setState({
            loaded: true,
            err: null,
            posts: (ndx === -1) ? this.state.posts.push(post) : this.state.posts.set(ndx, post)
        })
    }

    handleRemove(postId) {
        this.setState({
            loaded: true,
            err: null,
            posts: this.state.posts.filter(x => x.id !== postId)
        })
    }

    handleFetch() {
        this.setState({
            loaded: false,
            posts: new List(),
            err: null
        })
    }

    handleFailed(state) {
        this.setState(state)
    }
}


export default alt.createStore(NewsStore, 'NewsStore')
