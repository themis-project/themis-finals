class EventManager {
    constructor() {
        if (this.enabled) {
            this.eventSource = new window.EventSource('/api/stream')

            this.eventSource.onmessage = (e) => {
                console.log(e.data)
            }
        }
    }

    get enabled() {
        return window.EventSource != null
    }
}


export default new EventManager()
