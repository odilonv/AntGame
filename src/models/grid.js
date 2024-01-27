import Obstacle from './obstacle.js';
import Free from './free.js';
import Agent from './agent.js';
import Game from './game.js';
import Start from './start.js';
import Objective from './objective.js';

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
            for (let j = 0; j < this.size; j++)
                this.grid[i][j] = new Obstacle(i, j);
        }


        let startRow = Math.floor(Math.random() * (this.size - 2)) + 1;
        let startCol = Math.floor(Math.random() * (this.size - 2)) + 1;
        this.createPath(startRow, startCol);

        for (let i = 0; i < this.size; i++)
            for (let j = 0; j < this.size; j++)
                if (i === 0 || j === 0 || i === this.size - 1 || j === this.size - 1)
                    this.grid[i][j] = new Obstacle(i, j);



        do // On place la fourmilière sur une case libre
            this.cellStart = new Start(Math.floor(Math.random() * (this.size - 2)) + 1, Math.floor(Math.random() * (this.size - 2)) + 1);
        while (this.grid[this.cellStart.x][this.cellStart.y] instanceof Obstacle);
        this.grid[this.cellStart.x][this.cellStart.y] = this.cellStart;

        for (let nbAnt = 0; nbAnt < Game.nbAnts; nbAnt++) { // on génère les fourmis
            Game.getInstance().ants.push(new Agent(this.cellStart.y, this.cellStart.x));
        }

        for (let i = 0; i < Math.floor(Math.random() * (Game.nbAnts - 2)) + 3; i++) {
            let objectiveRow = Math.floor(Math.random() * (this.size - 2)) + 1;
            let objectiveCol = Math.floor(Math.random() * (this.size - 2)) + 1;
            if (this.grid[objectiveRow][objectiveCol] instanceof Obstacle || this.grid[objectiveRow][objectiveCol] instanceof Start) {
                i--;
            } else {
                let objective = new Objective(objectiveRow, objectiveCol);
                this.grid[objectiveRow][objectiveCol] = objective;
            }
        }
    }

    static objectiveCellsCpt = 0;

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

        if (agent.isAtTheCenterOfTheCell() || agent.direction == "null")
            agent.direction = this.takeDirection(agent);

        if (this.grid[column][row].getType().toString() == "Start") {
            for (const cell of agent.listOfPaths)
                if (cell.getType().toString() == "Free")
                    cell._qty += (1 / agent.listOfPaths.length);

            agent.listOfPaths = [];
            agent.objective = null;
            agent.capacity = 0.1;
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
        let movePossiblesNotInPath = [];

        if (agent.capacity == 0) {
            agent.objective = agent.listOfPaths[agent.listOfPaths.indexOf(this.grid[column][row]) - 1];
            return agent.getDirectionFromObjective();
        }

        if (this.grid[column][row].getType().toString() == "Objective") {
            agent.objective = agent.listOfPaths[agent.listOfPaths.indexOf(this.grid[column][row]) - 1];
            if (agent.objective == null) {
                agent.objective = agent.listOfPaths[agent.listOfPaths.length - 1];
            }
            this.grid[column][row]._qty -= 0.1;
            if (this.grid[column][row]._qty <= 0)
                this.grid[column][row] = new Free(column, row);

            agent.capacity = 0;
            console.log(agent.listOfPaths);
            console.log();
            console.log("Objective reached : " + agent.objective);
            return agent.getDirectionFromObjective();
        }

        if (movePossibles.length == 1) {
            return movePossibles[0];
        }
        if (movePossibles.includes("up") && !agent.listOfPaths.includes(this.grid[column][row - 1])) {
            movePossiblesNotInPath.push("up");
        }
        if (movePossibles.includes("down") && !agent.listOfPaths.includes(this.grid[column][row + 1])) {
            movePossiblesNotInPath.push("down");
        }
        if (movePossibles.includes("left") && !agent.listOfPaths.includes(this.grid[column - 1][row])) {
            movePossiblesNotInPath.push("left");
        }
        if (movePossibles.includes("right") && !agent.listOfPaths.includes(this.grid[column + 1][row])) {
            movePossiblesNotInPath.push("right");
        }

        if (movePossiblesNotInPath.length > 0) {
            return movePossiblesNotInPath[Math.floor(Math.random() * movePossiblesNotInPath.length)];
        }

        if (agent.objective != null && movePossibles.includes(agent.getDirectionFromObjective())) {
            agent.objective = agent.listOfPaths[agent.listOfPaths.indexOf(this.grid[column][row]) - 1];
            return agent.getDirectionFromObjective();
        }
        if (!movePossibles.includes(agent.direction)) {
            agent.objective = agent.listOfPaths[agent.listOfPaths.indexOf(this.grid[column][row]) - 1];
            return this.takeDirection(agent);
        }
        return agent.direction;
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

                    let value = this.grid[i][j]._qty;
                    ctx.font = "10px Arial";

                    // couleur blanche pour 0, d0c087 jusqu'à 0.02, 94ae8f jusqu'à 0.04,  79bc79 jusqu'à 0.06, b98d0d > 0.6 
                    if (value == 0)
                        ctx.fillStyle = "#ffffff";
                    else if (value < 0.02)
                        ctx.fillStyle = "#d0c087";
                    else if (value < 0.04)
                        ctx.fillStyle = "#94ae8f";
                    else if (value < 0.06)
                        ctx.fillStyle = "#79bc79";
                    else
                        ctx.fillStyle = "#b98d0d";


                    ctx.clearRect(j * Game._cellSize + 20, i * Game._cellSize + 20, 30, 20); // Efface le canvas.

                    ctx.drawImage(this.grid[i][j].getTile(), this.grid[i][j].tileIndex[0], this.grid[i][j].tileIndex[1], this.grid[i][j].tileSize, this.grid[i][j].tileSize, j * Game._cellSize + 20, i * Game._cellSize + 20, 30, 30);

                    ctx.fillText(value.toFixed(2), j * Game._cellSize + 23, i * Game._cellSize + 40);
                } else if (this.grid[i][j].getType() == "Start") {
                    let ctx = Game.ctx;
                    ctx.clearRect(j * Game._cellSize + 20, i * Game._cellSize + 20, 30, 20); // Efface le canvas.
                    ctx.drawImage(this.grid[i][j].getTile(), this.grid[i][j].tileIndex[0], this.grid[i][j].tileIndex[1], this.grid[i][j].tileSize, this.grid[i][j].tileSize, j * Game._cellSize + 20, i * Game._cellSize + 20, 30, 30);
                } else if (this.grid[i][j].getType() == "Objective") {
                    let ctx = Game.ctx;
                    ctx.clearRect(j * Game._cellSize + 20, i * Game._cellSize + 20, 30, 20); // Efface le canvas.
                    ctx.drawImage(this.grid[i][j].getTile(), this.grid[i][j].tileIndex[0], this.grid[i][j].tileIndex[1], this.grid[i][j].tileSize, this.grid[i][j].tileSize, j * Game._cellSize + 20, i * Game._cellSize + 20, 30, 30);
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
