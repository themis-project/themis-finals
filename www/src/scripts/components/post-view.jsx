import React from 'react'
import { Card, CardText, CardActions, FlatButton, CardTitle, Paper } from 'material-ui'

import MarkdownRenderer from '../utils/markdown'
import moment from 'moment'


export default class PostView extends React.Component {
    render() {
        let md = new MarkdownRenderer()

        let style = {
            marginBottom: '15px'
        }

        let actions = '';
        if (this.props.identity.isInternal()) {
            actions = (
                <CardActions>
                    <FlatButton label="Edit"/>
                    <FlatButton label="Delete"/>
                </CardActions>
            )
        }

        return (
            <Card style={style}>
                <CardTitle title={this.props.title}/>
                <CardText dangerouslySetInnerHTML={{__html: md.render(this.props.children)}}/>
                {actions}
                <CardText>
                    Published on {moment(this.props.updatedAt).format('lll')}
                </CardText>
            </Card>
        )
    }
}
