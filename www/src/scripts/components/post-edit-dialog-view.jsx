import React from 'react'
import { Dialog, FlatButton, TextField, Card, CardTitle, CardText } from 'material-ui'

import NewsActions from '../actions/news-actions'
import MarkdownRenderer from '../utils/markdown'
import moment from 'moment'


export default class PostEditDialogView extends React.Component {
    constructor(props) {
        super(props)

        this.onShow = this.onShow.bind(this)

        this.onOK = this.onOK.bind(this)
        this.onCancel = this.onCancel.bind(this)

        this.onChangeTitle = this.onChangeTitle.bind(this)
        this.onChangeDescription = this.onChangeDescription.bind(this)

        this.state = {
            title: this.props.title,
            description: this.props.description
        }
    }

    onCancel() {
        this.refs.dlg.dismiss()
    }

    onOK() {
        NewsActions.edit(this.props.id, this.state.title, this.state.description)
        this.refs.dlg.dismiss()
    }

    onChangeTitle() {
        this.setState({
            title: this.refs.titleField.getValue()
        })
    }

    onChangeDescription() {
        this.setState({
            description: this.refs.descriptionField.getValue()
        })
    }

    start() {
        this.setState({
            title: this.props.title,
            description: this.props.description
        })
        this.refs.dlg.show()
    }

    onShow() {
        this.refs.titleField.focus()
    }

    render() {
        let actions = [
              <FlatButton key={1} label="Cancel" secondary={true} onTouchTap={this.onCancel}/>,
              <FlatButton key={2} label="Update" primary={true} onTouchTap={this.onOK}/>
        ]

        let descriptionFieldStyle = {
            minHeight: '100px'
        }

        let md = new MarkdownRenderer()

        let containerStyle = {
            display: 'flex'
        }

        let formStyle = {
            width: '50%',
            paddingRight: '10px'
        }

        let previewStyle = {
            width: '50%'
        }

        return (
            <Dialog ref="dlg" title="Edit post" actions={actions} modal={false} onShow={this.onShow}>
                <div style={containerStyle}>
                    <div style={formStyle}>
                        <TextField ref="titleField" fullWidth={true} hintText="post title" value={this.state.title} onChange={this.onChangeTitle}/>
                        <TextField ref="descriptionField" style={descriptionFieldStyle} fullWidth={true} hintText="post description" multiLine={true} value={this.state.description} onChange={this.onChangeDescription}/>
                    </div>
                    <Card style={previewStyle}>
                        <CardTitle title={this.state.title}/>
                        <CardText className="themis-post" dangerouslySetInnerHTML={{__html: md.render(this.state.description)}}/>
                    </Card>
                </div>
            </Dialog>
        )
    }
}
