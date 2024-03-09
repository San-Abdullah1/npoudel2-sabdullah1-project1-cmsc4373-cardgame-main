import { game, updateWindow } from "../view/home_page.js";
import { currentUser } from "./firebase_auth.js";
import { DEV } from "../model/constants.js";
import { addGameRecord } from "./firestore_controller.js";


export function onClickNewGameButton(e) {
    //console.log('onClickNewGameButton');
    game.newGame();
    updateWindow();
}

export async function onClickPlay(e) {
    game.playGame();
    await savePlayRecord();
    updateWindow();
}

export async function onClickRestartButton(e) {
    game.resetGame();
    await savePlayRecord();
    updateWindow();
}

export async function onClickBetButton(e) {
    const CardNum = parseInt(e.currentTarget.value); // No need to adjust CardNum
    let updateCards = game.findCard(CardNum);

    // Debugging: Check the value of CardNum
    console.log('CardNum:', CardNum);

    // Debugging: Check if updateCards is defined and has the expected methods
    console.log('updateCards:', updateCards);

    if (updateCards) {
        if (e.target.id.includes('minus')) {
            updateCards.decreaseBet();
        } else {
            updateCards.increaseBet();
        }
        updateWindow();
    } else {
        console.error('updateCards is undefined or null');
    }
}

export async function savePlayRecord() {
    const email = currentUser.email;
    const balance = game.balance;
    const won = game.cWon;
    const bet = game.cBet;
    const restart = game.gameReset;
    const timestamp = Date.now();

    const playRecord = { email, balance, won, bet, restart, timestamp };
    const div = document.createElement('div');
    div.classList.add('text-white', 'bg-primary');
    div.textContent = 'Saving play record...';
    const messageElement = document.getElementById('message');
    if (messageElement) {
        messageElement.appendChild(div);
    }
    try {
        await addGameRecord(playRecord);
    } catch (e) {
        if (DEV) console.log('failed to save play record', e);
        alert(`
                Failed to save: ${JSON.stringify(e)}`);
    }

    div.remove();
}

