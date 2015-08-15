import React from 'react'
import Router, { Route, DefaultRoute, NotFoundRoute, Link, RouteHandler, HistoryLocation } from 'react-router'
import DocumentTitle from 'react-document-title'
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
        let ndx = null;
        let routeNames = ['index', 'scoreboard', 'news']
        if (this.props.identity.isInternal()) {
            routeNames.push('logs')
        }

        for (let i=0; i<routeNames.length; ++i) {
            if (this.context.router.isActive(routeNames[i], '', '')) {
                ndx = i;
                break;
            }
        }

        let tabs = [
            <Tab key="index" label="Index" route="index" onActive={this.onTabActivate}/>,
            <Tab key="scoreboard" label="Scoreboard" route="scoreboard" onActive={this.onTabActivate}/>,
            <Tab key="news" label="News" route="news" onActive={this.onTabActivate}/>
        ]

        if (this.props.identity.isInternal()) {
            tabs.push(<Tab key="logs" label="Logs" route="logs" onActive={this.onTabActivate}/>)
        }

        return (
            <DocumentTitle title="Themis Finals">
                <section>
                    <AppBar title="Themis Finals"/>
                    <Tabs initialSelectedIndex={ndx}>
                        {tabs}
                    </Tabs>
                    <ContestState/>
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
            <DefaultRoute name="index" handler={Index}/>
            <NotFoundRoute handler={NotFound}/>

            <Route name="scoreboard" handler={Scoreboard}/>
            <Route name="news" handler={News}/>
            <Route name="logs" handler={identity.isInternal() ? Logs : NotFound}/>
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
