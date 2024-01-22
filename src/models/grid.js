import Obstacle from './obstacle.js';
import Free from './free.js';
import Agent from './agent.js';

class Grid {

    static instance = null;

    constructor(size) {
        this.size = size;
        this.grid = [];
        this.directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    }

    static getInstance(size) {
        if (!Grid.instance) {
            Grid.instance = new Grid(size);
        }
        return Grid.instance;
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
    }

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
                    this.grid[row][col] = new Free(row + dx, col + dy);
                    if (Math.random() < 0.1) {
                        console.log("création d'une fourmie en " + row + " " + col);
                        let agent = new Agent(row, col);
                        this.grid[row][col].ants.push(agent);
                    }
                }
            }
        }
    }

    moveAnt(agent) {
        let _fps = 60; // Frame rate.
        let size = 18;
        let _speed = 1; // Nous voulons que 1 cellule (de notre grille) soit parcourue en 1 seconde (doit être dépendant des FPS fixés car la fonction est appelée à chaque frame). Notre unité de vitesse est donc "le nombre de cellules de la grille parcourues/seconde".
        let moveOK = false;
        let previousX = agent.column;
        let previousY = agent.row;
        let _cellSize = 40; // La taille d'une cellule en pixel.
        let canvas = document.getElementById('my_canvas');
        let ctx = canvas.getContext('2d');

        ctx.clearRect(previousY * _cellSize + 20, previousX * _cellSize + 20, 20, 20); // Efface le canvas.

        while (moveOK != true) {
            let whereIsNext;
            if (agent.direction == 'null') {
                whereIsNext = agent.moveRandomly();
            } else {
                whereIsNext = agent.direction;
            }
            let column = parseInt(agent.column);
            let row = parseInt(agent.row);
            if (whereIsNext === 'down' && row < size - 1) { // en vrai on va vers la droite jsp pk
                if (this.grid[column][row + 1].getType().toString() != "Obstacle") {
                    let _direction = 3 * (Math.PI / 2);
                    let dy = Math.sin(_direction) * -1;
                    agent.row += dy * _speed / _fps;
                    moveOK = true;
                    if (parseInt(agent.row) > row) {
                        // this.grid[x][y].ants.pop(agent);
                        // this.grid[x][y + 1].ants.push(agent);
                    }
                }
            }
            else if (whereIsNext === 'up' && row > 0) { // en vrai on va vers la gauche jsp pk
                if (this.grid[column][row - 1].getType().toString() != "Obstacle" || agent.row > parseInt(agent.row) + 0.3) { // la case du dessus est libre ou la fourmi est sur le bord de la grille
                    let _direction = Math.PI / 2;
                    let dy = Math.sin(_direction) * -1;
                    agent.row += dy * _speed / _fps;
                    moveOK = true;
                    if (parseInt(agent.row) < row) {
                        // this.grid[x][y].ants.pop(agent);
                        // this.grid[x][y - 1].ants.push(agent);
                    }
                }
            }
            else if (whereIsNext === 'right' && column < size - 1) { // en vrai on va vers le bas jsp pk
                if (this.grid[column + 1][row].getType().toString() != "Obstacle") {
                    let _direction = 0;
                    let dx = Math.cos(_direction);
                    agent.column += dx * _speed / _fps;
                    moveOK = true;
                    if (parseInt(agent.column) > column) {
                        // this.grid[x][y].ants.pop(agent);
                        // this.grid[x + 1][y].ants.push(agent);
                    }
                }
            }
            else if (whereIsNext === 'left' && column > 0) { // en vrai on va vers le haut jsp pk
                if (this.grid[column - 1][row].getType().toString() != "Obstacle" || agent.column > parseInt(agent.column) + 0.3) {
                    let _direction = Math.PI;
                    let dx = Math.cos(_direction);
                    agent.column += dx * _speed / _fps; // On divise par les fps car la fonction est appelée selon un fps donné (#cellGrid/seconde).
                    moveOK = true;
                    if (parseInt(agent.column) < column) {
                        // this.grid[x][y].ants.pop(agent);
                        // this.grid[x - 1][y].ants.push(agent);
                    }
                }
            }
            if (moveOK == false) {
                agent.direction = 'null';
            }
        }
    }

    moveAnts() {
        let movedAnts = new Set(); // Ajout d'un Set pour suivre les fourmis déplacées
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[0].length; j++) {
                if (this.grid[i][j].getType() == "Free") {
                    for (let ant of this.grid[i][j].ants) {
                        if (!movedAnts.has(ant)) {
                            this.moveAnt(ant);
                            movedAnts.add(ant);
                        }
                    }
                }
            }
        }
    }

    displayAnts() {
        console.log(this.grid);
        let canvas = document.getElementById('my_canvas');
        let ctx = canvas.getContext('2d');
        let _cellSize = 40; // La taille d'une cellule en pixel.
        let image = new Image();
        image.src = 'web/images/tiles/ant.png';
        // image.onload = () => {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[0].length; j++) {
                if (this.grid[i][j].getType()== "Free") {
                    for (let ant of this.grid[i][j].ants) {
                        let x = ant.column * _cellSize;
                        let y = ant.row * _cellSize;

                        // rotate the image of the ant according to its direction
                        ctx.save();

                        // Translate to the center of the image
                        ctx.translate(y + 30, x + 30);

                        // Rotate the image based on the ant's direction
                        ctx.rotate((ant.direction == 'up' ? 0 : ant.direction == 'right' ? Math.PI / 2 : ant.direction == 'down' ? Math.PI : 3 * Math.PI / 2));

                        // Draw the image
                        ctx.drawImage(image, -10, -10, 20, 20);

                        // Restore the original transformation matrix
                        ctx.restore();
                    }
                }
            }
            // }
        };
    }


}

export default Grid;
