import React from 'react'


export default class ScoreTableHeaderView extends React.Component {
    render() {
        let cells = this.props.order.map((column, ndx) => {
            return (
                <th key={ndx}>
                    {this.props.headers[column]}
                </th>
            )
        })

        return (
            <tr>
                {cells}
            </tr>
        )
    }
}
