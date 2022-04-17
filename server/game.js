import Entity from "./entity.js"
import { ActionRequest, GameEvent } from "protocol"

const DEFAULT_GAME_PARAMS = {
  round_time: 30,
}

class GamePhase {
  LOBBY = "lobby"
  BUY = "buy"
  BATTLE = "battle"
  FINISHED = "finished"
}

export default class Game {
  DO_ACTION = {
    [ActionRequest.PURCHASE_ITEM]: function(player, actrq) {
      console.log("attempting to purchase item")
    },
  }

  constructor(event_callback) {
    console.log(this.DO_ACTION)
    this.event_callback = event_callback
    this.params = {}
    this.players = [] // list of entID
    Object.assign(this.params, DEFAULT_GAME_PARAMS)
    this.seed = 1234
    this.es  = new Entity()
    this.phase = GamePhase.LOBBY
  }

  reportEvent(event) {
    this.event_callback(event)
  }

  randomId() {
    const m = 2147483648 // 2^31
    const a = 1103515245 // glibc uses this number
    const c = 12345      // glibc uses this number

    this.seed = ((this.seed * a) % m) + c
    return this.seed
  }

  addEntity(entity, type) {
    var id = this.randomId()
    entity.type = type
    this.es.ents[id] = entity
    return id
  }

  // base entity
  makeRoot(numPlayers) {
    var root = {
      num_players: 2,
      players: [],
      decks: [
        Entity.NULL_ID,
        Entity.NULL_ID,
        Entity.NULL_ID,
        Entity.NULL_ID,
        Entity.NULL_ID,
        Entity.NULL_ID,
      ],
      round_timer: Entity.NULL_ID,
    }
    return this.addEntity(root, "root")
  }

  makeTimer(duration) {
    var timer = {
      duration: duration,
      remaining: duration,
    }
    return this.addEntity(timer, "timer")
  }

  makePlayer() {
    var player = {
      gold: 0,
      tier: 1,
      tier_up_cost: 10,
      shop_size: 10,
      shop_slots: [],
      party: [],
      max_party_size: 5,
      victory_points: 0,
    }
    return this.addEntity(player, "player")
  }

  makeUnit() {
    var unit = {
      base_attack: 2,
      base_health: 5,
      enchant: Entity.NULL_ID
    }
    return this.addEntity(unit, "unit")
  }

  changePhaes(new_phase) {
    this.phase = new_phase
  }

  start(numPlayers) {
    this.rootId = this.makeRoot(numPlayers)
    var root = this.es.fetch(this.rootId)
    root.players.push(this.makePlayer())
    root.players.push(this.makePlayer())
    this.reportEvent(GameEvent.make.GAME_START())
  }
}
