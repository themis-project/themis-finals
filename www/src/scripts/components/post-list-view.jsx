import React from 'react'

import PostView from './post-view'


export default class PostListView extends React.Component {
    render() {
        let postViewNodes = this.props.posts.map((post) => {
            return (
                <PostView key={post.id} id={post.id} title={post.title} description={post.description} updatedAt={post.updatedAt} identity={this.props.identity}/>
            )
        })
        return (
            <div>
                {postViewNodes}
            </div>
        )
    }
}
