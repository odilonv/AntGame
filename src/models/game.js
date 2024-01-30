import Grid from "./grid.js";
import Timer from "./timer.js";

class Game {

    static instance = null;
    static _fps = 120; // Frame rate.
    static _frameDuration = 1000 / Game._fps;
    static _lag = 0;
    static _QParameter = 1;
    static size = 18;
    static nbAnts = 5;
    static _speed = 3; // Nous voulons que 1 cellule (de notre grille) soit parcourue en 1 seconde (doit être dépendant des FPS fixés car la fonction est appelée à chaque frame). Notre unité de vitesse est donc "le nombre de cellules de la grille parcourues/seconde".
    static _cellSize = 40; // La taille d'une cellule en pixel.
    static canvas = document.getElementById('my_canvas');
    static ctx = Game.canvas.getContext('2d');

    constructor() {
        this.grid = new Grid(18);
        this.timer = new Timer();
        this.ants = [];
    }

    static getInstance() {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    }
}

export default Game;