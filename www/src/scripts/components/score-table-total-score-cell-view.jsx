import React from 'react'
import numeral from 'numeral'


export default class ScoreTableTotalScoreCellView extends React.Component {
    render() {
        return (
            <td>
                {numeral(this.props.value).format('0.00%')}
            </td>
        )
    }
}
