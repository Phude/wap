export default class EntitySystem {
  static NULL_ID = 0
  constructor() {
    this.ents = {}
  }

  byType(type) {
    var entList = []
    for (const id in this.ents) {
      entList.push(id)
    }
    return entList
  }

  fetch(id) {
    return this.ents[id]
  }
  // addEntity(id, entity) {
  //   this.ents[id] = entity
  // }
}


// entity classes

//
// class Unit {
// 	var proto
// 	var health
// 	var attack
//
// 	func _init(proto):
// 		self.proto = proto
// #		self.health = p_proto[proto].health
// #		self.attack = p_proto[proto].attack
// }
//
// class ShopSlot {
// 	var frozen = false
// 	var content
// 	func _init(content):
// 		self.content = content
// }
//
// var g_players = []
// var g_deck = {
// 	"1": [],
// 	"2": [],
// 	"3": [],
// 	"4": [],
// 	"5": [],
// 	"6": [],
// }
//
//
//
// var p_proto = {
// 	"item": {
// 		"apple": {
// 			"cost": 2,
// 			"effect": "+3h",
// 		}
// 	},
// 	"unit": {
// 		"zombie": {
// 			"name": "Zombie",
// 			"attack": 5,
// 			"health": 3,
// 		},
// 	},
// }
//
//
// func init(num_players):
// 	for i in range(num_players):
// 		g_players.append(Player.new("player " + str(i)))
//
//
// ###############
// ### UTILITY ###
//
//
// func roll(n):
// 	return rng.randi_range(0, n)
//
//
// func get_player(player_id):
// 	return g_players[player_id]
//
//
// func party_slot_is_open(player_id, slot_index):
// 	return g_players[player_id].party[slot_index] != null
//
//
// func party_size(player_id):
// 	var player = get_player(player_id)
//
// 	var size = 0
// 	for i in range(player.party.size() - 1):
// 		if !party_slot_is_open(player_id, i):
// 			size += 1
//
// 	return size
//
//
// func party_is_full(player_id):
// 	return party_size(player_id) >= g_players[player_id].max_party_size
//
//
// ############
// ### SHOP ###
//
// func draw_unit_from_deck(tier):
// 	var index = roll(g_deck[tier].size()-1)
// 	var unit = g_deck[tier][index]
// 	g_deck[tier].remove(index)
// 	return unit
//
//
// func roll_slot(player_id, slot_index, tier):
// 	var slot = g_players[player_id].shop_slots[slot_index]
// 	slot.content = draw_unit_from_deck(tier)
//
//
// func roll_all_slots(player_id):
// #	var max_tier = player_id.tier
// 	var num_slots = player_id.shop_slots
// 	for i in player_id.shop_slots():
// 		roll_slot(player_id, i, 1)
//
// ###############
// ### ACTIONS ###
// ###############
//
// func ACTION_purchase_unit(player_id, slot_id):
// 	var player = get_player(player_id)
// 	var unit_cost = 3
// 	if unit_cost > player.gold:
// 		$PlayerInterface.send_error("You don't have enough gold to purchase that.")
// 		return
// 	if party_is_full(player_id):
// 		$PlayerInterface.send_error("Party is full, sell a unit to make room.")
// 		return
//
// 	var slot = player.shop_slots[slot_id]
// 	player.party.append(slot.content)
// 	slot.content = null
// 	slot.frozen = false
//
//
// #############
// ### PARTY ###
// #############
//
//
// func do_round_start():
// 	for player_id in range(g_players.size() - 1):
// 		var player = g_players[player_id]
// 		player.gold = 10
// 		roll_all_slots(player_id)
//
// var rng = RandomNumberGenerator.new()
// func _ready():
// 	rng.randomize()
// 	TEST()
//
//
// func TEST():
// 	$Event.fire({"type": "notype", "arg1": 42})
