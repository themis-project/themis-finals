import React from 'react'

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
        let text = null
        let className = null
        switch (this.state.state) {
            case 'initial':
                text = 'Contest not started'
                className = 'themis-contest-state themis-contest-state-other'
                break
            case 'running':
                text = 'Contest running'
                className = 'themis-contest-state themis-contest-state-running'
                break
            case 'paused':
                text = 'Contest paused'
                className = 'themis-contest-state themis-contest-state-paused'
                break
            case 'await_complete':
                text = 'Contest will be completed soon'
                className = 'themis-contest-state themis-contest-state-await-complete'
                break
            case 'completed':
                text = 'Contest completed'
                className = 'themis-contest-state themis-contest-state-completed'
                break
            default:
                text = 'Contest state undefined'
                className = 'themis-contest-state themis-contest-state-other'
                break
        }

        return (
            <span className={className}>{text}</span>
        )
    }

}
