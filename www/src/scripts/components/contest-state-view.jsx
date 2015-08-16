import React from 'react'
import { Paper } from 'material-ui'

import dataManager from '../data-manager'


export default class ContestStateView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            round: null,
            state: null
        }
    }

    componentDidMount() {
        dataManager
        .getContestState()
        .then((contestState) => {
            this.setState(contestState)
        }.bind(this))
        .catch((err) => {
            console.log('Error', err)
        })
    }

    render() {
        let style = {
            padding: '15px'
        }

        return (
            <Paper size={1} style={style}>
                <p>{this.state.round ? 'Round is ' + this.state.round : ''}</p>
                <p>{this.state.state ? 'Game state: ' + this.state.state : ''}</p>
            </Paper>
        )
    }
}
