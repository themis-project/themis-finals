import React from 'react'
import { Styles } from 'material-ui'

import dataManager from '../data-manager'


export default class ContestRoundView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            round: null
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
