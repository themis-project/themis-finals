import React from 'react'
import DocumentTitle from 'react-document-title'
import { Table, Paper, Styles } from 'material-ui'
import 'array.prototype.find'

import dataManager from '../data-manager'
import ScoreTableView from './score-table-view'

import TeamActions from '../actions/team-actions'
import TeamStore from '../stores/team-store'

import ServiceActions from '../actions/service-actions'
import ServiceStore from '../stores/service-store'

import TeamScoreActions from '../actions/team-score-actions'
import TeamScoreStore from '../stores/team-score-store'

import TeamServiceStateActions from '../actions/team-service-state-actions'
import TeamServiceStateStore from '../stores/team-service-state-store'

import TeamAttackActions from '../actions/team-attack-actions'
import TeamAttackStore from '../stores/team-attack-store'

import ContestScoreboardActions from '../actions/contest-scoreboard-actions'
import ContestScoreboardStore from '../stores/contest-scoreboard-store'


export default class ScoreboardView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            teams: TeamStore.getState(),
            services: ServiceStore.getState(),
            teamScores: TeamScoreStore.getState(),
            teamServiceStates: TeamServiceStateStore.getState(),
            teamAttacks: TeamAttackStore.getState(),
            contestScoreboard: ContestScoreboardStore.getState()
        }

        this.onUpdateTeams = this.onUpdateTeams.bind(this)
        this.onUpdateServices = this.onUpdateServices.bind(this)
        this.onUpdateTeamScores = this.onUpdateTeamScores.bind(this)
        this.onUpdateTeamServiceStates = this.onUpdateTeamServiceStates.bind(this)
        this.onUpdateTeamAttacks = this.onUpdateTeamAttacks.bind(this)
        this.onUpdateContestScoreboard = this.onUpdateContestScoreboard.bind(this)
    }

    onUpdateTeams(teams) {
        this.setState({
            teams: teams
        })
    }

    onUpdateServices(services) {
        this.setState({
            services: services
        })
    }

    onUpdateTeamScores(teamScores) {
        this.setState({
            teamScores: teamScores
        })
    }

    onUpdateTeamServiceStates(teamServiceStates) {
        this.setState({
            teamServiceStates: teamServiceStates
        })
    }

    onUpdateTeamAttacks(teamAttacks) {
        this.setState({
            teamAttacks: teamAttacks
        })
    }

    onUpdateContestScoreboard(contestScoreboard) {
        this.setState({
            contestScoreboard: contestScoreboard
        })
    }

    calculateScoreboard() {
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

        for (let service of this.state.services.collection) {
            let serviceId = `#service_${service.id}`
            headers[serviceId] = service.name
            order.push(serviceId)
        }

        let rowData = []

        let maxAttackPoints = 0
        let maxDefencePoints = 0

        for (let teamScore of this.state.teamScores.collection) {
            if (teamScore.attackPoints > maxAttackPoints) {
                maxAttackPoints = teamScore.attackPoints
            }
            if (teamScore.defencePoints > maxDefencePoints) {
                maxDefencePoints = teamScore.defencePoints
            }
        }

        for (let team of this.state.teams.collection) {
            let teamScore = this.state.teamScores.collection.find((score) => {
                return score.teamId === team.id
            })

            let teamAttack = this.state.teamAttacks.collection.find((attack) => {
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

            for (let service of this.state.services.collection) {
                let serviceId = `#service_${service.id}`
                let teamServiceState = this.state.teamServiceStates.collection.find((state) => {
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

        return {
            order: order,
            rows: rows,
            headers: headers,
            live: this.props.identity.isInternal() || this.state.contestScoreboard.model.enabled
        }
    }

    componentDidMount() {
        TeamStore.listen(this.onUpdateTeams)
        ServiceStore.listen(this.onUpdateServices)
        TeamScoreStore.listen(this.onUpdateTeamScores)
        TeamServiceStateStore.listen(this.onUpdateTeamServiceStates)
        TeamAttackStore.listen(this.onUpdateTeamAttacks)
        ContestScoreboardStore.listen(this.onUpdateContestScoreboard)

        TeamActions.fetch()
        ServiceActions.fetch()
        TeamScoreActions.fetch()
        TeamServiceStateActions.fetch()
        TeamAttackActions.fetch()
        ContestScoreboardActions.fetch()
    }

    componentWillUnmount() {
        TeamStore.unlisten(this.onUpdateTeams)
        ServiceStore.unlisten(this.onUpdateServices)
        TeamScoreStore.unlisten(this.onUpdateTeamScores)
        TeamServiceStateStore.unlisten(this.onUpdateTeamServiceStates)
        TeamAttackStore.unlisten(this.onUpdateTeamAttacks)
        ContestScoreboardStore.unlisten(this.onUpdateContestScoreboard)
    }

    isLoading() {
        return (this.state.teams.loading ||
                this.state.services.loading ||
                this.state.teamScores.loading ||
                this.state.teamServiceStates.loading ||
                this.state.teamAttacks.loading ||
                this.state.contestScoreboard.loading)
    }

    isError() {
        return (this.state.teams.err ||
                this.state.services.err ||
                this.state.teamScores.err ||
                this.state.teamServiceStates.err ||
                this.state.teamAttacks.err ||
                this.state.contestScoreboard.err)
    }

    render() {
        let style = {
            paddingTop: '15px',
            paddingBottom: '15px',
            paddingLeft: Styles.Spacing.desktopGutter,
            paddingRight: Styles.Spacing.desktopGutter
        }

        return (
            <DocumentTitle title="Themis Finals :: Scoreboard">
                <Paper zDepth={0} style={style}>
                    <h2>Scoreboard</h2>
                    {
                        (() => {
                            if (this.isLoading()) {
                                return <p>Loading</p>
                            }

                            if (this.isError()) {
                                return <p>Failed to fetch scoreboard data</p>
                            }

                            return <ScoreTableView identity={this.props.identity} scoreboard={this.calculateScoreboard()}/>
                        })()
                    }
                </Paper>
            </DocumentTitle>
        )
    }
}
