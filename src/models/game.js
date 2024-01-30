import Grid from "./grid.js";
import Timer from "./timer.js";

class Game {

    static instance = null;
    static _fps = 60; // Frame rate.
    static _frameDuration = 1000 / Game._fps;
    static _lag = 0;
    static size = 18;
    static nbAnts = 1;
    static _speed = 1;
    static _cellSize = 40;

    static getInstance() {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    }
}

export default Game;