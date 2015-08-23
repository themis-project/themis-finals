import alt from '../alt'
import NewsActions from '../actions/news-actions'
import eventManager from '../event-manager'
import Post from '../models/post'


class NewsStore {
    constructor() {
        this.state = {
            loaded: false,
            posts: [],
            err: null
        }

        this.bindListeners({
            handleUpdate: NewsActions.UPDATE,
            handleFetch: NewsActions.FETCH,
            handleFailed: NewsActions.FAILED
        })

        // if (eventManager.enabled) {
        //     eventManager.eventSource.addEventListener('contest/round', (e) => {
        //         let data = JSON.parse(e.data)
        //         console.log((new Date()), data)
        //         ContestRoundActions.update(new ContestRound(data))
        //     })
        // }
    }

    handleUpdate(state) {
        this.setState(state)
    }

    handleFetch() {
        this.setState({
            loaded: false,
            posts: [],
            err: null
        })
    }

    handleFailed(state) {
        this.setState(state)
    }
}


export default alt.createStore(NewsStore, 'NewsStore')
