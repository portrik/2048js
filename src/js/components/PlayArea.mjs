import { Tile } from './Tile.mjs';

export class PlayArea {
    constructor(area) {
        this.chance = 0.1;
        this.area = area;

        // Adds function for drawing rounded rectangles into PlayArea context
        this.context = area.getContext('2d');
        this.context.drawRoundedRect = drawRoundedRect;

        this.resizeArea();
        this.size = 0;
        this.board = [];
        this.previousState = null;

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
            height = Math.round(height * 0.85);
            width = height;
        }
        else {
            width = Math.round(width * 0.85);
            height = width;
        }

        this.width = width;
        this.height = height;

        this.context.canvas.width = width;
        this.context.canvas.height = height;

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
            this.board[i].fill(null);
        }

        this.checkBoard(true);
        this.checkBoard(true);
        this.drawBoard();
    }

    /**
     * Changes the board to the saved one
     * @param board - Saved board from localStorage
     */
    setBoard(board) {
        this.size = board.length;

        for (let i = 0; i < this.size; ++i) {
            this.board[i] = [];

            for (let j = 0; j < board[i].length; ++j) {
                if (board[i][j]) {
                    this.board[i][j] = new Tile(board[i][j].value);
                }
                else {
                    this.board[i][j] = null;
                }
            }
        }

        this.drawBoard();
    }

    /**
     * Resets board to the previous state and clears the previous state.
     */
    undoLastMove() {
        if (this.previousState) {
            this.board = this.copy2DArray(this.previousState);

            this.previousState = null;
            this.drawBoard();
        }
    }

    /**
     * Moves Tiles on the board, checks for availavble spaces and redraws canvas.
     * @param direction - Direction indicated by Controller.
     */
    moveTiles(direction) {
        this.previousState = this.copy2DArray(this.board);

        let tmpArray = this.getMovableArray(direction); // Gets array to movable positions
        let canSpawn = false;

        for (let i = 0; i < tmpArray.length; ++i) {
            let newArray = this.cleanUpLine(tmpArray[i]);

            if (!this.compareArrays(newArray, tmpArray[i])) {
                tmpArray[i] = newArray;
                canSpawn = true; // Only triggers when at least one row changes
            }
        }

        this.applyMovedArray(tmpArray, direction); // Returns array to normal position
        this.checkBoard(canSpawn);
        this.drawBoard();
    }

    /**
     * Renders the contents of the board into the Canvas HTML element.
     */
    drawBoard() {
        let margin = Math.round(32 / this.size);
        let tileSize = Math.round((this.width - margin * (this.size - 1)) / this.size);

        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

        let x = 0;
        let y = 0;

        for (let i = 0; i < this.size; ++i) {
            for (let j = 0; j < this.size; ++j) {

                if (this.board[i][j]) {
                    this.context.drawRoundedRect(x, y, tileSize, tileSize, this.board[i][j].color, this.size);
                    let limiter = 0;

                    if (this.board[i][j] > 8192) {
                        limiter = Math.log2(this.board[i][j].value) - Math.log2(8192);
                    }

                    this.context.font = Math.round(256 / this.size) + 'px Arial';
                    this.context.textAlign = 'center';
                    this.context.textBaseline = 'middle';
                    this.context.fillStyle = this.board[i][j].fontColor;
                    let textX = x + Math.round(tileSize / 2);

                    // Text does not feel centered without the 5 % of tileSize included
                    let textY = y + Math.round(tileSize / 2) + Math.round(tileSize * 0.05);

                    this.context.fillText(this.board[i][j].value, textX, textY);
                }
                else {
                    this.context.drawRoundedRect(x, y, tileSize, tileSize, 'rgba(238, 228, 218, 0.35)', this.size);
                }

                x += tileSize + margin;
            }

            x = 0;
            y += tileSize + margin;
        }
    }

    /**
     * Signalizes victory to Game module
     */
    dispatchVictory() {
        this.area.dispatchEvent(new Event('victory'));
    }

    /**
     * Spawns a new Tile on a random available space.
     * Has a chance to spawn a tile with value of 4.
     * @param availableSpaces - Array of available positions for new Tile
     */
    spawnTile(availableSpaces) {
        let position = Math.round(Math.random() * (availableSpaces.length - 1));
        let x = availableSpaces[position][0];
        let y = availableSpaces[position][1];

        let roll = Math.random();
        let value = 2;

        if (roll < this.chance) {
            value = 4;
        }

        this.board[x][y] = new Tile(value);
    }

    /**
     * Checks if it is still possible to continue playing.
     * Spawns a new Tile if enabled and available spaces exist.
     * @param canSpawn - Spawn enabler
     */
    checkBoard(canSpawn) {
        let availableSpaces = [];

        for (let j = 0; j < this.board.length; ++j) {
            for (let i = 0; i < this.board.length; ++i) {
                if (this.board[j][i] == null) {
                    availableSpaces.push([j, i]);
                }
            }
        }

        if (availableSpaces.length > 0 && canSpawn) {
            this.spawnTile(availableSpaces);
        }
        else if (availableSpaces.length == 0) {
            let canMove = false;

            for (let i = 0; i < this.size; ++i) {
                for (let j = 0; j < this.size - 1; ++j) {
                    if (this.board[i][j].value == this.board[i][j + 1].value) {
                        canMove = true;
                    }
                }
            }

            for (let i = 0; i < this.size - 1; ++i) {
                for (let j = 0; j < this.size; ++j) {
                    if (this.board[i][j].value == this.board[i + 1][j].value) {
                        canMove = true;
                    }
                }
            }

            if (!canMove) {
                this.area.dispatchEvent(new Event('gameOver'));
            }
        }
    }

    /**
     * Compares two arrays
     * @param first 
     * @param second 
     */
    compareArrays(first, second) {
        let result = true;

        for (let i = 0; i < first.length; i++) {
            if (first[i] != second[i]) {
                result = false;
            }
        }

        return result;
    }

    /**
     * Moves lines of array lines to the side and merges possible Tiles.
     * @param array - Array of arrays
     */
    cleanUpLine(array) {
        let cleanedLine = this.shiftLine(array); // Shifts lines to the side

        for (let i = 0; i < cleanedLine.length - 1; ++i) {
            if (cleanedLine[i] != null && cleanedLine[i + 1] != null) {
                if (cleanedLine[i].value == cleanedLine[i + 1].value) {
                    let victory = cleanedLine[i].merge() == Math.pow(2, (this.size * 3 - 1));

                    if (victory) {
                        this.dispatchVictory();
                    }

                    this.area.dispatchEvent(new CustomEvent('scoreUp', {
                        detail: {
                            'value': cleanedLine[i].value
                        }
                    }));

                    cleanedLine[i + 1] = null;
                }
            }
        }

        cleanedLine = this.shiftLine(cleanedLine); // Shifts to the side again to remove empty spaces between

        return cleanedLine;
    }

    /**
     * Shifts items in rows to a side and pads their end with null.
     * @param array - Array of arrays
     */
    shiftLine(array) {
        let shiftedLine = array.filter(tile => tile != null);

        for (let i = shiftedLine.length; i < array.length; ++i) {
            shiftedLine.push(null);
        }

        return shiftedLine;
    }

    /**
     * Returns an array of arrays to be cleaned up in specified direction.
     * @param direction - Direction of movement
     */
    getMovableArray(direction) {
        let result = [];

        switch (direction) {
            case 'left':
                this.board.forEach(row => result.push(row));
                break;
            case 'right':
                this.board.forEach(row => result.push(row.reverse()));
                break;
            case 'up':
                for (let i = 0; i < this.size; ++i) {
                    result[i] = [];

                    for (let j = 0; j < this.size; ++j) {
                        result[i].push(this.board[j][i]);
                    }
                }
                break;
            case 'down':
                for (let i = 0; i < this.size; ++i) {
                    result[i] = [];

                    for (let j = this.size - 1; j >= 0; --j) {
                        result[i].push(this.board[j][i]);
                    }
                }
                break;
        }

        return result;
    }

    /**
     * Applies moved array to board.
     * @param newArray - Array of arrays
     * @param direction - Direction of movement
     */
    applyMovedArray(newArray, direction) {
        switch (direction) {
            case 'left':
                for (let i = 0; i < newArray.length; ++i) {
                    this.board[i] = newArray[i];
                }
                break;
            case 'right':
                for (let i = 0; i < newArray.length; ++i) {
                    this.board[i] = newArray[i].reverse();
                }
                break;
            case 'up':
                for (let i = 0; i < newArray.length; ++i) {
                    let tmpArray = [];

                    for (let j = 0; j < newArray.length; ++j) {
                        tmpArray.push(newArray[j][i]);
                    }

                    this.board[i] = tmpArray;
                }
                break;
            case 'down':
                for (let i = 0; i < newArray.length; ++i) {
                    let tmpArray = [];

                    for (let j = 0; j < newArray.length; ++j) {
                        tmpArray.push(newArray[j][i]);
                    }

                    this.board[i] = tmpArray;
                }

                this.board.reverse();
                break;
        }
    }

    /**
     * Returns a copy of the board or previous state.
     * Tiles are recreated.
     * @param source - source 2D array
     */
    copy2DArray(source) {
        let result = [];

        for (let i = 0; i < source.length; ++i) {
            result[i] = [];

            for (let j = 0; j < source[i].length; ++j) {
                if (source[i][j]) {
                    result[i][j] = new Tile(source[i][j].value);
                }
                else {
                    result[i][j] = null;
                }
            }
        }

        return result;
    }
}

/**
 * Canvas 2D Context function to draw a rounded rectangle.
 * Heavily inspired by https://newfivefour.com/javascript-canvas-rounded-rectangle.html
 * @param x 
 * @param y 
 * @param width 
 * @param height 
 * @param fill - Color of the rectangle
 * @param size - Size of the board. Used to calculate rounded corner
 */
function drawRoundedRect(x, y, width, height, fill, size) {
    const halfCircle = (2 * Math.PI) / 2;
    const quarterCircle = (2 * Math.PI) / 4;
    const rounded = 32 / size;

    this.beginPath();

    // Left side
    this.arc(rounded + x, rounded + y, rounded, -quarterCircle, halfCircle, true);
    this.lineTo(x, y + height - rounded);
    this.arc(rounded + x, height - rounded + y, rounded, halfCircle, quarterCircle, true);

    // Bottom side
    this.lineTo(x + width - rounded, y + height);
    this.arc(x + width - rounded, y + height - rounded, rounded, quarterCircle, 0, true);

    // Right side
    this.lineTo(x + width, y + rounded);
    this.arc(x + width - rounded, y + rounded, rounded, 0, -quarterCircle, true);

    // Top side
    this.lineTo(x + rounded, y);

    this.closePath();

    this.fillStyle = fill;
    this.fill();
}