import React from 'react'
import { Styles } from 'material-ui'

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
        if (this.state.loading) {
            return <span></span>
        }

        if (this.state.err) {
            return <span>Failed to fetch contest state</span>
        }

        let style = {
            padding: '4px 8px',
            marginRight: '10px'
        }

        let text = null

        switch (this.state.model.value) {
            case 0:
                text = 'Contest not started'
                style.color = Styles.Colors.grey600
                style.backgroundColor = Styles.Colors.grey100
                break
            case 1:
                text = 'Contest will start soon'
                style.color = Styles.Colors.blue900
                style.backgroundColor = Styles.Colors.blue50
                break
            case 2:
                text = 'Contest running'
                style.color = Styles.Colors.green700
                style.backgroundColor = Styles.Colors.green50
                break
            case 3:
                text = 'Contest paused'
                style.color = Styles.Colors.brown600
                style.backgroundColor = Styles.Colors.brown50
                break
            case 4:
                text = 'Contest will be completed soon'
                style.color = Styles.Colors.deepOrange500
                style.backgroundColor = Styles.Colors.deepOrange50
                break
            case 5:
                text = 'Contest completed'
                style.color = Styles.Colors.red600
                style.backgroundColor = Styles.Colors.red50
                break
            default:
                text = 'Contest state n/a'
                style.color = Styles.Colors.grey600
                style.backgroundColor = Styles.Colors.grey100
                break
        }

        return <span style={style}>{text}</span>
    }
}
