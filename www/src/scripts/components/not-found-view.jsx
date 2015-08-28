import React from 'react'
import DocumentTitle from 'react-document-title'
import { Paper, List, ListItem, Styles } from 'material-ui'


export default class NotFoundView extends React.Component {
    constructor(props) {
        super(props)
        this.getOnNavigate = this.getOnNavigate.bind(this)
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.func
        }
    }

    getOnNavigate(route) {
        return () => {
            this.context.router.transitionTo(route)
        }.bind(this)
    }

    render() {
        let style = {
            paddingTop: '15px',
            paddingBottom: '15px',
            paddingLeft: Styles.Spacing.desktopGutter,
            paddingRight: Styles.Spacing.desktopGutter
        }

        let listStyle = {
            listStyleType: 'none',
            paddingLeft: '0',
            lineHeight: '1.5em'
        }

        let links = [
            <li key={0}><a href="/" onTouchTap={this.getOnNavigate('index')}>Main page</a></li>,
            <li key={1}><a href="/scoreboard" onTouchTap={this.getOnNavigate('scoreboard')}>Scoreboard</a></li>,
            <li key={2}><a href="/news" onTouchTap={this.getOnNavigate('news')}>News</a></li>
        ]

        if (this.props.identity.isInternal()) {
            links.push(<li key={3}><a href="/logs" onTouchTap={this.getOnNavigate('logs')}>Logs</a></li>)
        }

        return (
            <DocumentTitle title="Themis Finals :: Not Found">
                <Paper size={1} style={style}>
                    <h2>Not Found</h2>
                    <p>This is not the page you are looking for...</p>
                    <p>Try these:</p>
                    <ul style={listStyle}>
                        {links}
                    </ul>
                </Paper>
            </DocumentTitle>
        )
    }
}
