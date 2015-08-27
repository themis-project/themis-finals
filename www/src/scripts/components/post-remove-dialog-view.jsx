import React from 'react'
import { Dialog, FlatButton } from 'material-ui'

import NewsActions from '../actions/news-actions'


export default class PostRemoveDialogView extends React.Component {
    constructor(props) {
        super(props)

        this.onOK = this.onOK.bind(this)
        this.onCancel = this.onCancel.bind(this)
    }

    onCancel() {
        this.refs.dlg.dismiss()
    }

    onOK() {
        NewsActions.remove(this.props.id)
        this.refs.dlg.dismiss()
    }

    start() {
        this.refs.dlg.show()
    }

    render() {
        let actions = [
              <FlatButton key={1} label="No" secondary={true} onTouchTap={this.onCancel}/>,
              <FlatButton key={2} label="Yes" primary={true} onTouchTap={this.onOK}/>
        ]

        return (
            <Dialog ref="dlg" title="Remove post" actions={actions} modal={false}>
                <p>Do you really want to remove post <i>{this.props.title}</i>?</p>
            </Dialog>
        )
    }
}
