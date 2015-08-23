import React from 'react'
import { Styles } from 'material-ui'

import dataManager from '../data-manager'
import eventManager from '../event-manager'

import ContestStateStore from '../stores/contest-state-store'
import ContestStateActions from '../actions/contest-state-actions'


export default class ContestStateView extends React.Component {
    constructor(props) {
        super(props)
        this.state = ContestStateStore.getState()

        this.onUpdate = this.onUpdate.bind(this)
    }

    componentDidMount() {
        ContestStateStore.listen(this.onUpdate)
        ContestStateActions.fetch()
    }

    componentWillUnmount() {
        ContestStateStore.unlisten(this.onUpdate)
    }

    onUpdate(state) {
        this.setState(state)
    }

    render() {
        if (this.state.contestState == null) {
            return <span></span>
        }

        let style = {
            padding: '4px 8px',
            marginRight: '10px'
        }

        let text = null

        switch (this.state.contestState.value) {
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

        return <span style={style}>{text}</span>
    }
}
