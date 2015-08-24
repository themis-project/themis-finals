import alt from '../alt'
import NewsActions from '../actions/news-actions'
import eventManager from '../event-manager'
import Post from '../models/post'
import { List } from 'immutable'


class NewsStore {
    constructor() {
        this.state = {
            posts: {
                loading: true,
                err: null,
                collection: new List()
            }
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

    handleUpdate(posts) {
        this.setState({
            posts: {
                loading: false,
                err: null,
                collection: posts
            }
        })
    }

    handleAdd(post) {
        this.setState({
            posts: {
                loading: false,
                err: null,
                collection: this.state.posts.collection.push(post)
            }
        })
    }

    handleEdit(post) {
        let ndx = this.state.posts.collection.findIndex(x => x.id === post.id)
        this.setState({
            posts: {
                loading: false,
                err: null,
                collection: (ndx === -1) ? this.state.posts.collection.push(post) : this.state.posts.collection.set(ndx, post)
            }
        })
    }

    handleRemove(postId) {
        this.setState({
            posts: {
                loading: false,
                err: null,
                collection: this.state.posts.collection.filter(x => x.id !== postId)
            }
        })
    }

    handleFetch() {
        this.setState({
            posts: {
                loading: true,
                err: null,
                collection: new List()
            }
        })
    }

    handleFailed(err) {
        this.setState({
            posts: {
                loading: false,
                err: err,
                collection: new List()
            }
        })
    }
}


export default alt.createStore(NewsStore, 'NewsStore')
