import React from 'react'
import numeral from 'numeral'


export default class ScoreTableScoreCellView extends React.Component {
    render() {
        return (
            <td>
                <span>{numeral(this.props.relativeValue).format('0.00%')}</span>
                <br/>
                <span>{numeral(this.props.absoluteValue).format('0.00')}</span>
            </td>
        )
    }
}
