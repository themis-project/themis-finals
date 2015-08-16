import React from 'react'
import DocumentTitle from 'react-document-title'
import { Paper } from 'material-ui'


export default class Logs extends React.Component {
    render() {
        let style = {
            padding: '15px'
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
