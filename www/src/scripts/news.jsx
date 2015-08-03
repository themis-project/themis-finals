import React from 'react'
import dataManager from './data-manager'


export default class News extends React.Component {
    componentDidMount() {
        dataManager
        .getPosts()
        .then((posts) => {
            console.log('Posts', posts)
        })
        .catch((err) => {
            console.log('Error', err)
        })
    }

    render() {
        return <h2>News</h2>
    }
}
