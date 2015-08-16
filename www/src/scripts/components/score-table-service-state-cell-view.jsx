import React from 'react'


export default class ScoreTableServiceStateCellView extends React.Component {
    render() {
        let className = null
        switch (this.props.value) {
            case 'up':
                className = 'themis-service-state themis-service-state-up'
                break
            case 'down':
                className = 'themis-service-state themis-service-state-down'
                break
            case 'corrupt':
                className = 'themis-service-state themis-service-state-corrupt'
                break
            case 'mumble':
                className = 'themis-service-state themis-service-state-mumble'
                break
            default:
                className = 'themis-service-state themis-service-state-other'
                break
        }

        return (
            <td>
                <span className={className}>{this.props.value}</span>
            </td>
        )
    }
}
