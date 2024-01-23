class Agent {
    constructor(row, column) {
        this.row = row;
        this.column = column;
        this.direction = 'null';
        this.listOfPaths = []; // Liste des chemins parcourus par la fourmi.
        this.hasTookADecision = false;
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
        this.hasTookADecision = false;

    }
}

export default Agent;
