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
                readyState: eventManager.enabled ? eventManager.eventSource.readyState : -1
            })
        }
    }

    componentDidMount() {
        this.interval = window.setInterval(this.update, 2000)
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
            marginRight: '10px'
        }
        let text = null
        switch (this.state.readyState) {
            case -1:
                text = 'not supported'
                style.color = Styles.Colors.deepOrange500
                style.backgroundColor = Styles.Colors.deepOrange50
                break
            case 0:
                text = 'connecting'
                style.color = Styles.Colors.yellow800
                style.backgroundColor = Styles.Colors.yellow50
                break
            case 1:
                text = 'connected'
                style.color = Styles.Colors.green700
                style.backgroundColor = Styles.Colors.green50
                break
            case 2:
                text = 'closed'
                style.color = Styles.Colors.red600
                style.backgroundColor = Styles.Colors.red50
                break
            default:
                text = 'n/a'
                style.color = Styles.Colors.grey600
                style.backgroundColor = Styles.Colors.grey100
                break
        }
        return <span style={style}>{`Stream: ${text}`}</span>
    }
}
