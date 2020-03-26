export class Tile {
    constructor(value, color) {
        this.value = value;
        this.color = color;
    }

    merge(newColor) {
        this.value *= 2;
        this.color = newColor;
    }
}