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
        let previousX = agent.x;
        let previousY = agent.y;
        let _cellSize = 40; // La taille d'une cellule en pixel.
        let canvas = document.getElementById('my_canvas');
        let ctx = canvas.getContext('2d');

        // ctx.clearRect(previousY * _cellSize, previousX * _cellSize, 20, 20); // Efface le canvas.

        while (moveOK != true) {
            let whereIsNext;
            if (agent.direction == 'null') {
                whereIsNext = agent.moveRandomly();
            } else {
                whereIsNext = agent.direction;
            }
            let x = parseInt(agent.x);
            let y = parseInt(agent.y);
            if (whereIsNext === 'down' && y < size - 1) {
                if (this.grid[x][y + 1].getType() != "Obstacle") {
                    // this.grid[x][y].ants.pop(agent);
                    // this.grid[x][y + 1].ants.push(agent);
                    let _direction = 3 * (Math.PI / 2);
                    let dx = Math.cos(_direction); // cos(0) = 1 ; cos(pi) = -1 ; cos(pi/2) = 0.
                    let dy = Math.sin(_direction) * -1; // sin(0) = 0 ; sin(pi) = 0 ; sin(pi/2) = 1 ; -1 car canvas inverse l'axe Y.
                    /* Multiplier la direction par la vitesse */
                    // console.log("on descend de "+ dy * _speed / _fps + "px");
                    agent.x += dx * _speed / _fps; // On divise par les fps car la fonction est appelée selon un fps donné (#cellGrid/seconde).
                    agent.y += dy * _speed / _fps;
                    moveOK = true;
                    // if (y > parseInt(agent.y)) {
                    //     this.grid[x][y].ants.pop(agent);
                    //     this.grid[x][y + 1].ants.push(agent);
                    // }
                }
            }
            else if (whereIsNext === 'up' && y > 0) {
                if (this.grid[x][y - 1].getType() != "Obstacle") {
                    // this.grid[x][y].ants.pop(agent);
                    // this.grid[x][y - 1].ants.push(agent);
                    let _direction = Math.PI / 2;
                    let dx = Math.cos(_direction); // cos(0) = 1 ; cos(pi) = -1 ; cos(pi/2) = 0.
                    let dy = Math.sin(_direction) * -1; // sin(0) = 0 ; sin(pi) = 0 ; sin(pi/2) = 1 ; -1 car canvas inverse l'axe Y.
                    /* Multiplier la direction par la vitesse */
                    agent.x += dx * _speed / _fps; // On divise par les fps car la fonction est appelée selon un fps donné (#cellGrid/seconde).
                    agent.y += dy * _speed / _fps;
                    moveOK = true;
                    // if (y < parseInt(agent.y)) {
                    //     this.grid[x][y].ants.pop(agent);
                    //     this.grid[x][y - 1].ants.push(agent);
                    // }
                }
            }
            else if (whereIsNext === 'right' && x < size - 1) {
                if (this.grid[x + 1][y].getType() != "Obstacle") {
                    // this.grid[x][y].ants.pop(agent);
                    // this.grid[x + 1][y].ants.push(agent);
                    let _direction = 0;
                    let dx = Math.cos(_direction); // cos(0) = 1 ; cos(pi) = -1 ; cos(pi/2) = 0.
                    let dy = Math.sin(_direction) * -1; // sin(0) = 0 ; sin(pi) = 0 ; sin(pi/2) = 1 ; -1 car canvas inverse l'axe Y.
                    /* Multiplier la direction par la vitesse */
                    agent.x += dx * _speed / _fps; // On divise par les fps car la fonction est appelée selon un fps donné (#cellGrid/seconde).
                    agent.y += dy * _speed / _fps;
                    moveOK = true;
                    // if (x < parseInt(agent.x)) {
                    //     this.grid[x][y].ants.pop(agent);
                    //     this.grid[x + 1][y].ants.push(agent);
                    // }
                }
            }
            else if (whereIsNext === 'left' && x > 0) {
                if (this.grid[x - 1][y].getType() != "Obstacle") {
                    // this.grid[x][y].ants.pop(agent);
                    // this.grid[x - 1][y].ants.push(agent);
                    let _direction = Math.PI;
                    let dx = Math.cos(_direction); // cos(0) = 1 ; cos(pi) = -1 ; cos(pi/2) = 0.
                    let dy = Math.sin(_direction) * -1; // sin(0) = 0 ; sin(pi) = 0 ; sin(pi/2) = 1 ; -1 car canvas inverse l'axe Y.
                    agent.x += dx * _speed / _fps; // On divise par les fps car la fonction est appelée selon un fps donné (#cellGrid/seconde).
                    agent.y += dy * _speed / _fps;
                    moveOK = true;
                    // if (x > parseInt(agent.x)) {
                    //     this.grid[x][y].ants.pop(agent);
                    //     this.grid[x - 1][y].ants.push(agent);
                    // }
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
                        let x = ant.x * _cellSize;
                        let y = ant.y * _cellSize;

                        if (ant.direction == 'down') {
                        } else if (ant.direction == 'up') {
                        } else if (ant.direction == 'right') {
                        } else if (ant.direction == 'left') {
                        }
                        
                        ctx.drawImage(image, y + 20, x + 20, 20, 20);
                    }
                }
            }
            // }
        };
    }


}

export default Grid;
