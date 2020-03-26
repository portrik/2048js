import { Tile } from './Tile.mjs';

export class PlayArea {
    constructor(area) {
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

        let x = Math.round(Math.random() * (this.size - 1));
        let y = Math.round(Math.random() * (this.size - 1));

        this.board[x][y] = new Tile(2, '#eee4da');

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
                }
                else {
                    context.fillStyle = 'rgba(238, 228, 218, 0.35)';
                }

                context.fillRect(x, y, tileSize, tileSize);
                x += tileSize + margin;
            }

            x = margin;
            y += tileSize + margin;
        }
    }

    spawnTile() {
        // TODO: Nice and clean code to generate new tiles
    }
}