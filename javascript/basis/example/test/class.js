class Hero {
  #hp = 0; // 私有属性， 只能类访问， 实例无法访问
  constructor({
    name,
    hp = 200,
    level = 1,
    defense = 10,
    accack = 0,
    spellPower = 0,
  }) {
    this.name = name;
    this.#hp = hp;
    this.level = level;
    this.defense = defense;
    this.accack = accack;
    this.spellPower = spellPower;
  }
  move() {
    console.log(`${this.name}在移动`);
  }
  levelUp() {
    console.log(
      `${this.name}升级前,等级${this.level},血量${this.#hp},攻击${
        this.accack
      },法术${this.spellPower}`
    );
    this.level += 1;
    this.#hp += this.#hp;
    this.defense += this.defense;
    if (this.spellPower) {
      this.spellPower += this.spellPower;
    }
    if (this.accack) {
      this.accack += this.accack;
    }
    console.log(
      `${this.name}升级后,等级${this.level},血量${this.#hp},攻击${
        this.accack
      },法术${this.spellPower}`
    );
  }
  attackEnemy() {
    console.log("攻击了");
  }
}

class AccackHero extends Hero {
  constructor(options) {
    super(options);
  }
}

class SpellPowerHero extends Hero {
  constructor(options) {
    super(options);
  }
}

const accackHero = new AccackHero({ name: "德玛", accack: 20 });
const spellPowerHero = new AccackHero({ name: "狐狸", spellPower: 20 });

accackHero.levelUp();
accackHero.levelUp();
accackHero.levelUp();
spellPowerHero.levelUp();
