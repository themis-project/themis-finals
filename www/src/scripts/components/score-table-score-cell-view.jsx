import React from 'react'
import numeral from 'numeral'


export default class ScoreTableScoreCellView extends React.Component {
    render() {
        return (
            <td className={this.props.live ? 'themis-text-normal' : 'themis-text-muted'}>
                <span>{numeral(this.props.relativeValue).format('0.00%')}</span>
                <br/>
                <span className="themis-score-points">{numeral(this.props.absoluteValue).format('0.00')} pts</span>
            </td>
        )
    }
}
