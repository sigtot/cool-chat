import React from 'react'
import spinner from './spinner.svg'
import './Chat.css'
import {SentMessage} from './SentMessage'
import {RecvMessage} from './RecvMessage'

const MSG_STATE_SENT_TO_SERVER = 0;
const MSG_STATE_RECV_BY_SERVER = 1;
const MSG_STATE_SENT_TO_PUBLISHERS = 2;

export class Chat extends React.Component {
  state = {
    messageText: '',
    socket: undefined,
    connected: false,
    clientMsgId: 1,
    shiftIsDown: false,
    messages: [],
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
      let msg = JSON.parse(event.data)
      if (msg.type === "recvAck") {
        this.updateMessageState(msg.clientMsgId, MSG_STATE_RECV_BY_SERVER)
      } else if (msg.type === "message") {
        if (msg.sender === this.props.senderName) {
          this.updateMessageState(msg.clientMsgId, MSG_STATE_SENT_TO_PUBLISHERS)
        } else {
          this.setState(prevState => ({
            messages: [...prevState.messages, {
              text: msg.message,
              sender: msg.sender,
              type: msg.type,
              clientMsgId: msg.clientMsgId,
              time: new Date(),
            }]
          }))
        }
      }
    };
  }

  updateMessageState(clientMsgId, state) {
    this.setState(prevState => ({
      messages: prevState.messages.map(message => {
        if (message.sender === this.props.senderName &&
          message.clientMsgId === clientMsgId) {
          message.msgState = state;
        }
        return message
      })
    }))
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
        sender: this.props.senderName,
      }))
      this.setState(prevState => ({
        messageText: '',
        clientMsgId: prevState.clientMsgId + 1,
        messages: [...prevState.messages, {
          text: prevState.messageText,
          time: new Date(),
          msgState: MSG_STATE_SENT_TO_SERVER,
          sender: this.props.senderName,
          clientMsgId: prevState.clientMsgId,
        }]
      }))
    })
  }

  textAreaKeyDown = event => {
    if (event.key === "Shift") {
      this.setState({
        shiftIsDown: true
      });
    } else if (event.key === "Enter" && !this.state.shiftIsDown) {
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
        <div>
          {
            this.state.messages.map((message, i) => {
              if (message.sender === this.props.senderName) {
                return <SentMessage
                  text={message.text}
                  time={message.time}
                  msgState={message.msgState}
                  key={i}
                />
              } else {
                return <RecvMessage
                  text={message.text}
                  time={message.time}
                  sender={message.sender}
                  key={i}
                />
              }
            })
          }
        </div>
        <form onSubmit={this.sendIfNotEmpty}>
          <textarea name="messageText"
                    value={this.state.messageText}
                    onKeyDown={this.textAreaKeyDown}
                    onKeyUp={this.textAreaKeyUp}
                    onChange={this.onMessageTextChange} />
          <input type="submit" value="Send"/>
        </form>
        <img src={spinner}
             className={`center-spinner ${this.state.connected ? 'hidden' : ''}`}
             alt="loading"/>
      </div>
    )
  }
}
