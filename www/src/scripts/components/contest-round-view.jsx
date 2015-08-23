import React from 'react'
import { Styles } from 'material-ui'

import ContestRoundStore from '../stores/contest-round-store'
import ContestRoundActions from '../actions/contest-round-actions'


export default class ContestRoundView extends React.Component {
    constructor(props) {
        super(props)
        this.state = ContestRoundStore.getState()

        this.onUpdate = this.onUpdate.bind(this)
    }

    componentDidMount() {
        ContestRoundStore.listen(this.onUpdate)
        ContestRoundActions.fetch()
    }

    componentWillUnmount() {
        ContestRoundStore.unlisten(this.onUpdate)
    }

    onUpdate(state) {
        this.setState(state)
    }

    render() {
        if (this.state.contestRound == null || this.state.contestRound.value == null) {
            return <span></span>
        }

        let style = {
            padding: '4px 8px',
            marginRight: '10px',
            color: Styles.Colors.blueGrey600,
            backgroundColor: Styles.Colors.blueGrey50
        }

        return <span style={style}>{`Round ${this.state.contestRound.value}`}</span>
    }
}
