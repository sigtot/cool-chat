import React from 'react'

export function SentMessage(props) {
  return (
    <div>
      <p>{props.text}</p>
      <p>{props.time.toLocaleString()}</p>
      <p>{props.msgState}</p>
    </div>
  )
}
