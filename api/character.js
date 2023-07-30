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

    currentHp() {
        return this.baseHp - this._damageReceived
    }

    isDead() {
        return this.currentHp() <= 0
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
        // Source: https://irowiki.org/classic/ASPD
        const MAX_AGI_CALCULATION = 120
        const MAX_AGI_PLAYER = 110
        const MAX_ATTACK_PER_SECOND = 10
        const TICK_RATE_MILLISECOND = 100
        const agi = this.agi > MAX_AGI_PLAYER ? MAX_AGI_PLAYER : this.agi
        const attackDelay = MAX_ATTACK_PER_SECOND * (MAX_AGI_CALCULATION - agi)
        const attackGaugePerTick = Math.pow(TICK_RATE_MILLISECOND, 2) / attackDelay
        return attackGaugePerTick
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
        return this.str
    }

    getStats() {
        return {
            'base': {
                'agi': this.agi,
                'con': this.con,
                'dex': this.dex,
                'str': this.str
            },
            'derived': {
                'attack-speed': this.attackSpeed,
                'evasion': this.evasion,
                'damage': this.damage,
                'base-hp': this.baseHp,
                'defense': this.defense,
                'hit-rate': this.hitRate
            }
        }
    }
}

export default Character
