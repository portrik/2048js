import { PlayArea } from './PlayArea.mjs';

export class Game {
    constructor() {
        this.score = 0;
        this.size = 4;
    }

    setPlayArea(playArea) {
        this.playArea = new PlayArea(playArea);
        this.playArea.setUp(this.size);
    }
}