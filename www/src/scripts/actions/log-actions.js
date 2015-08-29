import alt from '../alt'
import { List } from 'immutable'


class LogActions {
    unshift(log) {
        this.dispatch(log)
    }
}


export default alt.createActions(LogActions)
