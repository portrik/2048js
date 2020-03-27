import { Tile } from './Tile.mjs';

export class PlayArea {
    constructor(area) {
        this.chance = 0.2;
        this.area = area;
        this.resizeArea();

        // Resizes the game area at every window resize
        window.addEventListener('resize', () => this.resizeArea());
    }

    /**
     * Resizes the game area according to window size.
     */
    resizeArea() {
        let width = window.innerWidth;
        let height = window.innerHeight;

        if (width > height) {
            height = Math.round(height * 0.9);
            width = height;
        }
        else {
            width = Math.round(width * 0.9);
            height = width;
        }

        this.width = width;
        this.height = height;
        
        let context = this.area.getContext('2d');
        context.canvas.width = width;
        context.canvas.height = height;

        this.drawBoard();
    }

    /**
     * Sets the board up with new size
     * @param {int} size - Board Size
     */
    setUp(size) {
        this.size = size;
        this.board = new Array(this.size);

        for (let i = 0; i < this.size; ++i) {
            this.board[i] = new Array(this.size);
        }

        this.spawnTile();
        this.spawnTile();
        this.drawBoard();
    }

    // TODO: Make margin of sides fixed value 
    drawBoard() {
        let tileSize = Math.round(this.width / (this.size + 1));
        let margin = Math.round(tileSize / (this.size + 1));

        let context = this.area.getContext('2d');

        let x = margin;
        let y = margin;

        for (let j = 0; j < this.size; ++j) {
            for (let i = 0; i < this.size; ++i) {

                if (this.board[j][i]) {
                    context.fillStyle = this.board[j][i].color;
                    context.fillRect(x, y, tileSize, tileSize);

                    context.font = '80px Arial';
                    context.textAlign = 'center';
                    context.fillStyle = 'black';
                    context.textBaseline = 'middle';
                    let textX = x + Math.round(tileSize / 2);
                    let textY = y + Math.round(tileSize / 2) + 10;

                    context.fillText(this.board[j][i].value, textX, textY);
                }
                else {
                    context.fillStyle = 'rgba(238, 228, 218, 0.35)';
                    context.fillRect(x, y, tileSize, tileSize);
                }

                x += tileSize + margin;
            }

            x = margin;
            y += tileSize + margin;
        }
    }

    spawnTile() {
        let available_spaces = [];
        
        for (let j = 0; j < this.board.length; ++j) {
            for (let i = 0; i < this.board.length; ++i) {
                if (this.board[j][i] == null) {
                    available_spaces.push([j, i]);
                }
            }
        }

        if (available_spaces.length > 0) {
            let position = Math.round(Math.random() * (available_spaces.length - 1));
            let x = available_spaces[position][0];
            let y = available_spaces[position][1];

            let roll = Math.random();
            let value = 2;

            if (roll < this.chance) {
                value = 4;   
            }

            this.board[x][y] = new Tile(value);
        }
        else {
            this.area.dispatchEvent(new Event('gameOver'));
        }
    }

    moveBoard(x, y) {
        console.log('Moving board');  
    }
}