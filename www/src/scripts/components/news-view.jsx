import React from 'react'
import DocumentTitle from 'react-document-title'
import { RaisedButton, Paper } from 'material-ui'

import dataManager from '../data-manager'
import PostListView from './post-list-view'


export default class NewsView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            posts: []
        }
    }

    componentDidMount() {
        dataManager
        .getPosts()
        .then((posts) => {
            this.setState({
                loaded: true,
                posts: posts
            })
        })
        .catch((err) => {
            console.log('Error', err)
        })
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
                                return <PostListView posts={this.state.posts} identity={this.props.identity}/>
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
