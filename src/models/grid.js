import Cell from './cell.js';
import Obstacle from './obstacle.js';

class Grid {
    constructor(size) {
        this.size = size;
        this.grid = [];
    }

    drawGrid() {
        for (let i = 0; i < this.size; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.size; j++) {
                // Check if the cell is on the edge of the grid
                if (i === 0 || i === this.size - 1 || j === 0 || j === this.size - 1) {
                    this.grid[i][j] = new Obstacle(i, j);
                } else {
                    this.grid[i][j] = new Cell(i, j);
                }
            }
        }
    }
}

export default Grid;