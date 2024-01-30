import Obstacle from './obstacle.js';
import Free from './free.js';
import Start from './start.js';
import Objective from './objective.js';
import Agent from './agent.js';
import Game from './game.js'


class Grid {
    constructor(size, cellSize) {
        this.size = size;
        this.cellSize = cellSize;
        this.grid = [];
        this.directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        this.cellStart = null;
        this.nbAnts = 4;
        this.ants = [];
        this.startTime = Date.now();
        this.timer = 0;

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

        for (let nbAnt = 0; nbAnt < this.nbAnts; nbAnt++) { // on génère les fourmis
            this.ants.push(new Agent(this.cellStart.y, this.cellStart.x));
        }

        for (let i = 0; i < Math.floor(Math.random() * (this.nbAnts - 2)) + 3; i++) {
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
        for (let index = 0; index < Math.random() * 8 + 2; index++) {
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

    getCubes() {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[0].length; j++) {
                if (this.grid[i][j].getType() == "Free") {
                    this.displayFree(i, j, this.grid[i][j]);
                } else if (this.grid[i][j].getType() == "Start" || this.grid[i][j].getType() == "Objective") {
                    this.displaySpecialCube(i, j, this.grid[i][j]);
                }
            }
            for (let ant of this.ants) {
                let x = ant.column * this.cellSize;
                let y = ant.row * this.cellSize;
                this.displayAnt(x, y, ant.direction)
            }
        }
    }

    moveAnt(agent) {
        let previousX = agent.column;
        let previousY = agent.row;

        this.clearAntPath(previousY, previousX);

        let column = parseInt(agent.column);
        let row = parseInt(agent.row);


        if (agent.isAtTheCenterOfTheCell() || agent.direction == "null") {
            console.log('pass');
            agent.direction = this.takeDirection(agent);

        }



        if (this.grid[column][row].getType() == "Start") {
            for (const cell of agent.listOfPaths)
                if (cell.getType() == "Free")
                    cell._qty += (1 / agent.listOfPaths.length);

            agent.listOfPaths = [];
            agent.objective = null;
            agent.capacity = 0.1;
        }

        if (agent.direction === 'down') {
            agent.row += Math.sin(3 * (Math.PI / 2)) * -1 * Game._speed / Game._fps;
        }
        else if (agent.direction === 'up') {
            agent.row += Math.sin(Math.PI / 2) * -1 * Game._speed / Game._fps;
        }
        else if (agent.direction === 'right') {
            agent.column += Math.cos(0) * Game._speed / Game._fps;
        }
        else if (agent.direction === 'left') {
            agent.column += Math.cos(Math.PI) * Game._speed / Game._fps; // On divise par les fps car la fonction est appelée selon un fps donné (#cellGrid/seconde).
        }

        agent.addToPathList(this.grid[column][row]);
    }

    takeDirection(agent) {
        let column = parseInt(agent.column);
        let row = parseInt(agent.row);
        let movePossibles = this.movePossibles(agent);

        console.log(movePossibles);
        let movePossiblesNotInPath = [];

        if (agent.capacity == 0) {
            agent.objective = agent.listOfPaths[agent.listOfPaths.indexOf(this.grid[column][row]) - 1];
            return agent.getDirectionFromObjective();
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
        let movedAnts = new Set();
        for (let ant of this.ants) {
            this.moveAnt(ant);
            movedAnts.add(ant);
        }
    }


    update() {
        let _lag = 0;
        let _fps = 60; // Frame rate.
        let _frameDuration = 1000 / _fps;
        let currentTime = Date.now();
        let deltaTime = currentTime - this.startTime;
        _lag += deltaTime;
        this.startTime = currentTime;
        this.timer += deltaTime;


        while (_lag >= _frameDuration) {
            this.moveAnts();
            this.getCubes();
            _lag -= _frameDuration;
        }
        requestAnimationFrame(this.update.bind(this));
    }



}

export default Grid;
