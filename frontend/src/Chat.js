import React from 'react'
import spinner from './spinner.svg'
import './Chat.css'

export class Chat extends React.Component {
  state = {
    messageText: '',
    socket: undefined,
    connected: false,
    clientMsgId: 1,
    shiftIsDown: false,
  };

  componentDidMount() {
    let socket = new WebSocket("ws://localhost:9000/" + this.props.topic);
    socket.onopen = () => {
      this.setState({
        socket: socket,
        connected: true,
      });
    };
    socket.onmessage = (event) => {
      console.log("Message from server: ", event.data);
    };
  }

  onMessageTextChange = event => {
    this.setState({
      messageText: event.target.value
    });
  }

  sendIfNotEmpty = event => {
    event.preventDefault();
    if (this.state.messageText === '') return
    this.setState({
      clientMsgId: this.state.clientMsgId + 1
    }, () => {
      this.state.socket.send(JSON.stringify({
        clientMsgId: this.state.clientMsgId,
        message: this.state.messageText,
        sender: 'its me lol',
      }))
      this.setState({
        messageText: '',
        clientMsgId: this.state.clientMsgId + 1,
      })
    })
  }

  textAreaKeyDown = event => {
    if (event.key === "Shift") {
      this.setState({
        shiftIsDown: true
      });
    }
    if (event.key === "Enter" && !this.state.shiftIsDown) {
      this.sendIfNotEmpty(event)
    }
  }

  textAreaKeyUp = event => {
    if (event.key === "Shift") {
      this.setState({
        shiftIsDown: false
      });
    }
  }

  render () {
    return (
      <div>
        <img src={spinner}
             className={`center-spinner ${this.state.connected ? 'hidden' : ''}`}
             alt="loading"/>
        <form onSubmit={this.sendIfNotEmpty}>
          <textarea name="messageText"
                    value={this.state.messageText}
                    onKeyDown={this.textAreaKeyDown}
                    onKeyUp={this.textAreaKeyUp}
                    onChange={this.onMessageTextChange} />
          <input type="submit" value="Send"/>
        </form>
      </div>
    )
  }
}
