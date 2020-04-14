export class Storage {
    constructor () {
        this.isUsable = this.checkAvailability();
    }

    /**
     * Turns off usage of localStorage if it is not available.
     */
    checkAvailability() {
        let result;
        let x = '__storage_test__';

        try {
            localStorage.setItem(x, x);
            localStorage.removeItem(x);

            result = true;
        }
        catch(e) {
            result = false;
        }

        return result;
    }

    /**
     * Stores game information to localStorage in JSON format.
     * @param board - Board with Tiles
     * @param score - Current score
     */
    storeBoard(board, score) {
        if (this.isUsable){
            let convertedBoard =  {
                'score': score,
                'board': board,
            };

            localStorage.setItem('board', JSON.stringify(convertedBoard));
        }
    }

    /**
     * Loads game information from localStorage.
     */
    loadBoard() {
        let result = null;

        if (this.isUsable) {
            let storedBoard = localStorage.getItem('board');

            result =  JSON.parse(storedBoard);
        }

        return result;
    }
}