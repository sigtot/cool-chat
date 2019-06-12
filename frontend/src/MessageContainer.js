import React from 'react'
import {SentMessage} from './SentMessage'
import {RecvMessage} from './RecvMessage'
import './Chat.css'

export class MessageContainer extends React.Component {
  scrollToBottom = () => {
    this.bottomDiv.scrollIntoView();
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }
  render() {
    return (
      <div className="Chat-message-area">
        {
          this.props.messages.map((message, i) => {
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
        <span ref={el => this.bottomDiv = el}/>
      </div>
    )
  }
}