import React from 'react'
import numeral from 'numeral'
import moment from 'moment'


export default class ScoreTableTotalScoreCellView extends React.Component {
    render() {
        let extras = ''
        if (this.props.lastAttack != null) {
            extras = [
                <br key={0}/>,
                <span key={1} className="themis-score-last-attack">last attack at {moment(this.props.lastAttack).format('LTS')}</span>
            ]
        }
        return (
            <td className={this.props.live ? 'themis-text-normal' : 'themis-text-muted'}>
                <span>{numeral(this.props.value).format('0.00%')}</span>
                {extras}
            </td>
        )
    }
}
