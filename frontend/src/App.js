import React from 'react';
import './App.css';
import {Chat} from './Chat'

function App() {
  return (
    <div className="App">
      <div className="App-main-container">
        <Chat className="App-chat" topic="dogs" senderName="memerboi"/>
      </div>
    </div>
  );
}

export default App;
