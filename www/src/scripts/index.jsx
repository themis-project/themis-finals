import React from 'react'
import Router from 'react-router'

var [ Route, DefaultRoute, NotFoundRoute, Link ] = [
    Router.Route,
    Router.DefaultRoute,
    Router.NotFoundRoute,
    Router.Link
]


class IndexPage extends React.Component {
    render() {
        return (
            <div>
                <h2>Index</h2>
            </div>
        )
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

        <Route name="scoreboard" path="scoreboard" handler={ScoreboardPage}/>
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
    var router = Router.create({
        routes: routes,
        location: Router.HistoryLocation
    })

    router.run((Handler) => {
        React.render(<Handler/>, document.getElementById('main'))
    })
})
