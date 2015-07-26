import React from 'react'
import Router from 'react-router'

var [ Route, DefaultRoute, NotFoundRoute ] = [
    Router.Route,
    Router.DefaultRoute,
    Router.NotFoundRoute
]


class IndexPage extends React.Component {
    render() {
        return <h2>Index</h2>
    }
}


class ScoreboardPage extends React.Component {
    render() {
        return <h2>Scoreboard</h2>
    }
}


class NewsPage extends React.Component {
    render() {
        return <h2>News</h2>
    }
}


class LogsPage extends React.Component {
    render() {
        return <h2>Logs</h2>
    }
}


class NotFoundPage extends React.Component {
    render() {
        return <h2>Not Found</h2>
    }
}

var routes = (
    <Route handler={App}>
        <DefaultRoute handler={IndexPage}/>
        <NotFoundRoute handler={NotFoundPage} />

        <Route path="scoreboard" handler={ScoreboardPage}/>
        <Route path="news" handler={NewsPage}/>
        <Route path="logs" handler={LogsPage}/>
    </Route>
)


class App extends React.Component {
    render() {
        return <RouteHandler/>
    }
}


function ready(callback) {
    if (document.readyState != 'loading') {
        callback();
    } else {
        document.addEventListener('DOMContentLoaded', callback);
    }
}


ready(() => {
    Router.run(routes, Router.HistoryLocation, (Handler) => {
        React.render(<Handler/>, document.getElementById('main'))
    })
})
