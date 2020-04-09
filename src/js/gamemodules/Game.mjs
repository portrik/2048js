import { PlayArea } from './PlayArea.mjs';
import { Controller } from './Controller.mjs';

export class Game {
    constructor() {
        this.score = 0;
        this.size = 4;
    }

    setUpGame(playArea) {
        this.setUpController(playArea);

        this.playArea = new PlayArea(playArea);
        this.playArea.setUp(this.size);
        
        playArea.addEventListener('gameOver', () => this.gameOver());
        playArea.addEventListener('victory', () => this.victory());
    }

    setUpController(playArea) {
        this.controller = new Controller(playArea);

        playArea.addEventListener('moveLeft', () => this.playArea.moveTiles('left'));
        playArea.addEventListener('moveUp', () => this.playArea.moveTiles('up'));
        playArea.addEventListener('moveRight', () => this.playArea.moveTiles('right'));
        playArea.addEventListener('moveDown', () => this.playArea.moveTiles('down'));
    }

    gameOver() {
        console.log('Game over');
    }

    victory() {
        console.log('Victory');
    }
}