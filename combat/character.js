class Character {
    
    constructor(stats) {
        this.agi = stats.agi || 1
        this.con = stats.con || 1
        this.dex = stats.dex || 1
        this.str = stats.str || 1
        
        this._attackGaugeLimit = 100
        this._attackGauge = 0
        this._damageReceived = 0
    }

    isTurn() {
        this._attackGauge += this.attackSpeed

        if (this._attackGauge < this._attackGaugeLimit) {
            return false
        }

        this._attackGauge -= this._attackGaugeLimit
        return true
    }

    get damageReceived() {
        return this._damageReceived
    }

    set damageReceived(damageReceived) {
        this._damageReceived += damageReceived
    }

    get attackSpeed() {
        return this.agi
    }

    get evasion() {
        return this.agi
    }

    get baseHp() {
        return this.con * 10
    }

    get defense() {
        return this.con
    }

    get hitRate() {
        return this.dex
    }

    get damage() {
        return this.str * 5
    }

    getStats() {
        return {
            'attack-speed': this.attackSpeed,
            'evasion': this.evasion,
            'damage': this.damage,
            'base-hp': this.baseHp,
            'defense': this.defense,
            'hit-rate': this.hitRate
        }
    }
}

export default Character
