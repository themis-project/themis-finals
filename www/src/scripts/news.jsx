import React from 'react'
import DocumentTitle from 'react-document-title'
import { RaisedButton, Card, CardText, CardActions, FlatButton, CardTitle, Paper } from 'material-ui'

import dataManager from './data-manager'
import MarkdownRenderer from './utils/markdown'
import moment from 'moment'


class Article extends React.Component {
    render() {
        let md = new MarkdownRenderer()

        let style = {
            marginBottom: '15px'
        }

        let actions = '';
        if (this.props.identity.isInternal()) {
            actions = (
                <CardActions>
                    <FlatButton label="Edit"/>
                    <FlatButton label="Delete"/>
                </CardActions>
            )
        }

        return (
            <Card style={style}>
                <CardTitle title={this.props.title}/>
                <CardText dangerouslySetInnerHTML={{__html: md.render(this.props.children)}}/>
                {actions}
                <CardText>
                    Published on {moment(this.props.updatedAt).format('lll')}
                </CardText>
            </Card>
        )
    }
}


class ArticleList extends React.Component {
    render() {
        let articleNodes = this.props.posts.map((post) => {
            return (
                <Article key={post.id} id={post.id} title={post.title} updatedAt={post.updatedAt} identity={this.props.identity}>
                    {post.description}
                </Article>
            )
        })
        return (
            <div>
                {articleNodes}
            </div>
        )
    }
}


export default class News extends React.Component {
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
                                return <ArticleList posts={this.state.posts} identity={this.props.identity}/>
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
