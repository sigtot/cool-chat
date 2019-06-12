import React from 'react';
import './App.css';
import {Chat} from './Chat'

class App extends React.Component {
  state = {
    showChat: false,
    topic: '',
    senderName: '',
  }

  joinChat = (event) => {
    event.preventDefault();
    this.setState({
      showChat: true,
    });
  }

  onTopicChange = event => {
    this.setState({
      topic: event.target.value
    });
  }

  onSenderNameChange = event => {
    this.setState({
      senderName: event.target.value
    });
  }

  render() {
    let contents = undefined;

    if (this.state.showChat) {
      console.log("what");
      contents = (<Chat className="App-chat" topic={this.state.topic}
                        senderName={this.state.senderName}/>)
    }
    else {
      contents = (
        <div className="App-join-container">
          <form onSubmit={this.joinChat} action="">
            <label>Topic</label>
            <input type="text" value={this.state.topic}
                   onChange={this.onTopicChange}
                   placeholder="E.g. React"/>

            <label>Nickname</label>
            <input type="text" value={this.state.senderName}
                   name="senderName" onChange={this.onSenderNameChange}
                   placeholder="E.g. Nick"/>

            <button className="App-join-button"
                    disabled={this.state.topic === '' || this.state.senderName === ''}
                    type="submit">Join {this.state.topic}</button>
          </form>
        </div>
      )
    }

    return (
      <div className="App">
        <div className="App-main-container">
          {contents}
        </div>
      </div>
    );
  }
}

export default App;
