import React from 'react';
import './App.css';
import {Chat} from './Chat'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>Cool Chat</p>
        <Chat topic="dogs"/>
      </header>
    </div>
  );
}

export default App;
