//CONFIG.debug.hooks = true || Debug log all hooks used

console.log("Hello World!");




/* 
Event Listeners
  //Event listener on targeting a token
  Hooks.on("targetToken", (User, Token5e, state) => {
    if (state) {
      console.log(Token5e.document.actorId);
      console.log(Token5e.document.name);
    }
  })

  //Event listener on before attack roll
  Hooks.on("dnd5e.preRollAttack", (Item5e, Actor5e) => {
    console.log(Actor5e.actor.id);
  })

  //Event listener on before damage roll
  Hooks.on("dnd5e.preRollDamage", (Item5e, Actor5e) => {
    console.log(Actor5e.actor.id);
  })

  //Event listener on attack roll
  Hooks.on("dnd5e.rollAttack", (Item5e, D20Roll) => {
    console.log(D20Roll._total);
    console.log(Item5e.parent.name);
  })

  //Event listener on damage roll
  Hooks.on("dnd5e.rollDamage", (Item5e, DamageRoll) => {
    console.log(DamageRoll._total);
    console.log(Item5e.parent.name);
  })
*/

Hooks.on("dnd5e.preRollAttack", (Item5e, Actor5e) => {
  let attackerID = Actor5e.actor.id;
  Hooks.once("dnd5e.rollAttack", (Item5e, D20Roll) => {
    Cache.addAttack(attackerID, Item5e.parent.name, D20Roll._total)
  })
})

Hooks.on("dnd5e.preRollDamage", (Item5e, Actor5e) => {
  console.log(Actor5e.actor.id);
  let attackerID = Actor5e.actor.id;
  Hooks.once("dnd5e.rollDamage", (Item5e, DamageRoll) => {
    Cache.addDamage(attackerID, DamageRoll._total);
  })
})



//Need some kind of cache to temporary store attackEntries that are still being processed
//Attacks are still being processed until both the attack and damage have been rolled
class Cache {
  static cache = [];

  static clearCache() {
    this.cache = [];
  }

  //Add an attack to be processed in the cache
  static addAttack(attackerID, attackerName, attackRoll) {
    //Find if an instance of the attacker's attack exists within the cache already
    if (!this.cache.includes((attackEntry) => attackEntry.attackerID === attackerID))
    {
      this.cache.push({
        attackerId: attackerID,
        attackerName: attackerName,
        attackRoll: attackRoll
      })
    }
    else {
      //Update attack roll in cache
      let attackIndex = this.cache.indexOf((attackEntry) => attackEntry.attackerID === attackerID);
      let attackEntry = this.cache[attackIndex];
      attackEntry.attackerName = attackerName;
      attackEntry.attackRoll = attackRoll;
    }
  }

  //Add a damage value to an attack currently being processed in the cache
  static addDamage(attackerID, damageRoll) {
    let attackIndex = this.cache.indexOf((attackEntry) => attackEntry.attackerID === attackerID)
    if (attackIndex != -1)
    {
      let attackEntry = this.cache[attackIndex];
      attackEntry.attackDamage = damageRoll;
      //AttackEntry should be completely filled out at this point
      //Validate and add AttackEntry to list and remove from the cache
      if (validateFields(attackEntry, validateFields)) {
        AttackEntryData.addAttackEntry(attackEntry);
        //Testing to see if attack entry is added to the list
        AttackEntryData.listAttackEntries();
      }
    }
  }
}

class AttackEntryData {
  static attackEntries = [];

  //Clear all attack entries
  static clearAttackEntries() {
    this.attackEntries = [];
  }

  //Add a new attack entry to the list
  static addAttackEntry(attackEntry) {
    this.attackEntries.push(attackEntry)
  }

  static listAttackEntries() {
    this.attackEntries.forEach((attackEntry) => {
      console.log(attackEntry);
    })
  }
}

//Attack Entry consists of
/*
  Attacker
  - Attacker Token
  - Attacker Name
  - Attack Roll
  - Attack Damage
  Target
  - Target Token
  - Target Name
  - Target AC
*/
class AttackEntry {
  attackerName;
  attackRoll;
  attackDamage = 0;
  targetName;
  targetAC;
}