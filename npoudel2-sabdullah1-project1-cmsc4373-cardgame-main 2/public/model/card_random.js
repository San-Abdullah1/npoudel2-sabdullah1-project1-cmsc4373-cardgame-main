import { currentUser } from "../controller/firebase_auth.js";
import { DEV } from "./constants.js";
import {  getPlayHistory } from "../controller/firestore_controller.js";
import { CardGames } from "./cardgame.js";

export const MARKING = {
    BACK: 'back',
    FRONT: 'front',
    FBCARD: 'firebase',
};

export const NEWGAME = "\nPress [New Game] to play again.";
export const BROKE = "\nYou have no coins to play! Press [Restart App].";

export const gameState = {
    INIT: 0,
    PLAYING: 1,
    END: 2,
};

export class CardGuesser {
    constructor() {
        this.board = [];
        for (let i = 0; i < 3; i++) {
            this.board.push(new CardGames);
        }
        this.message = "Press [New Game] button to Start!";
        this.balance = ""; 
        this.cWon = 0;
        this.cBet = 0;
        this.gameReset = false;
        this.currentTotalBets = 0;
        this.gKey = 0;
        this.gameState = gameState.INIT;
    }

    async updateBalance() {    
        let gameHistory = [];
        try {
            gameHistory = await getPlayHistory(currentUser.email);
        } catch (e) {
            if (DEV) console.log('Failed to getCardGameHistory', e);
            alert(`Failed to get history: ${JSON.stringify(e)}`);
            return;
        }
        if(gameHistory.length > 0) {
            this.balance = gameHistory[0].balance;
        } else {
            this.balance = 15; 
        }
    }

    playGame() {
        this.cWon = 0;
        this.cBet = 0;
        this.board.forEach(card => {
            this.cBet += card.getBet();
            if (card.gameKey) {
                this.cWon = card.comeUp();
                card.setGameMode('firebase');
            } else {
                card.setGameMode('front');
            }
        })

        let numChangeScreen = this.cWon > 0 ? this.cWon : '0';
        this.message = "You won!! " + numChangeScreen + "coins by betting " + this.cBet + "coins\n.";
        this.balance += (this.cWon - this.cBet);
        if(this.balance > 0) {
            this.gameReset = false;
        }
        this.message += this.screenMessage();
        this.gameState = gameState.END;
    }

    screenMessage() {
        return this.balance > 0 ? NEWGAME : BROKE;
    }

    newGame() {
        this.message = "Bet on cardss and press [PLAY]"
        this.gameState = gameState.PLAYING;
        this.errorMessage = null;
        this.resetCards();
    }

    findCard(CardNum) {
        if (CardNum >= 0 && CardNum < this.board.length) {
            return this.board[CardNum];
        } else {
            console.error('Invalid card index:', CardNum);
            return null; // or handle this case accordingly
        }
    }

    resetCards() {
        this.gKey = Math.floor(Math.random() * 3);
        for (let i = 1; i < 3; i++) {
            this.board[i].reset(this.gKey);
        }
    }

    resetGame() {
        this.balance = 15;
        this.cWon = 0;
        this.cBet = 0;
        this.gameReset = true;
        this.currentTotalBets = 0;
        this.gameState = gameState.INIT;
        this.newGame();
    }


}