import { Tile } from './Tile.mjs';

export class PlayArea {
    constructor(area) {
        this.chance = 0.1;
        this.area = area;
        this.resizeArea();
        this.size = 0;
        this.board = [];
        this.previousState = null;

        // Resizes the game area at every window resize
        window.addEventListener('resize', () => this.resizeArea());
    }

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
            this.board[i].fill(null);
        }

        this.checkBoard(true);
        this.checkBoard(true);
        this.drawBoard();
    }

    undoLastMove() {
        if (this.previousState) {
            this.board = this.copy2DArray(this.previousState);

            this.previousState = null;
            this.drawBoard();
        }
    }

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

    // TODO: Make margin of sides fixed value 
    drawBoard() {
        let tileSize = Math.round(this.width / (this.size + 1));
        let margin = Math.round(tileSize / (this.size + 1));

        let context = this.area.getContext('2d');
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);

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

    /**
     * Signalizes victory to Game module
     */
    dispatchVictory() {
        this.area.dispatchEvent(new Event('victory'));
    }

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
     * Checks if it is still possible to play on.
     * Spawns new Tile if enabled and available spaces exist.
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

            for (let i = 0; i < this.size - 1; ++i) {
                for (let j = 0; j < this.size - 1; ++j) {
                    if (this.board[i][j].value == this.board[i + 1][j].value) {
                        canMove = true;
                    }

                    if (this.board[i][j].value == this.board[i][j + 1].value) {
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
                    let victory = cleanedLine[i].merge();

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
}