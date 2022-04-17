// base class for messages
export class Message {
  static GAME_EVENT = "game_event"
  static ACTION_REQUEST = "action_request"
  static ACTION_REPLY = "action_reply"
  static NAVIGATION_REPLY = "navigation_reply"
  static NAVIGATION_REQUEST = "navigation_request"
  static USER_ONBOARD = "user_onboard"

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
    return obj;

  }
}

class UserOnboard extends Message {
  constructor(room_id, users, game_params, phase, ents="TODO") {
    super(Message.USER_ONBOARD)
    this.room_id = room_id
    this.users = users
    this.game_params = game_params
    this.phase = phase
    this.ents = ents
  }
}

class GameStateUpdate extends Message {

}

export class GameEvent extends Message {
  static GAME_START = "game_start"
  static PHASE_CHANGE = "phase_change" // lobby, buyphase, battle, gameover
  static ENT_UPDATE = "ent_update"

  static make = {
    GAME_START: ()=>
      new GameEvent(GameEvent.GAME_START),
  }
  constructor(event, detail=[]) {
    super(Message.GAME_EVENT);
    this.event = event;
    this.detail = detail;
  }
}

export class ActionRequest extends Message {
  static PURCHASE_UNIT = "purchase_unit"
  static PURCHASE_ITEM = "purchase_item"
  static LEVEL_UP = "level_up"
  static REPOSITION_UNIT = "reposition_unit"
  static FREEZE_SHOP_UNIT = "freeze_shop_unit"
  static FREEZE_SHOP_ITEM = "freeze_shop_item"


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
  static START_GAME = "start_game"

  static make = {
    JOIN_ROOM: (room_id)=>
      new NavigationRequest(this.JOIN_ROOM, [room_id]),
    LEAVE_ROOM: ()=>
      new NavigationRequest(this.LEAVE_ROOM),
    CHANGE_RULES: (rules)=>
      new NavigationRequest(this.CHANGE_RULES, [rules]),
    START_GAME: ()=>
        new NavigationRequest(this.START_GAME),
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
  3: "that room does not exist",
  4: "that room is full",
  5: "you're already in that room",
}

export class NavigationReply extends Message {
  static OK = new NavigationReply(0)
  static BAD_REQUEST = new NavigationReply(1)
  static NOT_AUTHORIZED = new NavigationReply(2)
  static ROOM_DOES_NOT_EXIST = new NavigationReply(3)
  static ROOM_IS_FULL = new NavigationReply(4)
  static ALREADY_THERE = new NavigationReply(5)

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
  UserOnboard: UserOnboard,
  NavigationErrorString: NavigationErrorString,
  ActionErrorString: ActionErrorString,
  ActionRequest: ActionRequest,
  ActionReply: ActionReply,
  // deserializeMessage: deserializeMessage,
}
