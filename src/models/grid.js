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
                    } else
                        this.grid[row][col] = new Free(row, col);
                }
            }
        }
    }

    moveAnt(agent) {
        let previousX = agent.column;
        let previousY = agent.row;

        Game.ctx.clearRect(previousY * Game._cellSize + 20, previousX * Game._cellSize + 20, 20, 20); // Efface le canvas.

        let column = parseInt(agent.column);
        let row = parseInt(agent.row);

        if (this.isAtTheCenterOfTheCell(agent) || agent.direction == "null") {
            agent.direction = this.takeDirection(agent);
        }

        if (this.grid[column][row].getType().toString() == "Start")
            for (const cell of agent.listOfPaths) {
                cell._qty = (1 / agent.listOfPaths.length).toFixed(2);
            }

        if (agent.direction === 'down') {
            agent.row += Math.sin(3 * (Math.PI / 2)) * -1 * Game._speed / Game._fps;
        }   // en vrai on va vers la droite jsp pk
        else if (agent.direction === 'up') {
            agent.row += Math.sin(Math.PI / 2) * -1 * Game._speed / Game._fps;
        }   // en vrai on va vers la gauche jsp pk
        else if (agent.direction === 'right') {
            agent.column += Math.cos(0) * Game._speed / Game._fps;
        }   // en vrai on va vers le bas jsp pk
        else if (agent.direction === 'left') {
            agent.column += Math.cos(Math.PI) * Game._speed / Game._fps; // On divise par les fps car la fonction est appelée selon un fps donné (#cellGrid/seconde).
        }   // en vrai on va vers le haut jsp pk

        agent.addToPathList(this.grid[column][row]);
    }

    takeDirection(agent) {
        let column = parseInt(agent.column);
        let row = parseInt(agent.row);
        let movePossibles = this.movePossibles(agent);
        for (const movePossible of movePossibles) {
            if (movePossible == "up" && !agent.listOfPaths.includes(this.grid[column][row - 1])) {
                return movePossible;
            }
            else if (movePossible == "down" && !agent.listOfPaths.includes(this.grid[column][row + 1])) {
                return movePossible;
            }
            else if (movePossible == "left" && !agent.listOfPaths.includes(this.grid[column - 1][row])) {
                console.log("la case de haut est libre !");
                return movePossible;
            }
            else if (movePossible == "right" && !agent.listOfPaths.includes(this.grid[column + 1][row])) {
                return movePossible;
            }
        }
        if (!movePossibles.includes(agent.direction)) {
            return movePossibles[0];
        }
        return agent.direction;
    }

    isAtTheCenterOfTheCell(agent) {
        if ((agent.direction == "up" && agent.row - parseInt(agent.row) > 0.1 && agent.row - parseInt(agent.row) + Math.sin(Math.PI / 2) * -1 * Game._speed / Game._fps < 0.1)) {
            return true;
        } else if (agent.direction == "down" && agent.row - parseInt(agent.row) < 0.1 && agent.row - parseInt(agent.row) + Math.sin(3 * (Math.PI / 2)) * -1 * Game._speed / Game._fps > 0.1) {
            return true
        } else if (agent.direction == "left" && agent.column - parseInt(agent.column) > 0.1 && agent.column - parseInt(agent.column) + Math.cos(Math.PI) * Game._speed / Game._fps < 0.1) {
            return true
        } else if (agent.direction == "right" && agent.column - parseInt(agent.column) < 0.1 && agent.column - parseInt(agent.column) + Math.cos(0) * Game._speed / Game._fps > 0.1) {
            return true
        }
        return false;
    }


    movePossibles(agent) {
        let movePossibles = [];
        let column = parseInt(agent.column);
        let row = parseInt(agent.row);
        if (column < Game.size - 1 && this.grid[column + 1][row].getType() != "Obstacle")
            movePossibles.push('right');
        if (column > 0 && this.grid[column - 1][row].getType() != "Obstacle")
            movePossibles.push('left');
        if (row < Game.size - 1 && this.grid[column][row + 1].getType() != "Obstacle")
            movePossibles.push('down');
        if (row > 0 && this.grid[column][row - 1].getType() != "Obstacle")
            movePossibles.push('up');
        return movePossibles;
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
