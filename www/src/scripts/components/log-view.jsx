import React from 'react'
import { Styles } from 'material-ui'

import MarkdownRenderer from '../utils/markdown'
import moment from 'moment'


export default class LogView extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let md = new MarkdownRenderer()

        let text = ''
        switch (this.props.type) {
            case 1:
                let status = null
                switch (this.props.params.value) {
                    case 0:
                        status = 'initial'
                        break
                    case 1:
                        status = 'await_start'
                        break
                    case 2:
                        status = 'running'
                        break
                    case 3:
                        status = 'paused'
                        break
                    case 4:
                        status = 'await_complete'
                        break
                    case 5:
                        status = 'completed'
                        break
                    default:
                        status = 'n/a'
                        break
                }

                text = <span style={{color: Styles.Colors.blue900}}>Contest state changed to <code style={{color: Styles.Colors.cyan900}}>{status}</code></span>
                break
            case 2:
                text = <span style={{color: Styles.Colors.purple900}}>Round <code style={{color: Styles.Colors.red900}}>{this.props.params.value}</code> has started!</span>
                break
            case 3:
                let team = this.props.teams.find(x => x.id === this.props.params.team_id)
                let service = this.props.services.find(x => x.id === this.props.params.service_id)
                if (team != null && service != null) {
                    let style = {
                        color: Styles.Colors.grey600
                    }

                    let status = null

                    switch (this.props.params.state) {
                        case 1:
                            status = 'up'
                            style.color = Styles.Colors.green700
                            break
                        case 2:
                            status = 'down'
                            style.color = Styles.Colors.red600
                            break
                        case 3:
                            status = 'corrupt'
                            style.color = Styles.Colors.deepOrange500
                            break
                        case 4:
                            status = 'mumble'
                            style.color = Styles.Colors.brown600
                            break
                        case 5:
                            status = 'internal_error'
                            style.color = Styles.Colors.grey600
                            break
                        default:
                            status = 'n/a'
                            style.color = Styles.Colors.grey600
                            break
                    }

                    text = <span style={{color: Styles.Colors.brown900}}>Team <code style={{color: Styles.Colors.teal900}}>{team.name}</code>, service <code style={{color: Styles.Colors.pink900}}>{service.name}</code> state is <code style={style}>{status}</code></span>
                }
                break
            case 4:
                let attackTeam = this.props.teams.find(x => x.id === this.props.params.attack_team_id)
                let victimTeam = this.props.teams.find(x => x.id === this.props.params.victim_team_id)
                let attackedService = this.props.services.find(x => x.id === this.props.params.service_id)
                if (attackTeam != null && victimTeam != null && attackedService != null) {
                    text = <span style={{color: Styles.Colors.green900}}>Team <code style={{color: Styles.Colors.lightBlue900}}>{attackTeam.name}</code> has attacked team <code style={{color: Styles.Colors.lightBlue900}}>{victimTeam.name}</code>, service <code style={{color: Styles.Colors.pink900}}>{attackedService.name}</code>!</span>
                }
                break
            default:
                break
        }

        return (
            <div>
                <code>{moment(this.props.updatedAt).format('LTS')}</code>
                &nbsp;&nbsp;
                {text}
            </div>
        )
    }
}
