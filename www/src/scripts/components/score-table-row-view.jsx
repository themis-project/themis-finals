import React from 'react'
import 'string.prototype.startswith'

import ScoreTablePositionCellView from './score-table-position-cell-view'
import ScoreTableServiceStateCellView from './score-table-service-state-cell-view'
import ScoreTableTotalScoreCellView from './score-table-total-score-cell-view'
import ScoreTableScoreCellView from './score-table-score-cell-view'
import ScoreTableTeamCellView from './score-table-team-cell-view'


export default class ScoreTableRowView extends React.Component {
    render() {
        let cells = this.props.order.map((column, ndx) => {
            let value = this.props.data[column]

            if (column === 'position') {
                return <ScoreTablePositionCellView key={ndx} value={value}/>
            } else if (column.startsWith('#service_')) {
                return <ScoreTableServiceStateCellView key={ndx} value={value}/>
            } else if (column === 'score') {
                return <ScoreTableTotalScoreCellView key={ndx} value={value} lastAttack={this.props.data.lastAttack} live={this.props.live}/>
            } else if (column === 'attack') {
                return <ScoreTableScoreCellView key={ndx} absoluteValue={this.props.data.attackPoints} relativeValue={this.props.data.attackScore} live={this.props.live}/>
            } else if (column === 'defence') {
                return <ScoreTableScoreCellView key={ndx} absoluteValue={this.props.data.defencePoints} relativeValue={this.props.data.defenceScore} live={this.props.live}/>
            } else if (column === 'team') {
                return <ScoreTableTeamCellView key={ndx} value={value} marked={this.props.identity.isTeam() && this.props.identity.getId() === this.props.data.id} guest={this.props.data.guest} teamId={this.props.data.id}/>
            }

            return (
                <td key={ndx}>
                    {value}
                </td>
            )
        })

        return (
            <tr>
                {cells}
            </tr>
        )
    }
}
