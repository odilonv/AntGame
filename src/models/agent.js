import Remote from "./remote.js";

class Agent {
    constructor(row, column) {
        this.capacity = 0.1; // Capacité de la fourmi à transporter de la nourriture.
        this.row = row;
        this.column = column;
        this.direction = 'null';
        this.listOfPaths = []; // Liste des chemins parcourus par la fourmi.
        this.objective = null; // Indice de listOfPaths qui correspond à la cellule objectif.
        this.startTime = Date.now();
        this.lag = 0;
        this.fps = 60;
        this.frameDuration = 1000 / this.fps;
    }

    addToPathList(cell) {
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
        if (this.direction == "up" && this.row - parseInt(this.row) > 0.1 && this.row - parseInt(this.row) + Math.sin(Math.PI / 2) * -1 * Remote._speed / Remote._fps < 0.1) {
            return true;
        } else if (this.direction == "down" && this.row - parseInt(this.row) < 0.1 && this.row - parseInt(this.row) + Math.sin(3 * (Math.PI / 2)) * -1 * Remote._speed / Remote._fps > 0.1) {
            return true
        } else if (this.direction == "left" && this.column - parseInt(this.column) > 0.1 && this.column - parseInt(this.column) + Math.cos(Math.PI) * Remote._speed / Remote._fps < 0.1) {
            return true
        } else if (this.direction == "right" && this.column - parseInt(this.column) < 0.1 && this.column - parseInt(this.column) + Math.cos(0) * Remote._speed / Remote._fps > 0.1) {
            return true
        }
        return false;
    }

    getDirectionInverse() {
        if (this.direction == "up") {
            return "down";
        } else if (this.direction == "down") {
            return "up";
        } else if (this.direction == "left") {
            return "right";
        } else if (this.direction == "right") {
            return "left";
        }
    }

    isDirectionInverse(direction) {
        if (this.direction == "up" && direction == "down") {
            return true;
        } else if (this.direction == "down" && direction == "up") {
            return true;
        } else if (this.direction == "left" && direction == "right") {
            return true;
        } else if (this.direction == "right" && direction == "left") {
            return true;
        }
        return false;
    }

    move() {
        if (this.direction === 'down') {
            this.row += Math.sin(3 * (Math.PI / 2)) * -1 * Remote._speed / Remote._fps;
        }
        else if (this.direction === 'up') {
            this.row += Math.sin(Math.PI / 2) * -1 * Remote._speed / Remote._fps;
        }
        else if (this.direction === 'right') {
            this.column += Math.cos(0) * Remote._speed / Remote._fps;
        }
        else if (this.direction === 'left') {
            this.column += Math.cos(Math.PI) * Remote._speed / Remote._fps; // On divise par les fps car la fonction est appelée selon un fps donné (#cellGrid/seconde).
        }
    }
}

export default Agent;
