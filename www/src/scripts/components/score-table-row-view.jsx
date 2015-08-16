import React from 'react'
import 'string.prototype.startswith'

import ScoreTablePositionCellView from './score-table-position-cell-view'
import ScoreTableServiceStateCellView from './score-table-service-state-cell-view'


export default class ScoreTableRowView extends React.Component {
    render() {
        let cells = this.props.order.map((column, ndx) => {
            let value = this.props.data[column]

            if (column === 'position') {
                return <ScoreTablePositionCellView key={ndx} value={value}/>
            } else if (column.startsWith('#service_')) {
                return <ScoreTableServiceStateCellView key={ndx} value={value}/>
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
