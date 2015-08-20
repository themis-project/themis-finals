import React from 'react'
import { Styles } from 'material-ui'


export default class ScoreTableServiceStateCellView extends React.Component {
    render() {
        let style = {
            padding: '4px 8px',
            fontSize: '0.9em'
        }

        switch (this.props.value) {
            case 'up':
                style.color = Styles.Colors.green700
                style.backgroundColor = Styles.Colors.green50
                break
            case 'down':
                style.color = Styles.Colors.red600
                style.backgroundColor = Styles.Colors.red50
                break
            case 'corrupt':
                style.color = Styles.Colors.deepOrange500
                style.backgroundColor = Styles.Colors.deepOrange50
                break
            case 'mumble':
                style.color = Styles.Colors.brown600
                style.backgroundColor = Styles.Colors.brown50
                break
            default:
                style.color = Styles.Colors.grey600
                style.backgroundColor = Styles.Colors.grey100
                break
        }

        return (
            <td>
                <span style={style}>{this.props.value}</span>
            </td>
        )
    }
}
