import WebSocket from 'ws';
import Crypto from 'crypto'
import Protocol, { Message, NavigationRequest, NavigationReply } from "protocol";
import { setInterval } from 'timers'

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
  constructor() {
    this.users = []
    this.max_users = 6
    this.game = {}
  }
}

const server = new WebSocket.Server({
    port: Protocol.PORT,
});


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
    case NavigationRequest.JOIN_ROOM:
      let room_id = detail[0]
      let room = getRoom(room_id)
      if (room === undefined)
        user.sendReply(NavigationReply.ROOM_DOES_NOT_EXIST);
      else if (room.users.length() === room.max_users - 1)
        user.sendReply(NavigationReply.ROOM_IS_FULL);
      else {
        moveUserToRoom(user_id, room_id);
        user.sendReply(NavigationReply.OK);
      }
      break;
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

function getUserRoom(user_id) {
  return getUser(user_id).room_id
}

function moveUserToRoom(user_id, room_id) {
  let room = getRoom(room_id)
  let user = getUser(user_id)
  room.users.push(user_id)
  user.room_id = room_id
}

// =============

let i = 0;
setInterval(()=> {
  // var msg = Protocol.ActionReply.OK;
  // broadcastMessageToUsers(activeUsers, msg);
  // ++i;
}, 3000);
