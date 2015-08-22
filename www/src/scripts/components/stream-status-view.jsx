import React from 'react'
import { Styles } from 'material-ui'

import eventManager from '../event-manager'



export default class StreamStatusView extends React.Component {
    constructor(props) {
        super(props)
        this.interval = null
        this.state = {
            readyState: null
        }

        this.update = () => {
            this.setState({
                readyState: eventManager.eventSource.readyState
            })
        }
    }

    componentDidMount() {
        this.interval = window.setInterval(this.update, 5000)
        this.update()
    }

    componentWillUnmount() {
        if (this.interval) {
            window.clearInterval(this.interval)
            this.interval = null
        }
    }


    render() {
        let style = {
            padding: '4px 8px',
            marginRight: '10px',
            color: Styles.Colors.blueGrey600,
            backgroundColor: Styles.Colors.blueGrey50
        }
        let text = null
        switch (this.state.readyState) {
            case 0:
                text = 'connecting'
                break
            case 1:
                text = 'open'
                break
            case 2:
                text = 'closed'
                break
            default:
                text = 'unknown'
                break
        }
        return <span style={style}>{`Stream connection status: ${text}`}</span>
    }
}
