import Game from './game.js';

class Agent {
    constructor(row, column) {
        this.row = row;
        this.column = column;
        this.direction = 'null';
        this.listOfPaths = []; // Liste des chemins parcourus par la fourmi.
        this.objective = null; // Indice de listOfPaths qui correspond à la cellule objectif.
    }

    moveRandomly() {
        const directions = ['up', 'down', 'left', 'right'];
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        this.direction = randomDirection;
        return this.direction;
    }

    Move(durationFrame) {
        // let _direction = 0; // En radian.
        // let _speed = 1; // Nous voulons que 1 cellule (de notre grille) soit parcourue en 1 seconde (doit être dépendant des FPS fixés car la fonction est appelée à chaque frame). Notre unité de vitesse est donc "le nombre de cellules de la grille parcourues/seconde".
        // let _fps = 60; // Frame rate.

        // let dx = Math.cos(_direction); // cos(0) = 1 ; cos(pi) = -1 ; cos(pi/2) = 0.
        // let dy = Math.sin(_direction) * -1; // sin(0) = 0 ; sin(pi) = 0 ; sin(pi/2) = 1 ; -1 car canvas inverse l'axe Y.
        // /* Multiplier la direction par la vitesse */
        // this.x += dx * _speed / _fps; // On divise par les fps car la fonction est appelée selon un fps donné (#cellGrid/seconde).
        // this.y += dy * _speed / _fps;
    }

    addToPathList(cell) {
        // console.log(²this.listOfPaths);
        //check list of paths don't contain cell
        if (!this.listOfPaths.includes(cell)) {
            this.listOfPaths.push(cell);
        }
    }

    getDirectionFromObjective() {
        if (this.objective.x == parseInt(this.column)) {
            if (this.objective.y > this.row) {
                return "down";
            }
            else if (this.objective.y < this.row) {
                return "up";
            }
        }
        else if (this.objective.y == parseInt(this.row)) {
            if (this.objective.x > this.column) {
                return "right";
            }
            else if (this.objective.x < this.column) {
                return "left";
            }
        }
        return this.direction;
    }

    isAtTheCenterOfTheCell() {
        if (this.direction == "up" && this.row - parseInt(this.row) > 0.1 && this.row - parseInt(this.row) + Math.sin(Math.PI / 2) * -1 * Game._speed / Game._fps < 0.1) {
            return true;
        } else if (this.direction == "down" && this.row - parseInt(this.row) < 0.1 && this.row - parseInt(this.row) + Math.sin(3 * (Math.PI / 2)) * -1 * Game._speed / Game._fps > 0.1) {
            return true
        } else if (this.direction == "left" && this.column - parseInt(this.column) > 0.1 && this.column - parseInt(this.column) + Math.cos(Math.PI) * Game._speed / Game._fps < 0.1) {
            return true
        } else if (this.direction == "right" && this.column - parseInt(this.column) < 0.1 && this.column - parseInt(this.column) + Math.cos(0) * Game._speed / Game._fps > 0.1) {
            return true
        }
        return false;
    }
}

export default Agent;
