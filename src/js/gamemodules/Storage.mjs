export class Storage {
    constructor () {
        this.isUsable = this.checkAvailability();
    }

    checkAvailability() {
        let storage;
        let result;

        try {
            let x = '__storage_test__';
            localStorage.setItem(x, x);
            localStorage.removeItem(x);

            result = true;
        }
        catch(e) {
            result = false;
        }

        return result;
    }

    storeBoard(board, score) {
        if (this.isUsable){
            let convertedBoard =  {
                'score': score,
                'board': board,
            };

            localStorage.setItem('board', JSON.stringify(convertedBoard));
        }
    }

    loadBoard() {
        if (this.isUsable) {
            let storedBoard = localStorage.getItem('board');

            return storedBoard;
        }
    }
}