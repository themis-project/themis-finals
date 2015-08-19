import React from 'react'


export default class ScoreTableTeamCellView extends React.Component {
    render() {
        let className = 'themis-team-other'
        if (this.props.marked) {
            className = 'themis-team-marked'
        }

        let extras = ''
        if (this.props.guest) {
            extras = [
                <span key={0}>&nbsp;&nbsp;</span>,
                <span key={1} className="themis-team-guest">guest</span>
            ]
        }

        let pictureSource = `/api/team/pictures/${this.props.teamId}`

        return (
            <td>
                <img className="themis-team-logo" src={pictureSource}/>
                &nbsp;
                <span className={className}>{this.props.value}</span>
                {extras}
            </td>
        )
    }
}
