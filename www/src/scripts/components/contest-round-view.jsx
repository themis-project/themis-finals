import React from 'react'
import { Styles } from 'material-ui'

import dataManager from '../data-manager'
import eventManager from '../event-manager'


export default class ContestRoundView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            round: null
        }

        this.onUpdate = (e) => {
            let data = JSON.parse(e.data)
            this.setState({
                round: data.value
            })
        }
    }

    componentDidMount() {
        dataManager
        .getContestRound()
        .then((contestRound) => {
            this.setState({
                round: contestRound.value
            })
        }.bind(this))
        .catch((err) => {
            console.log('Error', err)
        })

        eventManager.eventSource.addEventListener('contest/round', this.onUpdate)
    }

    componentWillUnmount() {
        eventManager.eventSource.removeEventListener('contest/round', this.onUpdate)
    }

    render() {
        let style = {
            padding: '4px 8px',
            marginRight: '10px',
            color: Styles.Colors.blueGrey600,
            backgroundColor: Styles.Colors.blueGrey50
        }
        let el = <span></span>
        if (this.state.round) {
            el = <span style={style}>{`Round ${this.state.round}`}</span>
        }

        return el
    }
}
