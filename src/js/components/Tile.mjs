export class Tile {
    constructor(value) {
        this.colors = {
            2: "#eee4da",
            4: "#ede0c8",
            8: "#f2b179",
            16: "#f59563",
            32: "#f67c5f",
            64: "#f65e3b",
            128: "#edcf72",
            256: "#edcc61",
            512: "#edc850",
            1024: "#edc53f",
            2048: "#edc53f",
        };

        this.value = value;
        this.fontHeight = 80;
        this.color = this.colors[this.value];
        this.fontColor = 'black';
    }

    merge() {
        this.value *= 2;
        this.color = this.colors[this.value];

        return this.value;
    }

    toString() {
        return this.value.toString();
    }
}