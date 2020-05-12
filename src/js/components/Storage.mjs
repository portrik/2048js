export class Storage {
    constructor() {
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
        catch (e) {
            result = false;
        }

        return result;
    }

    /**
     * Saves an item in the local storage.
     * 
     * @param name - Name of the item
     * @param value - Value of the item
     */
    storeItem(name, value) {
        if (this.isUsable) {
            localStorage.setItem(name, JSON.stringify(value));
        }
    }

    /**
     * Loads an item from the local storage.
     * 
     * @param name - Name of the item
     */
    loadItem(name) {
        let result = null;

        if (this.isUsable) {
            let storedBoard = localStorage.getItem(name);

            result = JSON.parse(storedBoard);
        }

        return result;
    }

    /**
     * Removes an item from the local storage.
     * 
     * @param name - Name of the item
     */
    removeItem(name) {
        if (this.isUsable) {
            localStorage.removeItem(name);
        }
    }
}