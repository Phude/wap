import m from "mithril";
import ServerConnection from "./net.js"
import Protocol, { NavigationRequest, ActionRequest, Message } from "protocol"

function onservermessage(msg) {
  if (msg.message_type == Message.ACTION_REPLY) {
    // handle action reply
  }
  else if (msg.message_type == Message.GAME_EVENT) {
    // handle game event
  }
}

ServerConnection.init(onservermessage)

function joinRoom(room_id=0) {
  ServerConnection.send(NavigationRequest.make.JOIN_ROOM(room_id))
}

var Hello = {
    view: function() {
        return m("main", [
            m("h1", {class: "title"}, "My first app > "),
            m("button", {onclick: ()=>joinRoom(0)}, "Join Room")
        ])
    }
}

m.mount(document.body, Hello)
