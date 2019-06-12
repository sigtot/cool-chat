import React from 'react'
import './Message.css'

export function RecvMessage(props) {
  return (
    <div className="Message">
      <p className="Message-sender">{props.sender}</p>
      <div className="Message-row">
        <span className="Message-bubble">
          <div>{props.text}</div>
        </span>
      </div>
      <p className="Message-time">
        {props.time.toLocaleTimeString('nb-NO').slice(0, -3)}
      </p>
    </div>
  )
}