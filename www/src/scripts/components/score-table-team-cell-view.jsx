import React from 'react'


export default class ScoreTableTeamCellView extends React.Component {
    render() {
        let className = 'themis-team-other'
        if (this.props.marked) {
            className = 'themis-team-marked'
        }
        return (
            <td className={className}>
                {this.props.value}
            </td>
        )
    }
}
