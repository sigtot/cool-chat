import React from 'react'
import './Message.css'

export function SentMessage(props) {
  return (
    <div className="Message Message-sent">
      <div className="Message-row">
        <span className="Message-bubble">
          <p>{props.text}</p>
          <span className="Message-state">{props.msgState}</span>
        </span>
      </div>
      <p className="Message-time">
        {props.time.toLocaleTimeString('nb-NO').slice(0, -3)}
        </p>
    </div>
  )
}
