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

        playArea.addEventListener('moveLeft', () => this.moveLeft());
        playArea.addEventListener('moveUp', () => this.moveUp());
        playArea.addEventListener('moveRight', () => this.moveRight());
        playArea.addEventListener('moveDown', () => this.moveDown());
    }

    moveLeft() {
        console.log('Moving left');
        document.getElementById('debug').innerText = 'Moving left';
    }

    moveUp() {
        console.log('Moving up');
        document.getElementById('debug').innerText = 'Moving up';
    }

    moveRight() {
        console.log('Moving right');
        document.getElementById('debug').innerText = 'Moving right';
    }

    moveDown() {
        console.log('Moving down');
        document.getElementById('debug').innerText = 'Moving down';
    }

    gameOver() {
        console.log('Game over');
    }

    victory() {
        console.log('Victory');
    }
}