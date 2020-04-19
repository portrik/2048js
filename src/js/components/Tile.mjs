const colors = [
    "#eee4da",
    "#ede0c8",
    "#f2b179",
    "#f59563",
    "#f67c5f",
    "#f65e3b",
    "#edcf72",
    "#edcc61",
    "#edc850",
    "#edc53f",
    "#edc53f",
];

const whiteContrast = (299 * 255 + 587 * 255 + 114 * 255) / 1000;
const blackContrast = 0;

export class Tile {
    constructor(value) {
        this.value = value;
        this.color = colors[(Math.log2(this.value) - 1) % 12];
        this.fontColor = 'black';
        this.setFontColor();
    }

    /**
     * Updates the value, sets a new color and checks for font color.
     * Returns new value for checking of victory.
     */
    merge() {
        this.value *= 2;
        this.color = colors[(Math.log2(this.value) - 1) % 12];
        this.setFontColor();

        return this.value;
    }

    /**
     * Checks whether white or black font have better contrast with background color.
     */
    setFontColor() {
        let r = parseInt(this.color[1] + this.color[2]);
        let g = parseInt(this.color[3] + this.color[4]);
        let b = parseInt(this.color[5] + this.color[6]);

        let contrast = (299 * r + 587 * g + 114 * b) / 1000;

        if (Math.abs(whiteContrast - contrast) > (Math.abs(blackContrast - contrast))) {
            this.fontColor = 'white';
        }
        else {
            this.fontColor = 'black';
        }
    }
}