import React from 'react'
import { Dialog, FlatButton, TextField } from 'material-ui'

import NewsActions from '../actions/news-actions'


export default class PostAddDialogView extends React.Component {
    constructor(props) {
        super(props)

        this.onShow = this.onShow.bind(this)

        this.onOK = this.onOK.bind(this)
        this.onCancel = this.onCancel.bind(this)

        this.onChangeTitle = this.onChangeTitle.bind(this)
        this.onChangeDescription = this.onChangeDescription.bind(this)

        this.state = {
            title: '',
            description: ''
        }
    }

    onCancel() {
        this.refs.dlg.dismiss()
    }

    onOK() {
        NewsActions.add(this.state.title, this.state.description)
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
            title: '',
            description: ''
        })
        this.refs.dlg.show()
    }

    onShow() {
        this.refs.titleField.focus()
    }

    render() {
        let actions = [
              <FlatButton key={1} label="Cancel" secondary={true} onTouchTap={this.onCancel}/>,
              <FlatButton key={2} label="Save" primary={true} onTouchTap={this.onOK}/>
        ]

        let descriptionFieldStyle = {
            minHeight: '100px'
        }

        return (
            <Dialog ref="dlg" title="Add post" actions={actions} modal={true} onShow={this.onShow}>
                <TextField ref="titleField" fullWidth={true} hintText="post title" value={this.state.title} onChange={this.onChangeTitle}/>
                <TextField ref="descriptionField" style={descriptionFieldStyle} fullWidth={true} hintText="post description" multiLine={true} value={this.props.description} onChange={this.onChangeDescription}/>
            </Dialog>
        )
    }
}
