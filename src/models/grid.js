class Grid {
    constructor(size) {
        this.size = size;
        this.grid = [];
    }

    drawGrid() {
        for (let i = 0; i < this.size; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.grid[i][j] = 0;
            }
        }
        return this.grid;
    }
}

export default Grid;