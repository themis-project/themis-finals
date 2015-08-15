import React from 'react'
import DocumentTitle from 'react-document-title'
import dataManager from './data-manager'
import MarkdownRenderer from './utils/markdown'
import moment from 'moment'


class Article extends React.Component {
    render() {
        let md = new MarkdownRenderer()

        return (
            <article data-themis-id={this.props.id}>
                <header>
                    <h1>{this.props.title}</h1>
                </header>
                <main dangerouslySetInnerHTML={{__html: md.render(this.props.children)}}/>
                <footer>
                    Published on {moment(this.props.updatedAt).format('lll')}
                </footer>
            </article>
        )
    }
}


class ArticleList extends React.Component {
    render() {
        let articleNodes = this.props.posts.map((post) => {
            return (
                <Article key={post.id} id={post.id} title={post.title} updatedAt={post.updatedAt}>
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
        return (
            <DocumentTitle title="Themis Finals :: News">
                <section>
                    <h2>News</h2>
                    {
                        (() => {
                            if (this.state.loaded) {
                                return <ArticleList posts={this.state.posts}/>
                            } else {
                                return <p>Loading</p>
                            }
                        })()
                    }
                </section>
            </DocumentTitle>
        )
    }
}
