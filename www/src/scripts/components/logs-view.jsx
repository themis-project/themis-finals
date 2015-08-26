import React from 'react'
import DocumentTitle from 'react-document-title'
import { Paper, Styles } from 'material-ui'


export default class LogsView extends React.Component {
    render() {
        let style = {
            paddingTop: '15px',
            paddingBottom: '15px',
            paddingLeft: Styles.Spacing.desktopGutter,
            paddingRight: Styles.Spacing.desktopGutter
        }

        return (
            <DocumentTitle title="Themis Finals :: Logs">
                <Paper size={1} style={style}>
                    <h2>Logs</h2>
                </Paper>
            </DocumentTitle>
        )
    }
}
