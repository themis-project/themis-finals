import React from 'react'
import Router, { Route, DefaultRoute, NotFoundRoute, Link, RouteHandler, HistoryLocation } from 'react-router'

import injectTapEventPlugin from 'react-tap-event-plugin'
import mui, { AppBar, Tab, Tabs } from 'material-ui'

import Index from './index'
import Scoreboard from './scoreboard'
import News from './news'
import Logs from './logs'
import NotFound from './not-found'
import ContestState from './contest-state'

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
        let ndx = 0;
        let routeNames = ['index', 'scoreboard', 'news', 'logs']
        for (let i=0; i<routeNames.length; ++i) {
            if (this.context.router.isActive(routeNames[i], '', '')) {
                ndx = i;
                break;
            }
        }

        return (
            <div>
                <AppBar title="VolgaCTF 2015 Finals"/>
                <Tabs initialSelectedIndex={ndx}>
                    <Tab label="Index" route="index" onActive={this.onTabActivate}/>
                    <Tab label="Scoreboard" route="scoreboard" onActive={this.onTabActivate}/>
                    <Tab label="News" route="news" onActive={this.onTabActivate}/>
                    <Tab label="Logs" route="logs" onActive={this.onTabActivate}/>
                </Tabs>
                <ContestState/>
                <main>
                    <RouteHandler/>
                </main>
            </div>
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


let routes = (
    <Route handler={App}>
        <DefaultRoute name="index" handler={Index}/>
        <NotFoundRoute handler={NotFound}/>

        <Route name="scoreboard" handler={Scoreboard}/>
        <Route name="news" handler={News}/>
        <Route name="logs" handler={Logs}/>
    </Route>
)

function render() {
    Router.run(routes, HistoryLocation, (Root) => {
        React.render(<Root/>, document.getElementById('app'))
    })
}

ready(() => {
    dataManager
    .getIdentity()
    .then((identity) => {
        console.log('Identity', identity)
    })
    .catch((err) => {
        console.log('Error', err)
    })

    injectTapEventPlugin()
    render()
})
