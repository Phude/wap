import m from "mithril";
import ServerConnection from "./net.js"
import Protocol, { NavigationRequest, ActionRequest, Message, GameEvent } from "protocol"

var state = {
  latest_error: "",
  room: undefined,
  ents: {},
}

function onservermessage(msg) {
  if (msg.message_type == Message.ACTION_REPLY) {
    // handle action reply
  }
  else if (msg.message_type == Message.GAME_EVENT) {
    if (msg.event === GameEvent.GAME_START) {
      switchToGameView()
    }
    else if (msg.event === GameEvent.ENT_UPDATE) {

    }
  }
  else if (msg.message_type == Message.NAVIGATION_REPLY) {
    state.latest_error = Protocol.NavigationErrorString[msg.errorcode];
    console.log(state.latest_error);
    if (state.latest_error === undefined) {
      state.latest_error = "unknown error";
    }
  }
  else if (msg.message_type == Message.USER_ONBOARD) {
    state.room = {}
    state.room.room_id = msg.room_id
    state.room.users = msg.users
    switchToLobbyView()
  }
  m.redraw()
}

function switchToLobbyView() {
  m.mount(document.body, Lobby)
}

function switchToGameView() {
  m.mount(document.body, Game)
}

function establishGameConnection() {
  ServerConnection.init(onservermessage)
}

function joinRoom() {
  var room_id = document.getElementById("roomCode").value
  ServerConnection.send(NavigationRequest.make.JOIN_ROOM(room_id))
}

function startGame() {
  ServerConnection.send(NavigationRequest.make.START_GAME())
}


var MainMenu = {
  view: function() {
    return m("main", [
      m("h1", {class: "title"}, "Web AutoPets"),
      m("form", {action: "", method: "POST"}, [
        m("label", state.latest_error),
        m("input", {id: "roomCode", type: "text", autofocus: true, autocomplete: "off", placeholder: "Enter game ID"}),
        m("button", {onclick: joinRoom, type: "submit"}, "Join Game"),
      ])
    ])
  }
}

var Lobby = {
  view: function() {
    return m("main", [
      m("h1", "Room: " + state.room.room_id),
      m("ol", LobbyUserList()),
      m("button", {onclick: startGame}, "Start Game"),
    ])
  }
}

var Game = {
  view: function() {
    return m("main", [
      m("div", "welcome to the game!"),
      m("div", JSON.stringify(state.game.ents)),
    ])
  }
}

const LobbyUserList = function() {
  var user_list = []
  for (const user_id of state.room.users) {
    user_list.push(m("li", user_id))
  }
  return user_list
}

m.mount(document.body, MainMenu)
