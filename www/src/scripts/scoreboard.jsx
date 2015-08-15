import React from 'react'
import DocumentTitle from 'react-document-title'
import dataManager from './data-manager'
import { Table, Paper } from 'material-ui'
import 'array.prototype.find'


export default class Scoreboard extends React.Component {
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

            let headerCols = {
                position: { content: '#' },
                team: { content: 'Team' },
                score: { content: 'Score' },
                attack: { content: 'Attack' },
                defence: { content: 'Defence' }
            }

            let colOrder = ['position', 'team', 'score', 'attack', 'defence']

            for (let service of services) {
                let serviceId = `service_${service.id}`
                headerCols[serviceId] = { content: service.name }
                colOrder.push(serviceId)
            }

            let rows = []

            for (let team of teams) {
                let teamScore = teamScores.find((score) => {
                    return score.teamId === team.id
                })

                let row = {
                    team: { content: team.name },
                    score: { content: teamScore ? teamScore.totalPoints: 0 },
                    attack: { content: teamScore ? teamScore.attackPoints : 0 },
                    defence: { content: teamScore ? teamScore.defencePoints : 0 }
                }

                for (let service of services) {
                    let serviceId = `service_${service.id}`
                    let teamServiceState = teamServiceStates.find((state) => {
                        return state.teamId === team.id && state.serviceId === service.id
                    })
                    row[serviceId] = { content: teamServiceState ? teamServiceState.state : 'unknown' }
                }

                rows.push(row)
            }

            rows = rows.sort((row1, row2) => {
                return row2.score.content - row1.score.content
            })

            let rowData = rows.map((row, ndx) => {
                row['position'] = { content: ndx + 1 }
                return row
            })

            this.setState({
                loaded: true,
                scoreboard: {
                    fixedHeader: true,
                    fixedFooter: false,
                    stripedRows: false,
                    showRowHover: false,
                    selectable: false,
                    multiSelectable: false,
                    canSelectAll: false,
                    deselectOnClickaway: true,
                    displayRowCheckbox: false,
                    height: 'auto',
                    rowData: rowData,
                    headerCols: headerCols,
                    colOrder: colOrder
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
                                return <Table
                                    headerColumns={this.state.scoreboard.headerCols}
                                    columnOrder={this.state.scoreboard.colOrder}
                                    rowData={this.state.scoreboard.rowData}
                                    height={this.state.scoreboard.height}
                                    fixedHeader={this.state.scoreboard.fixedHeader}
                                    fixedFooter={false}
                                    stripedRows={this.state.scoreboard.stripedRows}
                                    showRowHover={this.state.scoreboard.showRowHover}
                                    selectable={false}
                                    multiSelectable={false}
                                    canSelectAll={false}
                                    deselectOnClickaway={false}
                                    displayRowCheckbox={false}
                                />
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
