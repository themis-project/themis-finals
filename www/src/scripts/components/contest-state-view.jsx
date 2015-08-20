import React from 'react'
import { Styles } from 'material-ui'

import dataManager from '../data-manager'


export default class ContestStateView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            state: null
        }
    }

    componentDidMount() {
        dataManager
        .getContestState()
        .then((contestState) => {
            this.setState({
                state: contestState.value
            })
        }.bind(this))
        .catch((err) => {
            console.log('Error', err)
        })
    }

    render() {
        let style = {
            padding: '4px 8px',
            marginRight: '10px'
        }

        let text = null

        switch (this.state.state) {
            case 'initial':
                text = 'Contest not started'
                style.color = Styles.Colors.grey600
                style.backgroundColor = Styles.Colors.grey100
                break
            case 'running':
                text = 'Contest running'
                style.color = Styles.Colors.green700
                style.backgroundColor = Styles.Colors.green50
                break
            case 'paused':
                text = 'Contest paused'
                style.color = Styles.Colors.brown600
                style.backgroundColor = Styles.Colors.brown50
                break
            case 'await_complete':
                text = 'Contest will be completed soon'
                style.color = Styles.Colors.deepOrange500
                style.backgroundColor = Styles.Colors.deepOrange50
                break
            case 'completed':
                text = 'Contest completed'
                style.color = Styles.Colors.red600
                style.backgroundColor = Styles.Colors.red50
                break
            default:
                text = 'Contest state unknown'
                style.color = Styles.Colors.grey600
                style.backgroundColor = Styles.Colors.grey100
                break
        }

        return (
            <span style={style}>{text}</span>
        )
    }

}
