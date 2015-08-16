import React from 'react'


export default class ScoreTablePositionCellView extends React.Component {
    render() {
        let className = null
        switch (this.props.value) {
            case 1:
                className = 'themis-position themis-position-gold'
                break
            case 2:
                className = 'themis-position themis-position-silver'
                break
            case 3:
                className = 'themis-position themis-position-bronze'
                break
        }
        return (
            <td className={className}>
                {this.props.value}
            </td>
        )
    }
}
