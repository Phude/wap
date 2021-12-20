// base class for messages
export class Message {
  static GAME_EVENT = "game_event"
  static ACTION_REQUEST = "action_request"
  static ACTION_REPLY = "action_reply"
  static NAVIGATION_REPLY = "navigation_reply"
  static NAVIGATION_REQUEST = "navigation_request"

  constructor(messageType) {
    this.message_type = messageType
  }

  serialize() {
    return JSON.stringify(this);
  }

  static deserialize(serializedMessage) {
    var obj
    try {
      obj = JSON.parse(serializedMessage)
    }
    catch(e) {
      return undefined
    }
    return JSON.parse(serializedMessage);

  }
}

class GameStateUpdate extends Message {

}

class GameEvent extends Message {
  static PHASE_CHANGED = new GameEvent("phase_changed") // lobby, buyphase, battle, gameover
  static STATE_UPDATE = new GameEvent("state_update")
}

export class ActionRequest extends Message {
  static PURCHASE_UNIT = "purchase_unit"
  static PURCHASE_ITEM
  static LEVEL_UP
  static REPOSITION_UNIT
  static FREEZE_SHOP_UNIT
  static FREEZE_SHOP_ITEM


  static make = {
    PURCHASE_UNIT: (player_id, index)=>
      new ActionRequest(this.PURCHASE_UNIT, [index]),
  }

  constructor(request, detail=[]) {
    super(Message.ACTION_REQUEST)
    this.request = request
    this.detail = detail
  }
}

const ActionErrorString = {
  0: "ok",
  1: "failed to parse request",
  2: "not enough gold",
}

class ActionReply extends Message {
  static OK = new ActionReply(0)
  static BAD_REQUEST = new ActionReply(1)
  static NOT_ENOUGH_GOLD = new ActionReply(2)

  constructor(errorcode) {
    super(Message.ACTION_REPLY)
    this.errorcode = errorcode
  }
}

// NAVIGATION

export class NavigationRequest extends Message {
  static JOIN_ROOM = "join_room"
  static LEAVE_ROOM = "leave_room"
  static CHANGE_RULES = "change_rules"

  static make = {
    JOIN_ROOM: (room_id)=>
      new NavigationRequest(this.JOIN_ROOM, [room_id]),
    LEAVE_ROOM: ()=>
      new NavigationRequest(this.LEAVE_ROOM),
    CHANGE_RULES: (rules)=>
      new NavigationRequest(this.CHANGE_RULES, [rules]),
  }

  constructor(request, detail=[]) {
    super(Message.NAVIGATION_REQUEST)

    this.request = request
    this.detail = detail
  }
}


const NavigationErrorString = {
  0: "ok",
  1: "failed to parse request",
  2: "you are not authorized to do that",
}

export class NavigationReply extends Message {
  static OK = new NavigationReply(0)
  static BAD_REQUEST = new NavigationReply(1)
  static NOT_AUTHORIZED = new NavigationReply(2)
  static ROOM_DOES_NOT_EXIST = new NavigationReply(3)
  static ROOM_IS_FULL = new NavigationReply(4)

  constructor(errorcode) {
    super(Message.NAVIGATION_REPLY)
    this.errorcode = errorcode
  }
}

class ServerMessage extends Message {
  TODO
}

export default {
  PORT: 8090,
  // MessageType: {
  //   GAME_EVENT,
  //   PLAYER_ACTION_RESPONSE,
  //   PLAYER_ACTION_REQUEST,
  // },
  ActionErrorString: ActionErrorString,
  ActionRequest: ActionRequest,
  ActionReply: ActionReply,
  // deserializeMessage: deserializeMessage,
}
