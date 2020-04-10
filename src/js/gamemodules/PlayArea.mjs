import { Tile } from './Tile.mjs';

export class PlayArea {
    constructor(area) {
        this.chance = 0.1;
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
            this.board[i].fill(null);
        }

        this.checkBoard(true);
        this.checkBoard(true);
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

    checkBoard(canSpawn) {
        let availableSpaces = [];

        for (let j = 0; j < this.board.length; ++j) {
            for (let i = 0; i < this.board.length; ++i) {
                if (this.board[j][i] == null) {
                    availableSpaces.push([j, i]);
                }
            }
        }

        if (availableSpaces.length > 0) {
            if (canSpawn) {
                this.spawnTile(availableSpaces);
            }
        }
        else {
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

    moveTiles(direction) {
        let tmpArray = this.getMovableArray(direction);
        let canSpawn = false;

        for (let i = 0; i < tmpArray.length; ++i) {
            let newArray = this.cleanUpLine(tmpArray[i]);

            if (!this.compareArrays(newArray, tmpArray[i])) {
                tmpArray[i] = newArray;
                canSpawn = true;
            }
        }
        
        this.applyMovedArray(tmpArray, direction);
        this.checkBoard(canSpawn);
        this.drawBoard();
    }

    compareArrays(first, second) {
        let result = true;

        for (let i = 0; i < first.length; i++) {
            if (first[i] != second[i]) {
                result = false;
            }
        }

        return result;
    }

    cleanUpLine(array) {
        let cleanedLine = this.shiftLine(array);

        for (let i = 0; i < cleanedLine.length - 1; ++i) {
            if (cleanedLine[i] != null && cleanedLine[i + 1] != null) {
                if (cleanedLine[i].value == cleanedLine[i + 1].value) {
                    cleanedLine[i].merge();

                    this.area.dispatchEvent(new CustomEvent('scoreUp', {
                        detail: {
                            'value': cleanedLine[i].value
                        }
                    }));
                    
                    cleanedLine[i + 1] = null;
                }
            }
        }

        cleanedLine = this.shiftLine(cleanedLine);

        return cleanedLine;
    }

    shiftLine(array) {
        let shiftedLine = array.filter(tile => tile != null);

        for (let i = shiftedLine.length; i < array.length; ++i) {
            shiftedLine.push(null);
        }

        return shiftedLine;
    }
    
    getMovableArray(direction) {
        let result = [];

        switch(direction) {
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