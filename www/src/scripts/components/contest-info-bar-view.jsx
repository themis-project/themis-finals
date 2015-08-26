import React from 'react'
import { Paper, Styles } from 'material-ui'

import ContestRoundView from './contest-round-view'
import ContestStateView from './contest-state-view'
import StreamStatusView from './stream-status-view'


export default class ContestInfoBarView extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let style = {
            paddingTop: '15px',
            paddingBottom: '15px',
            paddingLeft: Styles.Spacing.desktopGutter,
            paddingRight: Styles.Spacing.desktopGutter,
            marginTop: '64px'
        }

        return (
            <Paper size={1} style={style}>
                <ContestRoundView/>
                <ContestStateView/>
                <StreamStatusView/>
            </Paper>
        )
    }
}
