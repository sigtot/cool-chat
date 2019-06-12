import React from 'react'

export function RecvMessage(props) {
  return (
    <div>
      <p>{props.text}</p>
      <p>{props.time.toLocaleString()}</p>
      <p>{props.sender}</p>
    </div>
  )
}