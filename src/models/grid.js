import Obstacle from './obstacle.js';
import Free from './free.js';
import Start from './start.js';
import Objective from './objective.js';
import Agent from './agent.js';
import Remote from './remote.js'


class Grid {
    constructor(size, cellSize) {
        this.size = size;
        this.cellSize = cellSize;
        this.grid = [];
        this.directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        this.cellStart = null;
        this.ants = [];
        this.startTime;
        this.timer;

        this.isRunning = false;

        this.createGrid();
    }

    bindDrawGrid(callback) {
        this.displayBackground = callback;
    }

    bindDrawFreeCube(callback) {
        this.displayFree = callback;
    }

    bindDrawSpecialCube(callback) {
        this.displaySpecialCube = callback;
    }

    bindDrawAnt(callback) {
        this.displayAnt = callback;
    }

    bindClearAntPath(callback) {
        this.clearAntPath = callback;
    }

    createGrid() {
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

        for (let nbAnt = 0; nbAnt < Remote.nbAnts; nbAnt++) { // on génère les fourmis
            this.ants.push(new Agent(this.cellStart.y, this.cellStart.x));
        }

        for (let i = 0; i < Math.floor(Math.random() * (Remote.nbAnts - 2)) + 10; i++) {
            let objectiveRow = Math.floor(Math.random() * (this.size - 2)) + 1;
            let objectiveCol = Math.floor(Math.random() * (this.size - 2)) + 1;
            if (this.grid[objectiveRow][objectiveCol] instanceof Obstacle || this.grid[objectiveRow][objectiveCol] instanceof Start) {
                i--;
            } else {
                let objective = new Objective(objectiveRow, objectiveCol);
                this.grid[objectiveRow][objectiveCol] = objective;
            }
        }

        // on supprime certains obstacles de façon aléatoire
        for (let index = 0; index < Math.random() * 8 + 12; index++) {
            let row = Math.floor(Math.random() * (this.size - 2)) + 1;
            let col = Math.floor(Math.random() * (this.size - 2)) + 1;
            if (this.grid[row][col].getType() == "Obstacle") {
                this.grid[row][col] = new Free(row, col);
            } else {
                index--;
            }
        }
    }

    getDrawingGrid() {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[0].length; j++) {

                let tiles = this.grid[i][j].getTile();

                let sx = this.grid[i][j].tileIndex[0];
                let sy = this.grid[i][j].tileIndex[1];
                let sWidth = this.grid[i][j].tileSize;
                let sHeight = this.grid[i][j].tileSize;
                let dx = j * this.cellSize;
                let dy = i * this.cellSize;

                let scale = 0.4;

                let dWidth = sWidth * scale;
                let dHeight = sHeight * scale;
                this.displayBackground(tiles, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
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

    static qtyMaxFromBegining = 0;

    getCubes() {
        let qtyMax = 0;
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[0].length; j++) {
                if (this.grid[i][j].getType() == "Free") {
                    if (this.grid[i][j]._qtyPheromonesFromBegining > qtyMax)
                        qtyMax = this.grid[i][j]._qtyPheromonesFromBegining;
                    this.displayFree(i, j, this.grid[i][j], Grid.qtyMaxFromBegining);
                    if (this.grid[i][j]._qtyPheromones > 0)
                        this.grid[i][j]._qtyPheromones -= 0.00001;

                } else if (this.grid[i][j].getType() == "Start" || this.grid[i][j].getType() == "Objective") {
                    this.displaySpecialCube(i, j, this.grid[i][j]);
                }
            }
        }
        for (let ant of this.ants) {
            this.displayAnt(ant)
        }
        if (qtyMax > Grid.qtyMaxFromBegining)
            Grid.qtyMaxFromBegining = qtyMax;
    }

    moveAnt(agent) {

        this.clearAntPath(agent.row, agent.column);
        let column = parseInt(agent.column);
        let row = parseInt(agent.row);

        if (agent.isAtTheCenterOfTheCell() || agent.direction == "null") {
            agent.direction = this.takeDirection(agent);
        }

        if (this.grid[column][row].getType() == "Start") {
            if (agent.capacity == 0) {
                for (const cell of agent.listOfPaths) {
                    if (cell.getType() == "Free") {
                        cell._qtyPheromones += (Remote._QParameter / agent.listOfPaths.length);
                        cell._qtyPheromonesFromBegining += (Remote._QParameter / agent.listOfPaths.length);
                    }
                }
            }
            agent.listOfPaths = [];
            agent.objective = null;
            agent.capacity = 0.1;
        }

        agent.move();
        agent.addToPathList(this.grid[column][row]);
    }

    takeDirection(agent) {
        let column = parseInt(agent.column);
        let row = parseInt(agent.row);
        let movePossibles = this.movePossibles(agent);

        let movePossiblesNotInPath = [];

        if (agent.capacity == 0) {
            agent.objective = agent.listOfPaths[agent.listOfPaths.indexOf(this.grid[column][row]) - 1];
            if (agent.objective != undefined && movePossibles.includes(agent.getDirectionFromObjective())) {
                if (agent.isDirectionInverse(agent.getDirectionFromObjective())) {
                    console.log("test");
                }
                return agent.getDirectionFromObjective();
            }
        }

        if (this.grid[column][row].getType() == "Objective") {
            agent.objective = agent.listOfPaths[agent.listOfPaths.indexOf(this.grid[column][row]) - 1];
            if (agent.objective == null)
                agent.objective = agent.listOfPaths[agent.listOfPaths.length - 1];

            this.grid[column][row]._qty -= 0.1;
            if (this.grid[column][row]._qty <= 0)
                this.grid[column][row] = new Free(column, row);

            agent.capacity = 0;
            return agent.getDirectionFromObjective();
        }

        if (movePossibles.length == 1) {
            return movePossibles[0];
        }

        if (agent.capacity > 0) {
            if (this.grid[column][row - 1].getType() == "Objective" && movePossibles.includes("up")) return "up";
            else if (this.grid[column][row + 1].getType() == "Objective" && movePossibles.includes("down")) return "down";
            else if (this.grid[column - 1][row].getType() == "Objective" && movePossibles.includes("left")) return "left";
            else if (this.grid[column + 1][row].getType() == "Objective" && movePossibles.includes("right")) return "right";
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

        if (movePossiblesNotInPath.length > 0 && Math.random() < 0.3) {
            return movePossiblesNotInPath[Math.floor(Math.random() * movePossiblesNotInPath.length)];
        }
        else {
            let maxPheromones = 0;
            let directionMaxPheromones;
            do {
                directionMaxPheromones = movePossibles[Math.floor(Math.random() * movePossibles.length)];
            } while (agent.isDirectionInverse(directionMaxPheromones));
            if (movePossibles.includes("up") && !agent.isDirectionInverse("up") && this.grid[column][row - 1]._qtyPheromones > maxPheromones) {
                maxPheromones = this.grid[column][row - 1]._qtyPheromones;
                directionMaxPheromones = "up";
            }
            if (movePossibles.includes("down") && !agent.isDirectionInverse("down") && this.grid[column][row + 1]._qtyPheromones > maxPheromones) {
                maxPheromones = this.grid[column][row + 1]._qtyPheromones;
                directionMaxPheromones = "down";
            }
            if (movePossibles.includes("left") && !agent.isDirectionInverse("left") && this.grid[column - 1][row]._qtyPheromones > maxPheromones) {
                maxPheromones = this.grid[column - 1][row]._qtyPheromones;
                directionMaxPheromones = "left";
            }
            if (movePossibles.includes("right") && !agent.isDirectionInverse("right") && this.grid[column + 1][row]._qtyPheromones > maxPheromones) {
                maxPheromones = this.grid[column + 1][row]._qtyPheromones;
                directionMaxPheromones = "right";
            }
            return directionMaxPheromones;
        }
    }

    movePossibles(agent) {
        let movePossibles = [];
        let column = parseInt(agent.column);
        let row = parseInt(agent.row);
        if (column < this.size - 1 && this.grid[column + 1][row].getType() != "Obstacle")
            movePossibles.push('right');
        if (column > 0 && this.grid[column - 1][row].getType() != "Obstacle")
            movePossibles.push('left');
        if (row < this.size - 1 && this.grid[column][row + 1].getType() != "Obstacle")
            movePossibles.push('down');
        if (row > 0 && this.grid[column][row - 1].getType() != "Obstacle")
            movePossibles.push('up');
        return movePossibles;
    }

    moveAnts() {
        for (let ant of this.ants)
            this.moveAnt(ant);
    }

    handleGame(state) {
        if (state == 'start') {
            this.startTime = Date.now();
            this.timer = 0;
            this.pauseTime = 0;
            this.isRunning = true;
            this.update();
        }
        else if (state == 'resume') {
            this.isRunning = true;
            this.startTime += Date.now() - this.pauseTime;
            this.update();
        } else if (state == 'pause') {
            this.isRunning = false;
            this.pauseTime = Date.now();
        } else if (state == 'stop') {
            this.isRunning = false;
            location.reload();
        }
    }

    update() {
        if (!this.isRunning) {
            return;
        }
        let _lag = 0;
        let currentTime = Date.now();
        let deltaTime = currentTime - this.startTime;
        _lag += deltaTime;
        this.startTime = currentTime;
        this.timer += deltaTime;

        while (_lag >= Remote._frameDuration) {
            this.moveAnts();
            this.getCubes();
            _lag -= Remote._frameDuration;
        }

        requestAnimationFrame(this.update.bind(this));
    }
}

export default Grid;
