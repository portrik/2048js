import { PlayArea } from './PlayArea.mjs';
import { Controller } from './Controller.mjs';
import { Storage } from './Storage.mjs';

export class Game {
    constructor() {
        this.score = 0;
        this.lastValue = 0;
        this.size = 4;
        this.saveTimeout = null;
        this.storage = new Storage();
        this.won = false;
        this.lost = false;
    }

    /**
     * Loads default values and initializes PlayArea, Controller and event listeners.
     * If localStorage save exists, default values are overwritten.
     * @param playArea - HTML Canvas element
     */
    setUpGame(playArea) {
        this.setUpController(playArea);
        this.playArea = new PlayArea(playArea);

        this.loadLocalData();

        document.getElementById('score').innerText = this.score;

        playArea.addEventListener('gameOver', () => this.gameOver());
        playArea.addEventListener('victory', () => this.victory());
        playArea.addEventListener('scoreUp', (event) => this.updateScore(event.detail.value));

        document.getElementById('reset').addEventListener('click', (event) => {
            this.resetGame();
            event.preventDefault();
        });

        document.getElementById('game-over-restart').addEventListener('click', (event) => {
            this.resetGame();
            event.preventDefault();
        });

        document.getElementById('undo').addEventListener('click', (event) => {
            this.undoLastMove();
            event.preventDefault();
        });

        document.getElementById('victory').addEventListener('click', (event) => {
            document.getElementById('victory').style.display = 'none';
            event.preventDefault();
        })
    }

    /**
     * Hooks Controller on the PlayArea.
     * @param playArea - HTML Canvas element
     */
    setUpController(playArea) {
        this.controller = new Controller(playArea);

        playArea.addEventListener('moveGameBoard', (event) => { 
            if (!this.lost) {
                this.playArea.moveTiles(event.detail.direction); 
            }
        });
    }

    /**
     * Loads saved data if localStorage is working and data exist.
     */
    loadLocalData() {
        let localData = this.storage.loadItem('board');

        if (localData) {
            this.score = localData["score"];
            this.size = localData["board"].length;
            this.won = localData["won"];
            this.playArea.setBoard(localData["board"]);
        }
        else {
            this.playArea.setUp(this.size);
        }
    }

    /**
     * Updates the score with the value from a merged Tile.
     * @param value - Value of the merged Tile.
     */
    updateScore(value) {
        this.lastValue = value;
        this.score += value;

        document.getElementById('score').innerText = this.score;

        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
            this.saveTimeout = null;
        }

        this.saveTimeout = setTimeout(() => {
            let saveData = {
                'board': this.playArea.board,
                'score': this.score,
                'won': this.won,
            };

            this.storage.storeItem('board', saveData);
        }, 2000);
    }

    /**
     * Resets the game to the default state.
     * Also removes saved data.
     */
    resetGame() {
        document.getElementById('victory').style.display = 'none';
        document.getElementById('game-over').style.display = 'none';

        this.score = 0;
        this.lost = false;
        this.won = false;
        document.getElementById('score').innerText = this.score;

        this.storage.removeItem('board');
        this.playArea.setUp(this.size);
    }

    /**
     * Resize the board to a new size.
     * @param size - New size of the board.
     */
    setSize(size) {
        this.size = size;
        this.resetGame();
    }

    /**
     * Reverts to a previous state.
     */
    undoLastMove() {
        this.score -= this.lastValue;
        this.lastValue = 0;
        this.playArea.undoLastMove();
        document.getElementById('score').innerText = this.score;
    }

    /**
     * Ends the game.
     */
    gameOver() {
        if (!this.lost) {
            document.getElementById('game-over').style.display = 'flex';
            document.getElementById('game-over').style.opacity = '100%';
            this.lost = true;
            this.storage.removeItem('board');
        }
    }

    /**
     * Announces victory and opens modal with the option to play on.
     */
    victory() {
        if (!this.won) {
            document.getElementById('victory-value').innerText = Math.pow(2, (this.size * 3 - 1));
            document.getElementById('victory').style.display = 'flex';
            document.getElementById('victory').style.opacity = '100%';
            this.won = true;
        }
    }
}