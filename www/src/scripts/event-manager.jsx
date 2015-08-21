

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

        this.eventSource.onmessage = (e) => {
            console.log(e.data)
        }
    }
}


export default new EventManager()
