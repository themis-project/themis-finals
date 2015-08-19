import React from 'react'
import DocumentTitle from 'react-document-title'
import { Table, Paper } from 'material-ui'
import 'array.prototype.find'
import { Promise } from 'es6-promise'

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
              dataManager.getTeamAttacks(), dataManager.getContestState])
        .then((data) => {
            let [teams, services, teamScores, teamServiceStates, teamAttacks, contestState] = data

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

            let maxAttackPoints = 0
            let maxDefencePoints = 0

            for (let teamScore of teamScores) {
                if (teamScore.attackPoints > maxAttackPoints) {
                    maxAttackPoints = teamScore.attackPoints
                }
                if (teamScore.defencePoints > maxDefencePoints) {
                    maxDefencePoints = teamScore.defencePoints
                }
            }

            for (let team of teams) {
                let teamScore = teamScores.find((score) => {
                    return score.teamId === team.id
                })

                let teamAttack = teamAttacks.find((attack) => {
                    return attack.teamId === team.id
                })

                let attackPoints = teamScore ? teamScore.attackPoints : 0
                let defencePoints = teamScore ? teamScore.defencePoints : 0

                let attackScore = (maxAttackPoints < 0.001) ? 0 : attackPoints / maxAttackPoints
                let defenceScore = (maxDefencePoints < 0.001) ? 0 : defencePoints / maxDefencePoints

                let row = {
                    id: team.id,
                    team: team.name,
                    score: 0.5 * (attackScore + defenceScore),
                    attackPoints: attackPoints,
                    defencePoints: defencePoints,
                    attackScore: attackScore,
                    defenceScore: defenceScore,
                    lastAttack: teamAttack ? teamAttack.occuredAt : null,
                    guest: team.guest
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
                let score1 = row1.score
                let score2 = row2.score
                if (Math.abs(score1 - score2) < 0.001) {
                    let attack1 = row1.lastAttack
                    let attack2 = row2.lastAttack

                    // == used intentionally
                    if (attack1 == null && attack2 == null) {
                        return 0
                    } else if (attack1 == null && attack2 != null) {
                        return 1
                    } else if (attack2 == null && attack1 != null) {
                        return -1
                    } else {
                        return attack1.getTime() - attack2.getTime()
                    }
                }
                return score2 - score1
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
                    headers: headers,
                    live: this.props.identity.isInternal() || contestState.scoreboardEnabled
                },
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
                                return <ScoreTableView identity={this.props.identity} scoreboard={this.state.scoreboard}/>
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
