import React from 'react';
import ReactDOM from 'react-dom';

// internal local imports
import { PORT } from "protocol"
import "./index.css";

class App extends React.Component {
  state = {
    tick: 123456789
  }
  constructor(props) {
    super(props)

    const ws = new WebSocket('ws://localhost:' + PORT);
    ws.onmessage = function message(ev) {
      console.log('received: %s', ev.data);
      this.state.tick = ev.data

    };
    ws.onopen = function open() {
      ws.send('something');
    };
  }

  render() {
    return (
      <div>
        Practical Intro To WebSockets {this.state.tick}.
      </div>
    );
  }
}

export default App;


// ===============

ReactDOM.render(
  <App tick="999"/>,
  document.getElementById('root')
);
