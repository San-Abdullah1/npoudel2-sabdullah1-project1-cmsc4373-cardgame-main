import { currentUser } from "../controller/firebase_auth.js";
import { root } from "./elements.js";
import { protectedView } from "./proetected_view.js";
import { CardGuesser, gameState } from "../model/card_random.js";
import { onClickNewGameButton, onClickPlay, onClickRestartButton, onClickBetButton } from "../controller/home_controller.js";

export const images = {
    BACK: '../images/cardBack.png',
    FRONT: '../images/cardFront.jpg',
    FBCARD: '../images/firebase.png',
}
export let game = new CardGuesser();

export async function homePageView() {
    if (!currentUser) {
        console.log('currentUser not found' + currentUser);
        root.innerHTML = await protectedView();
        return;
    }

    game.gameState = gameState.INIT;

    const response = await fetch('/view/templates/home_page_template.html',
        { cache: 'no-store' });
    const divWrapper = document.createElement('div');
    divWrapper.innerHTML = await response.text();
    divWrapper.classList.add('m-4', 'p-4');
    document.body.appendChild(divWrapper);



    const images = divWrapper.querySelectorAll('img');

    document.querySelectorAll('#button-play').forEach(button => button.onclick = onClickPlay);
    document.querySelectorAll("#newButton").forEach(button => {
        button.onclick = onClickNewGameButton;
        console.log("New Game Button: ", button);
    });

    document.querySelectorAll("#restartButton").forEach(button => button.onclick = onClickRestartButton);
    

    const minusButtons = divWrapper.querySelectorAll("[id*='sub']");
    minusButtons.forEach(b => b.onclick = onClickBetButton);
    const plusButtons = divWrapper.querySelectorAll("[id*='add']");
    plusButtons.forEach(button => {
        button.onclick = onClickBetButton;
        document.querySelector("#balance").textContent = "Balance: " + game.balance;
        console.log("Balance: ", game.balance);
    });

    root.innerHTML = '';
    root.appendChild(divWrapper);
    await game.updateBalance();
    updateWindow();
}

export function updateWindow() {
    let bets = document.querySelectorAll("[id*='bet']")
    let minusButton = document.querySelectorAll("[id*='sub']");
    let plusButton = document.querySelectorAll("[id*='add']");
    let images = document.querySelectorAll('img');
    let newGameButton = document.querySelector('#newButton');
    let playButton = document.querySelector("#button-play"); // This should be a single element
    let restartButton = document.querySelector("#restartButton"); // This should be a single element

    switch (game.gameState) {

        case gameState.INIT:
            images.forEach(img => img.src = '/images/CardBack.PNG');
            minusButton.forEach(b => b.disabled = true);
            plusButton.forEach(b => b.disabled = true);
            playButton.disabled = true;
            restartButton.disabled = true;
            break;

        case gameState.PLAYING:
            images.forEach(img => img.src = '/images/CardBack.PNG');
            minusButton.forEach(b => b.disabled = true);
            plusButton.forEach(b => b.disabled = true);
            restartButton.disabled = true;
            playButton.disabled = true;
            newGameButton.disabled = true;

            let totalBets = 0;
            for (let i = 0; i < 3; i++) {

                if (bets[i]) {
                    bets[i].textContent = game.findCard(i).getBet();
                    totalBets += game.findCard(i).getBet();
                    document.querySelector("#balance").textContent = "Balance: " + game.balance;

                }

                if (totalBets == 0) {
                    playButton.disabled = true;
                } else {
                    playButton.disabled = false;
                }

                if (game.findCard(i).getBet() == 0) {
                    minusButton[i].disabled = true;
                } else {
                    minusButton[i].disabled = false;
                }

                if (totalBets == game.balance) {
                    for (let j = 0; j < 3; j++) {
                        plusButton[j].disabled = true;
                    }
                } else {
                    plusButton[i].disabled = false;
                }
            }

            document.querySelector("#bets").textContent = "currents bets: " + game.currentTotalBets;
            document.querySelector('#card-location').textContent = "SECTECT: Firebase card location: " + game.gKey;
            break;

        case gameState.END:
            playButton.disabled = true;
            minusButton.forEach(b => b.disabled = true);
            plusButton.forEach(b => b.disabled = true);

            for (let i = 0; i < 3; i++) {
                if (i == game.gKey) {
                    images[i].src = '/images/firebase.png';
                } else {
                    images[i].src = '/images/cardFront.jpg';
                }
            }
            if (game.balance > 0) {
                newGameButton.disabled = false;
            } else {
                restartButton.disabled = false;
            }
    }
    document.querySelector("#balance").textContent = "Balance: " + game.balance;
    document.querySelector('#messgae').textContent = game.message;
    document.querySelectorAll('#bets').textContent = "current bets: " + game.currentTotalBets;
    document.querySelector('#card-location').textContent = "SECRET: Firebase card location: " + game.gKey;
}




