import 'babel/polyfill'
import React from 'react'
import Router, { Route, DefaultRoute, NotFoundRoute, Link, RouteHandler, HistoryLocation } from 'react-router'
import DocumentTitle from 'react-document-title'
import injectTapEventPlugin from 'react-tap-event-plugin'
import mui, { AppBar, Tab, Tabs } from 'material-ui'

import IndexView from './components/index-view'
import ScoreboardView from './components/scoreboard-view'
import NewsView from './components/news-view'
import LogsView from './components/logs-view'
import NotFoundView from './components/not-found-view'
import ContestStateView from './components/contest-state-view'

import dataManager from './data-manager'


let ThemeManager = new mui.Styles.ThemeManager()

class App extends React.Component {
    constructor() {
        super()
        this.onTabActivate = this.onTabActivate.bind(this)
    }

    static get contextTypes() {
        return {
            router: React.PropTypes.func
        }
    }

    static get childContextTypes() {
        return {
            muiTheme: React.PropTypes.object
        }
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        }
    }

    onTabActivate(activeTab) {
        this.context.router.transitionTo(activeTab.props.route)
    }

    render() {
        let ndx = null
        let routeNames = ['index', 'scoreboard', 'news']
        if (this.props.identity.isInternal()) {
            routeNames.push('logs')
        }

        for (let i=0; i<routeNames.length; ++i) {
            if (this.context.router.isActive(routeNames[i], '', '')) {
                ndx = i
                break
            }
        }

        let tabContainer = ''

        if (ndx != null) {
            let tabs = [
                <Tab key="index" label="Index" route="index" onActive={this.onTabActivate}/>,
                <Tab key="scoreboard" label="Scoreboard" route="scoreboard" onActive={this.onTabActivate}/>,
                <Tab key="news" label="News" route="news" onActive={this.onTabActivate}/>
            ]

            if (this.props.identity.isInternal()) {
                tabs.push(<Tab key="logs" label="Logs" route="logs" onActive={this.onTabActivate}/>)
            }

            tabContainer = (
                <Tabs initialSelectedIndex={ndx}>
                    {tabs}
                </Tabs>
            )
        }

        return (
            <DocumentTitle title="Themis Finals">
                <section>
                    <AppBar title="Themis Finals"/>
                    {tabContainer}
                    <ContestStateView/>
                    <main>
                        <RouteHandler identity={this.props.identity}/>
                    </main>
                </section>
            </DocumentTitle>
        )
    }
}


function ready(callback) {
    if (document.readyState != 'loading') {
        callback()
    } else {
        document.addEventListener('DOMContentLoaded', callback)
    }
}


function getRoutes(identity) {
    return (
        <Route handler={App}>
            <DefaultRoute name="index" handler={IndexView}/>
            <NotFoundRoute handler={NotFoundView}/>

            <Route name="scoreboard" handler={ScoreboardView}/>
            <Route name="news" handler={NewsView}/>
            <Route name="logs" handler={identity.isInternal() ? LogsView : NotFoundView}/>
        </Route>
    )
}


function render(identity) {
    Router.run(getRoutes(identity), HistoryLocation, (Root) => {
        React.render(<Root identity={identity}/>, document.getElementById('app'))
    })
}

ready(() => {
    dataManager
    .getIdentity()
    .then((identity) => {
        injectTapEventPlugin()
        render(identity)
    })
    .catch((err) => {
        console.log('Error', err)
    })
})
