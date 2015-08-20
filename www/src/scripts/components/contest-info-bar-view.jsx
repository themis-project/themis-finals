import React from 'react'
import { Paper } from 'material-ui'

import ContestRoundView from './contest-round-view'
import ContestStateView from './contest-state-view'


export default class ContestInfoBarView extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let style = {
            padding: '15px'
        }

        return (
            <Paper size={1} style={style}>
                <ContestRoundView/>
                <ContestStateView/>
            </Paper>
        )
    }
}
