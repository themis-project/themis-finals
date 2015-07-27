import React from 'react'
import Router from 'react-router'

var [ Route, DefaultRoute, NotFoundRoute, Link, RouteHandler ] = [
    Router.Route,
    Router.DefaultRoute,
    Router.NotFoundRoute,
    Router.Link,
    Router.RouteHandler
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


class App extends React.Component {
    render() {
        return (
            <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
                <header className="mdl-layout__header">
                    <div className="mdl-layout__header-row">
                        <span className="mdl-layout-title">VolgaCTF 2015 Finals</span>
                        <nav className="mdl-navigation mdl-layout--large-screen-only">
                            <Link to="main" className="mdl-navigation__link">Main</Link>
                            <Link to="scoreboard" className="mdl-navigation__link">Scoreboard</Link>
                            <Link to="news" className="mdl-navigation__link">News</Link>
                            <Link to="logs" className="mdl-navigation__link">Logs</Link>
                        </nav>
                    </div>
                </header>

                <main className="mdl-layout__content">
                    <div className="page-content">
                        <RouteHandler/>
                    </div>
                </main>

                <footer className="mdl-mini-footer">
                </footer>
            </div>
        )
    }
}


function ready(callback) {
    if (document.readyState != 'loading') {
        callback();
    } else {
        document.addEventListener('DOMContentLoaded', callback);
    }
}


var routes = (
    <Route handler={App}>
        <DefaultRoute name="main" handler={IndexPage}/>
        <NotFoundRoute handler={NotFoundPage} />

        <Route name="scoreboard" path="scoreboard" handler={ScoreboardPage}/>
        <Route name="news" path="news" handler={NewsPage}/>
        <Route name="logs" path="logs" handler={LogsPage}/>
    </Route>
)


var router = Router.create({
    routes: routes,
    location: Router.HistoryLocation
})

function render() {
    router.run((Root) => {
        React.render(<Root/>, document.getElementById('app'))
    })
}

render()
