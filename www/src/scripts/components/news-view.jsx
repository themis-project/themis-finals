import React from 'react'
import DocumentTitle from 'react-document-title'
import { RaisedButton, Paper } from 'material-ui'

import PostListView from './post-list-view'
import NewsStore from '../stores/news-store'
import NewsActions from '../actions/news-actions'


export default class NewsView extends React.Component {
    constructor(props) {
        super(props)
        this.state = NewsStore.getState()
        this.onUpdate = this.onUpdate.bind(this)
    }

    componentDidMount() {
        NewsStore.listen(this.onUpdate)
        NewsActions.fetch()
    }

    componentWillUnmount() {
        NewsStore.unlisten(this.onUpdate)
    }

    onUpdate(state) {
        this.setState(state)
    }

    render() {
        let style = {
            padding: '15px'
        }

        let buttonStyle = {
            marginBottom: '10px'
        }

        return (
            <DocumentTitle title="Themis Finals :: News">
                <Paper size={1} style={style}>
                    <h2>News</h2>
                    {this.props.identity.isInternal() ? <RaisedButton style={buttonStyle} label="Create" primary={true} />: ''}
                    {
                        (() => {
                            if (this.state.loaded) {
                                if (this.state.posts.length === 0) {
                                    return <p>No posts yet</p>
                                } else {
                                    return <PostListView posts={this.state.posts} identity={this.props.identity}/>
                                }
                            } else {
                                return <p>Loading</p>
                            }
                        })()
                    }
                </Paper>
            </DocumentTitle>
        )
    }
}
