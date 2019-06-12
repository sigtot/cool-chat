import React from 'react'
import './Message.css'
import {MessageState} from './MessageState'

export function SentMessage(props) {
  return (
    <div className="Message Message-sent">
      <div className="Message-row">
        <span className="Message-bubble">
          <p>{props.text}</p>
        </span>
      </div>
      <p className="Message-time">
        <span>{props.time.toLocaleTimeString('nb-NO').slice(0, -3)}</span>
        <MessageState msgState={props.msgState}/>
      </p>
    </div>
  )
}
