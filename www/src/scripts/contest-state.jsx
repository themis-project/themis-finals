import React from 'react'
import dataManager from './data-manager'


export default class ContestState extends React.Component {
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
        return (
            <div>
                <p>{this.state.round ? 'Round is ' + this.state.round : ''}</p>
                <p>{this.state.state ? 'Game state: ' + this.state.state : ''}</p>
            </div>
        )
    }
}
