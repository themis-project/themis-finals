import React from 'react'
import { Card, CardText, CardActions, FlatButton, CardTitle, Paper, Dialog } from 'material-ui'

import MarkdownRenderer from '../utils/markdown'
import moment from 'moment'
import NewsActions from '../actions/news-actions'


export default class PostView extends React.Component {
    constructor(props) {
        super(props)

        this.handleDeleteDialogShow = this.handleDeleteDialogShow.bind(this)
        this.handleDeleteDialogCancel = this.handleDeleteDialogCancel.bind(this)
        this.handleDeleteDialogOk = this.handleDeleteDialogOk.bind(this)
    }

    handleDeleteDialogShow() {
        this.refs.deleteDialog.show()
    }

    handleDeleteDialogCancel() {
        this.refs.deleteDialog.dismiss()
    }

    handleDeleteDialogOk() {
        NewsActions.remove(this.props.id)
        this.refs.deleteDialog.dismiss()
    }

    render() {
        let md = new MarkdownRenderer()

        let style = {
            marginBottom: '15px'
        }

        let actions = ''
        if (this.props.identity.isInternal()) {
            let deleteDialogActions = [
                  <FlatButton key={1} label="No" secondary={true} onTouchTap={this.handleDeleteDialogCancel}/>,
                  <FlatButton key={2} label="Yes" primary={true} onTouchTap={this.handleDeleteDialogOk}/>
            ]

            actions = (
                <div>
                    <CardActions>
                        <FlatButton label="Edit"/>
                        <FlatButton label="Delete" onTouchTap={this.handleDeleteDialogShow}/>
                    </CardActions>
                    <Dialog ref="deleteDialog" title="Delete post" actions={deleteDialogActions} modal={true}>
                        <p>Do you really want to delete post <i>{this.props.title}</i>?</p>
                    </Dialog>
                </div>
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
