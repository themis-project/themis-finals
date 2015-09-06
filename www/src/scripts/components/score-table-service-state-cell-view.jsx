import React from 'react'
import { Styles } from 'material-ui'


export default class ScoreTableServiceStateCellView extends React.Component {
    render() {
        let style = {
            padding: '4px 8px',
            fontSize: '0.9em'
        }

        let text = null

        switch (this.props.value) {
            case 1:
                text = 'up'
                style.color = Styles.Colors.green700
                style.backgroundColor = Styles.Colors.green50
                break
            case 2:
                text = 'down'
                style.color = Styles.Colors.red600
                style.backgroundColor = Styles.Colors.red50
                break
            case 3:
                text = 'corrupt'
                style.color = Styles.Colors.deepOrange500
                style.backgroundColor = Styles.Colors.deepOrange50
                break
            case 4:
                text = 'mumble'
                style.color = Styles.Colors.brown600
                style.backgroundColor = Styles.Colors.brown50
                break
            case 5:
                text = 'internal_error'
                style.color = Styles.Colors.grey600
                style.backgroundColor = Styles.Colors.grey100
            default:
                text = 'n/a'
                style.color = Styles.Colors.grey600
                style.backgroundColor = Styles.Colors.grey100
                break
        }

        return (
            <td>
                <span style={style}>{text}</span>
            </td>
        )
    }
}
