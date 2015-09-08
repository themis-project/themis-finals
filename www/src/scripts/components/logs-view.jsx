import React from 'react'
import DocumentTitle from 'react-document-title'
import { Paper, Styles } from 'material-ui'

import LogStore from '../stores/log-store'
import LogActions from '../actions/log-actions'
import LogModel from '../models/log-model'

import LogListView from './log-list-view'

import TeamActions from '../actions/team-actions'
import TeamStore from '../stores/team-store'

import ServiceActions from '../actions/service-actions'
import ServiceStore from '../stores/service-store'

import Customize from '../../../customize'


export default class LogsView extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            logs: LogStore.getState(),
            teams: TeamStore.getState(),
            services: ServiceStore.getState()
        }

        this.onUpdateTeams = this.onUpdateTeams.bind(this)
        this.onUpdateServices = this.onUpdateServices.bind(this)
        this.onUpdateLogs = this.onUpdateLogs.bind(this)
    }

    componentDidMount() {
        TeamStore.listen(this.onUpdateTeams)
        ServiceStore.listen(this.onUpdateServices)
        LogStore.listen(this.onUpdateLogs)

        TeamActions.fetch()
        ServiceActions.fetch()
    }

    componentWillUnmount() {
        TeamStore.unlisten(this.onUpdateTeams)
        ServiceStore.unlisten(this.onUpdateServices)
        LogStore.unlisten(this.onUpdateLogs)
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

    onUpdateLogs(logs) {
        this.setState({
            logs: logs
        })
    }

    isLoading() {
        return (this.state.logs.loading ||
                this.state.teams.loading ||
                this.state.services.loading)
    }

    isError() {
        return (this.state.logs.err ||
                this.state.teams.err ||
                this.state.services.err)
    }

    render() {
        let style = {
            paddingTop: '15px',
            paddingBottom: '15px',
            paddingLeft: Styles.Spacing.desktopGutter,
            paddingRight: Styles.Spacing.desktopGutter
        }

        let title = `${Customize.contestTitle} :: Logs`

        return (
            <DocumentTitle title={title}>
                <Paper zDepth={0} style={style}>
                    <h2>Logs</h2>
                    {
                        (() => {
                            if (this.isLoading()) {
                                return <p>Loading</p>
                            }

                            if (this.isError()) {
                                return <p>Failed to fetch data</p>
                            }

                            return <LogListView logs={this.state.logs.collection} teams={this.state.teams.collection} services={this.state.services.collection}/>
                        })()
                    }
                </Paper>
            </DocumentTitle>
        )
    }
}
