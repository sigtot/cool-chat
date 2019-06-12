import React from 'react'
import './MessageState.css'

export function MessageState(props) {
  let className = 'MessageState';
  switch (props.msgState) {
    case 0:
      className += ' sent';
      break;
    case 1:
      className += ' recv';
      break;
    case 2:
      className += ' published';
      break
    default:
  }
  return (
    <span className={className}/>
  )
}
