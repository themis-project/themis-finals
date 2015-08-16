import React from 'react'
import DocumentTitle from 'react-document-title'
import { Paper, List, ListItem } from 'material-ui'


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
            padding: '15px'
        }

        let listStyle = {
            maxWidth: '500px'
        }

        return (
            <DocumentTitle title="Themis Finals :: Not Found">
                <Paper size={1} style={style}>
                    <h2>Not Found</h2>
                    <p>This is not the page you are looking for...</p>
                    <Paper size={1} style={listStyle}>
                        <List subheader="Try these">
                            <ListItem primaryText="Main" onClick={this.getOnNavigate('index')}/>
                            <ListItem primaryText="Scoreboard" onClick={this.getOnNavigate('scoreboard')}/>
                            <ListItem primaryText="News" onClick={this.getOnNavigate('news')}/>
                        </List>
                    </Paper>
                </Paper>
            </DocumentTitle>
        )
    }
}
