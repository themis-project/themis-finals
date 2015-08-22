

class EventManager {
    constructor() {
        this.eventSource = null
        this.contestRoundListeners = null
    }

    get enabled() {
        return window.EventSource != null
    }

    start() {
        this.eventSource = new window.EventSource('/api/stream')

        // this.eventSource.onopen = () => {
        //     console.log('Connected to stream')
        // }

        this.eventSource.onmessage = (e) => {
            console.log(e.data)
        }

        // this.eventSource.onerror = (e) => {
        //     console.log(e)
        // }
    }
}


export default new EventManager()
