import { PlayArea } from './PlayArea.mjs';
import { Controller } from './Controller.mjs';
import { Storage } from './Storage.mjs';

export class Game {
    constructor() {
        this.score = 0;
        this.size = 4;
        this.saveTimeout = null;
        this.storage = new Storage();
    }

    setUpGame(playArea) {
        this.setUpController(playArea);

        this.playArea = new PlayArea(playArea);
        this.playArea.setUp(this.size);

        document.getElementById('score').innerText = this.score;        
        playArea.addEventListener('gameOver', () => this.gameOver());
        playArea.addEventListener('victory', () => this.victory());
        playArea.addEventListener('scoreUp', (event) => this.updateScore(event.detail.value)); 
    }

    setUpController(playArea) {
        this.controller = new Controller(playArea);

        playArea.addEventListener('moveGameBoard', (event) => this.playArea.moveTiles(event.detail.direction));
    }

    updateScore(value) {
        this.score += value;

        document.getElementById('score').innerText = this.score;

        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
            this.saveTimeout = null;
        }

        this.saveTimeout = setTimeout(() => this.storage.storeBoard(this.playArea.board, this.score), 2000);
    }

    gameOver() {
        this.controller.disableController();
        console.log('Game over');
    }

    victory() {
        console.log('Victory');
    }
}