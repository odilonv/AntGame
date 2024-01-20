import Cell from './cell.js';
import Obstacle from './obstacle.js';
import Free from './free.js';
import Agent from './agent.js';

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
                    this.grid[i][j] = new Free(i, j);
                    if (Math.random() < 0.05) {
                        let agent = new Agent(i, j);
                        setInterval(() => {
                            let whereIsNext = agent.moveRandomly();
                            if (whereIsNext === 'right') {
                                this.grid[i][j].ants.pop(agent);
                                if (j + 1 < this.size)
                                    this.grid[i][j + 1].ants.push(agent);
                            }
                            if (whereIsNext === 'left') {
                                this.grid[i][j].ants.pop(agent);
                                if (j - 1 > 0)
                                    this.grid[i][j - 1].ants.push(agent);
                            }
                            if (whereIsNext === 'down') {
                                this.grid[i][j].ants.pop(agent);
                                if (i + 1 < this.size)
                                    this.grid[i + 1][j].ants.push(agent);
                            }
                            if (whereIsNext === 'up') {
                                this.grid[i][j].ants.pop(agent);
                                if (i - 1 > 0)
                                    this.grid[i - 1][j].ants.push(agent);
                            }
                        }, 20);
                        this.grid[i][j].ants.push(agent);

                    }
                }
            }
        }
    }
}

export default Grid;