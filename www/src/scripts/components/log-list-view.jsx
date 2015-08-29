import React from 'react'

import LogView from './log-view'


export default class LogListView extends React.Component {
    render() {
        let logViewNodes = this.props.logs.map((log, ndx) => {
            return (
                <LogView key={ndx} type={log.type} params={log.params} updatedAt={log.updatedAt} teams={this.props.teams} services={this.props.services}/>
            )
        })
        return (
            <div>
                {logViewNodes}
            </div>
        )
    }
}
