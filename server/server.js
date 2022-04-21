import * as http from 'http';
import WebSocket from 'ws';
import Crypto from 'crypto'
import Protocol, { Message, NavigationRequest, NavigationReply, GameEvent } from "protocol";
import { setInterval } from 'timers'
import Game from './game.js'

class UserConnection {
  user_uuid
  room_id
  socket
  constructor(user_uuid, socket) {
    this.user_uuid = user_uuid
    this.socket = socket
    this.socket.on("message", data=> onUserMessage(user_uuid, data))
  }

  sendReply(msg) {
    sendMessageToUser(this.user_uuid, msg)
  }
}

class Room {
  constructor(id) {
    this.users = []
    this.max_users = 6
    this.game = new Game(onGameEvent(id))
  }

  sendToAll(message) {
    broadcastMessageToUsers(this.users, message)
  }
}

const server = new WebSocket.Server({
    port: Protocol.PORT,
});


function onGameEvent(room_id) {
  return (e)=> {
    console.log(e.event+ " triggered on room#" + room_id)
    getRoom(room_id).sendToAll(e)
    // switch (e.event) {
    //   case GameEvent.GAME_START: {
    //     getRoom(room_id).sendToAll()
    //     break;
    //   }
    // }
  }
}

// state
const activeUsers = {}
const gameRooms = {}


// handle yeah yeah yeah

function onUserMessage(user_id, data) {
  console.log("user " + user_id + " says: \n" + data + "\n")

  var msg = Message.deserialize(data)
  if (msg === undefined)
    return;
  switch (msg.message_type) {
    case Message.NAVIGATION_REQUEST:
      handleNavigationRequest(user_id, msg.request, msg.detail)
      break;
  }
}

function handleNavigationRequest(user_id, request, detail) {
  var user = getUser(user_id)
  switch (request) {
    case NavigationRequest.JOIN_ROOM: {
      let room_id = detail[0]
      let room = getRoom(room_id)

      if (getUserRoomId(user_id) === room_id) {
        user.sendReply(NavigationReply.ALREADY_THERE);
        return;
      }
      // if the room does not exist yet, create it
      if (room === undefined)
        createNewRoom(room_id)
        room = getRoom(room_id)
      console.log(room)
      // attempt to join the room
      if (room.users.length === room.max_users - 1)
        user.sendReply(NavigationReply.ROOM_IS_FULL);
      else {
        user.sendReply(NavigationReply.OK);
        moveUserToRoom(user_id, room_id);
      }
      break;
    }
    case NavigationRequest.START_GAME: {
      let room_id = getUserRoomId(user_id)
      let room = getRoom(room_id)
      let numberOfPlayers = room.users.length
      room.game.start(numberOfPlayers)
    }
  }
}

// events on websocketserver
server.on('connection', socket => {
  const user = new UserConnection(Crypto.randomUUID(), socket)
  activeUsers[user.user_uuid] = user
  console.log('connected');
});

server.on('close', function close() {
  console.log('disconnected');
});

server.on('message', function message(msg) {
  ;
});

function getRoom(room_id) {
  return gameRooms[room_id]
}

function getUser(user_uuid) {
  return activeUsers[user_uuid]
}

function sendMessageToUser(user_uuid, message) {
  console.log("sending msg "+message.serialize()+" to "+user_uuid)
  let user = getUser(user_uuid)
  if (user.socket.readyState == WebSocket.OPEN) {
    user.socket.send(message.serialize())
  }
  else {
    console.log("wtf, socket isn't open....")
  }
}


// send a message to each user in a list of user uuids
function broadcastMessageToUsers(users, message) {
  for (const uuid in activeUsers) {
    sendMessageToUser(uuid, message)
  }
}

// ROOMSn

function getUserRoomId(user_id) {
  return getUser(user_id).room_id
}

function moveUserToRoom(user_id, room_id) {
  let room = getRoom(room_id)
  let user = getUser(user_id)
  room.users.push(user_id)
  user.room_id = room_id
  user.sendReply(new Protocol.UserOnboard(room_id, room.users, room.game.params, room.game.phase))
}

function createNewRoom(room_id) {
  gameRooms[room_id] = new Room(room_id)
}

// =============


// HTTP Server

const serv = http.createServer((req, res) => {
  console.log(req.headers);
  res.end()
}).listen(1337);

let i = 0;
setInterval(()=> {
  // var msg = Protocol.ActionReply.OK;
  // broadcastMessageToUsers(activeUsers, msg);
  // ++i;
}, 3000);
