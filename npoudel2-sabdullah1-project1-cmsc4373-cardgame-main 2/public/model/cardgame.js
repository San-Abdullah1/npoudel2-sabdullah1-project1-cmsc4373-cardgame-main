export class CardGames {
    constructor() {
        this.bet = 0;
        this.gameKey = false;
        this.face = true;
    }

    reset(gameKey) {
        this.bet = 0;
        this.gameKey = gameKey;
    }

    getMode() {
        return this.face ? 'back' : this.gameKey ? 'firebase' : 'frpnt';
    }

    getBet() {
        return this.bet;
    }

    setGameKey() {
        this.gameKey = true;
    }

    increaseBet() {
        if (this.balance != 0) {
            this.bet++;
            this.balance--; 
        }
    }

    decreaseBet() {
        if (this.bet == 0) return;
        else this.bet--;
    }

    setGameMode(marking) {
        this.marking = marking;
    }

    comeUp() {
        return (this.getBet() * 3);
    }
}
