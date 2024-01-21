import Grid from '../models/grid.js';

let _startTime = Date.now();
let _lag = 0;
let _fps = 60; // Frame rate.
let _frameDuration = 1000 / _fps;
let _timer = 0;
let size = 15;

let myGrid = Grid.getInstance(18);

let Update = function () {
    /* Calcul du deltaTime */
    let currentTime = Date.now();
    let deltaTime = currentTime - _startTime; // La durée entre deux appels (entre 2 frames).
    _lag += deltaTime;
    _startTime = currentTime;
    _timer += deltaTime;


    /* Mettre à jour la logique si la variable _lag est supérieure ou égale à la durée d'une frame */
    while (_lag >= _frameDuration) {
        myGrid.moveAnts();
        myGrid.displayAnts();
        /* Réduire la variable _lag par la durée d'une frame */
        _lag -= _frameDuration;
    }

    requestAnimationFrame(Update); // La fonction de rappel est généralement appelée 60 fois par seconde.

}
Update();