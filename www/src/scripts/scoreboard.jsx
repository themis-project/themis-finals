import React from 'react'
import dataManager from './data-manager'


export default class Scoreboard extends React.Component {
    componentDidMount() {
        Promise
        .all([dataManager.getTeams(), dataManager.getServices(),
              dataManager.getTeamScores(), dataManager.getTeamServiceStates()])
        .then((data) => {
            let [teams, services, teamScores, teamServiceStates] = data
            console.log('Teams', teams)
            console.log('Services', services)
            console.log('Team scores', teamScores)
            console.log('Team service states', teamServiceStates)
        })
        .catch((err) => {
            console.log('Error', err)
        })
    }

    render() {
        return <h2>Scoreboard</h2>
    }
}
