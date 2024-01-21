class Agent {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.direction = 'null';
    }

    moveRandomly() {
        const directions = ['up', 'down', 'left', 'right'];
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        // if (this.direction == 'null') {
        switch (randomDirection) {
            case 'up':
                this.direction = 'up';
                break;
            case 'down':
                this.direction = 'down';
                break;
            case 'left':
                this.direction = 'left';
                break;
            case 'right':
                this.direction = 'right';
                break;
        }
        // }
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
}

export default Agent;
