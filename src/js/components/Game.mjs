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
        this.highscores = {};
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
        playArea.addEventListener('resize', () => {
            this.setSize(event.detail.size);
            this.resetGame();
        });

        document.getElementById('reset').addEventListener('click', (event) => {
            event.preventDefault();
            this.resetGame();
        });

        document.getElementById('undo').addEventListener('click', (event) => {
            event.preventDefault();
            this.undoLastMove();
        });

        document.getElementById('victory').addEventListener('click', (event) => {
            event.preventDefault();
            document.getElementById('victory').style.display = 'none';
        });

        document.forms["can-submit-score"].addEventListener('submit', (event) => {
            event.preventDefault();
            this.saveScore();
            document.getElementById('game-over').style.display = 'none';
        });
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

        localData = this.storage.loadItem('highscores');

        if (localData) {
            this.highscores = localData;
            this.updateHighscoresTable();
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
     * Also removes ovewrites save data with a new state.
     */
    resetGame() {
        document.getElementById('victory').style.display = 'none';
        document.getElementById('game-over').style.display = 'none';

        this.score = 0;
        this.lost = false;
        this.won = false;
        document.getElementById('score').innerText = this.score;

        this.playArea.setUp(this.size);

        let saveData = {
            'board': this.playArea.board,
            'score': this.score,
            'won': this.won,
        };

        this.storage.storeItem('board', saveData);
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
            let hasHigherScore = 'hidden';
            let currentHighscores = [];
            this.lost = true;

            if (!this.highscores[this.size]) {
                this.highscores[this.size] = [];
            }

            currentHighscores = this.highscores;

            if (currentHighscores.length < 10) {
                hasHigherScore = 'flex';
            }
            else if (currentHighscores[currentHighscores.length - 1] < this.score) {
                hasHigherScore = 'flex';
            }

            document.getElementById('can-submit-score').style.display = hasHigherScore;
            document.getElementById('game-over').style.display = 'flex';
            document.getElementById('game-over').style.opacity = '100%';
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

    saveScore() {
        let newScore = {
            name: document.forms["can-submit-score"][0].value,
            score: this.score,
        };

        if (this.highscores[this.size].length > 9) {
            this.highscores[this.size].pop();
        }

        this.highscores[this.size].push(newScore);
        this.highscores[this.size].sort((a, b) => (a.score > b.score) ? 1 : -1);

        this.storage.storeItem('highscores', this.highscores);

        this.updateHighscoresTable();
        this.resetGame();
    }

    updateHighscoresTable() {
        let keys = Object.keys(this.highscores);
        let targetElement = document.getElementById('scores-area');
        targetElement.innerHTML = '';

        keys.forEach(key => {
            let wrapper = document.createElement('div');
            let heading = document.createElement('h3');
            heading.innerText = 'Scores for Board Size ' + key;
            wrapper.appendChild(heading);

            let table = document.createElement('table');
            wrapper.appendChild(table);

            let header = document.createElement('tr');
            table.appendChild(header);

            let player = document.createElement('th');
            player.innerText = 'Player';
            header.appendChild(player);

            let score = document.createElement('th');
            score.innerText = 'Score';            
            header.appendChild(score);

            this.highscores[key].forEach((player) => {
                let newRow = document.createElement('tr');

                let rowName = document.createElement('td');
                rowName.innerText = player.name;
                newRow.appendChild(rowName);

                let rowScore = document.createElement('td');
                rowScore.innerText = player.score;
                newRow.appendChild(rowScore);

                table.appendChild(newRow);
            });

            targetElement.appendChild(wrapper);
        });
    }
}