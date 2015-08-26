import React from 'react'
import DocumentTitle from 'react-document-title'
import { RaisedButton, Paper, Styles } from 'material-ui'

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
            paddingTop: '15px',
            paddingBottom: '15px',
            paddingLeft: Styles.Spacing.desktopGutter,
            paddingRight: Styles.Spacing.desktopGutter
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
                            if (this.state.loading) {
                                return <p>Loading</p>
                            }

                            if (this.state.err) {
                                return <p>Failed to fetch posts</p>
                            }

                            if (this.state.collection.isEmpty()) {
                                return <p>No posts yet</p>
                            } else {
                                let sortedPosts = this.state.collection.sortBy(x => x.updatedAt.getTime()).reverse()
                                return <PostListView posts={sortedPosts} identity={this.props.identity}/>
                            }
                        })()
                    }
                </Paper>
            </DocumentTitle>
        )
    }
}
