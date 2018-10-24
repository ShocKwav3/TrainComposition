import React, { Component }from 'react'
import Dialog from 'material-ui/Dialog'
import { FlatButton } from 'material-ui'


class DialogPrompt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openDialog: false,
    };
  }

  componentDidMount = () => {
    const {props} = this
    this.setState({
      openDialog: props.openDialog,
    })
  }

  componentWillReceiveProps = (newProps) => {
    this.setState({
      openDialog: newProps.openDialog,
    })
  }

  dialogClose = () => {
    const {props} = this
    this.setState({
      openDialog: false
    })
    
    props.closeDialog()
  }

  dialogActions = [
    <FlatButton label="Close"
                primary={true}
                onTouchTap={this.dialogClose}
                keyboardFocused={true} />
  ]

  render() {
    const {state, props, dialogClose, dialogActions} = this

    return(
      <Dialog title={props.title}
              actions={dialogActions}
              modal={false}
              open={state.openDialog}
              onRequestClose={dialogClose}>
        { props.toShow }
      </Dialog>
    )
  }
}

export default DialogPrompt