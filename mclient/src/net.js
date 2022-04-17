import Protocol, { Message } from "protocol"

var ws
var messageCallback

function init(callback) {
  ws = new WebSocket('ws://localhost:' + Protocol.PORT);
  messageCallback = callback

  ws.onmessage = function message(ev) {
    console.log('received: %s', ev.data);
    var msg = Message.deserialize(ev.data)
    if (msg === undefined)
      return
    messageCallback(msg)
  };

  ws.onopen = function open() {
    ws.send('something');
  };
}

function send(msg) {
  ws.send(msg.serialize())
}

export default {
  init: init,
  send: send,
}
