import React from 'react'
import DocumentTitle from 'react-document-title'
import { Paper, Styles } from 'material-ui'


export default class IndexView extends React.Component {
    render() {
        let style = {
            paddingTop: '15px',
            paddingBottom: '15px',
            paddingLeft: Styles.Spacing.desktopGutter,
            paddingRight: Styles.Spacing.desktopGutter
        }

        return (
            <DocumentTitle title="Themis Finals :: Main">
                <Paper zDepth={0} style={style}>
                    <h2>Index</h2>
                </Paper>
            </DocumentTitle>
        )
    }
}
