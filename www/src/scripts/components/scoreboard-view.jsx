import React from 'react'
import DocumentTitle from 'react-document-title'
import { Table, Paper } from 'material-ui'
import 'array.prototype.find'

import dataManager from '../data-manager'
import ScoreTableView from './score-table-view'


export default class ScoreboardView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false
        }
    }

    componentDidMount() {
        Promise
        .all([dataManager.getTeams(), dataManager.getServices(),
              dataManager.getTeamScores(), dataManager.getTeamServiceStates(),
              dataManager.getTeamAttacks()])
        .then((data) => {
            let [teams, services, teamScores, teamServiceStates, teamAttacks] = data

            let order = [
                'position',
                'team',
                'score',
                'attack',
                'defence'
            ]

            let headers = {
                position: '#',
                team: 'Team',
                score: 'Score',
                attack: 'Attack',
                defence: 'Defence'
            }

            for (let service of services) {
                let serviceId = `#service_${service.id}`
                headers[serviceId] = service.name
                order.push(serviceId)
            }

            let rowData = []

            for (let team of teams) {
                let teamScore = teamScores.find((score) => {
                    return score.teamId === team.id
                })

                let row = {
                    id: team.id,
                    team: team.name,
                    score: teamScore ? teamScore.totalPoints: 0,
                    attack: teamScore ? teamScore.attackPoints : 0,
                    defence: teamScore ? teamScore.defencePoints : 0
                }

                for (let service of services) {
                    let serviceId = `#service_${service.id}`
                    let teamServiceState = teamServiceStates.find((state) => {
                        return state.teamId === team.id && state.serviceId === service.id
                    })
                    row[serviceId] = teamServiceState ? teamServiceState.state : 'unknown'
                }

                rowData.push(row)
            }

            rowData = rowData.sort((row1, row2) => {
                return row2.score - row1.score
            })

            let rows = rowData.map((row, ndx) => {
                row['position'] = ndx + 1
                return row
            })

            this.setState({
                loaded: true,
                scoreboard: {
                    order: order,
                    rows: rows,
                    headers: headers
                }
            })
        })
        .catch((err) => {
            console.log('Error', err)
        })
    }

    render() {
        let style = {
            padding: '15px'
        }

        return (
            <DocumentTitle title="Themis Finals :: Scoreboard">
                <Paper size={1} style={style}>
                    <h2>Scoreboard</h2>
                    {
                        (() => {
                            if (this.state.loaded) {
                                return <ScoreTableView scoreboard={this.state.scoreboard}/>
                            } else {
                                return <p>Loading</p>
                            }
                        })()
                    }
                </Paper>
            </DocumentTitle>
        )
    }
}
