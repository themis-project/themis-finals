import React from 'react'
import { Card, CardText, CardActions, FlatButton, CardTitle, Paper } from 'material-ui'

import MarkdownRenderer from '../utils/markdown'
import moment from 'moment'
import PostRemoveDialogView from './post-remove-dialog-view'
import PostEditDialogView from './post-edit-dialog-view'


export default class PostView extends React.Component {
    constructor(props) {
        super(props)

        this.onEditDialog = this.onEditDialog.bind(this)
        this.onRemoveDialog = this.onRemoveDialog.bind(this)
    }

    onEditDialog() {
        this.refs.editDialog.start()
    }

    onRemoveDialog() {
        this.refs.removeDialog.start()
    }

    render() {
        let md = new MarkdownRenderer()

        let style = {
            marginBottom: '15px'
        }

        let actions = ''
        if (this.props.identity.isInternal()) {

            actions = (
                <div>
                    <CardActions>
                        <FlatButton label="Edit" onTouchTap={this.onEditDialog}/>
                        <FlatButton label="Remove" onTouchTap={this.onRemoveDialog}/>
                    </CardActions>
                    <PostEditDialogView ref="editDialog" id={this.props.id} title={this.props.title} description={this.props.description}/>
                    <PostRemoveDialogView ref="removeDialog" id={this.props.id} title={this.props.title}/>
                </div>
            )
        }

        return (
            <Card style={style}>
                <CardTitle title={this.props.title}/>
                <CardText dangerouslySetInnerHTML={{__html: md.render(this.props.description)}}/>
                {actions}
                <CardText>
                    Published on {moment(this.props.updatedAt).format('lll')}
                </CardText>
            </Card>
        )
    }
}
