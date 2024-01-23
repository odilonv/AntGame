import Obstacle from './obstacle.js';
import Free from './free.js';
import Agent from './agent.js';
import Game from './game.js';
import Start from './start.js';

class Grid {

    constructor(size) {
        this.size = size;
        this.grid = [];
        this.directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        this.cellStart = null;
    }

    drawGrid() {
        for (let i = 0; i < this.size; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.grid[i][j] = new Obstacle(i, j);
            }
        }

        let startRow = Math.floor(Math.random() * (this.size - 2)) + 1;
        let startCol = Math.floor(Math.random() * (this.size - 2)) + 1;
        this.createPath(startRow, startCol);

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (i === 0 || j === 0 || i === this.size - 1 || j === this.size - 1) {
                    this.grid[i][j] = new Obstacle(i, j);
                }
            }
        }
        this.grid[this.cellStart.x][this.cellStart.y] = this.cellStart;
    }

    static cellStartGenerated = false;

    createPath(row, col) {
        this.grid[row][col] = new Free(row, col);
        let shuffledDirections = this.directions.sort(() => Math.random() - 0.5);
        for (let [dx, dy] of shuffledDirections) {
            let newRow = row + 2 * dx;
            let newCol = col + 2 * dy;
            if (newRow >= 1 && newRow < this.size - 1 && newCol >= 1 && newCol < this.size - 1) {
                if (this.grid[newRow][newCol] instanceof Obstacle) {
                    this.grid[row + dx][col + dy] = new Free(row + dx, col + dy);
                    this.createPath(newRow, newCol);
                } else if (this.grid[newRow][newCol] instanceof Free) {
                    if (!Grid.cellStartGenerated) {
                        this.cellStart = new Start(col, row);
                        this.grid[row][col] = this.cellStart;
                        for (let nbAnt = 0; nbAnt < Game.nbAnts; nbAnt++) {
                            Game.getInstance().ants.push(new Agent(row + dx, col + dy));
                        }
                        Grid.cellStartGenerated = true;
                    } else {
                        this.grid[row][col] = new Free(row, col);
                    }
                }
            }
        }
    }

    moveAnt(agent) {
        let moveOK = false;
        let previousX = agent.column;
        let previousY = agent.row;

        Game.ctx.clearRect(previousY * Game._cellSize + 20, previousX * Game._cellSize + 20, 20, 20); // Efface le canvas.

        while (moveOK != true) {
            let whereIsNext;
            if (agent.direction == 'null') {
                whereIsNext = agent.moveRandomly();
            } else {
                whereIsNext = agent.direction;
            }
            let column = parseInt(agent.column);
            let row = parseInt(agent.row);
            if (this.grid[column][row].getType().toString() == "Start") {
                console.log(agent.listOfPaths);
                for (const cell of agent.listOfPaths) {
                    cell._qty = (1 / agent.listOfPaths.length).toFixed(2);
                }
            }
            if (whereIsNext === 'down' && row < Game.size - 1) { // en vrai on va vers la droite jsp pk
                if (this.grid[column][row + 1].getType().toString() != "Obstacle") {
                    agent.row += Math.sin(3 * (Math.PI / 2)) * -1 * Game._speed / Game._fps;
                    moveOK = true;
                }
            }
            else if (whereIsNext === 'up' && row > 0) { // en vrai on va vers la gauche jsp pk
                if (this.grid[column][row - 1].getType().toString() != "Obstacle" || agent.row > parseInt(agent.row) + 0.3) { // la case du dessus est libre ou la fourmi est sur le bord de la grille
                    agent.row += Math.sin(Math.PI / 2) * -1 * Game._speed / Game._fps;
                    moveOK = true;
                }
            }
            else if (whereIsNext === 'right' && column < Game.size - 1) { // en vrai on va vers le bas jsp pk
                if (this.grid[column + 1][row].getType().toString() != "Obstacle") {
                    agent.column += Math.cos(0) * Game._speed / Game._fps;
                    moveOK = true;
                }
            }
            else if (whereIsNext === 'left' && column > 0) { // en vrai on va vers le haut jsp pk
                if (this.grid[column - 1][row].getType().toString() != "Obstacle" || agent.column > parseInt(agent.column) + 0.3) {
                    agent.column += Math.cos(Math.PI) * Game._speed / Game._fps; // On divise par les fps car la fonction est appelée selon un fps donné (#cellGrid/seconde).
                    moveOK = true;
                }
            }
            if (moveOK == false) {
                agent.direction = 'null';
            } else {
                agent.addToPathList(this.grid[column][row]);
            }
        }
    }

    moveAnts() {
        let movedAnts = new Set(); // Ajout d'un Set pour suivre les fourmis déplacées
        for (let ant of Game.getInstance().ants) {
            this.moveAnt(ant);
            movedAnts.add(ant);
        }
    }

    displayAnts() {
        let image = new Image();
        image.src = 'web/images/tiles/ant.png';
        // image.onload = () => {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[0].length; j++) {
                if (this.grid[i][j].getType() == "Free") {
                    let ctx = Game.ctx;
                    ctx.font = "10px Arial";
                    ctx.fillStyle = "white";
                    let value = this.grid[i][j]._qty;
                    ctx.fillText(value.toString(), j * Game._cellSize + 30, i * Game._cellSize + 30);
                }
            }
            // }
        }

        for (let ant of Game.getInstance().ants) {
            let x = ant.column * Game._cellSize;
            let y = ant.row * Game._cellSize;
            Game.ctx.save();
            Game.ctx.translate(y + 30, x + 30);
            Game.ctx.rotate((ant.direction == 'up' ? 0 : ant.direction == 'right' ? Math.PI / 2 : ant.direction == 'down' ? Math.PI : 3 * Math.PI / 2));
            Game.ctx.drawImage(image, -10, -10, 20, 20);
            Game.ctx.restore();
        }
    }
}

export default Grid;
