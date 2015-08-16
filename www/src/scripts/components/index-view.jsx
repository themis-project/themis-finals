import React from 'react'
import DocumentTitle from 'react-document-title'
import { Paper } from 'material-ui'


export default class IndexView extends React.Component {
    render() {
        let style = {
            padding: '15px'
        }

        return (
            <DocumentTitle title="Themis Finals :: Main">
                <Paper size={1} style={style}>
                    <h2>Index</h2>
                </Paper>
            </DocumentTitle>
        )
    }
}
