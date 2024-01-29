// import Game from '../models/game.js';

// class AntView {
//     constructor() {

//     }


// }

// export default AntView;






// let myGrid = Game.getInstance().grid;

// let _startTime = Date.now();
// let _timer = 0;

// Update () {
//     /* Calcul du deltaTime */
//     let currentTime = Date.now();
//     let deltaTime = currentTime - _startTime; // La durée entre deux appels (entre 2 frames).
//     Game._lag += deltaTime;
//     _startTime = currentTime;
//     _timer += deltaTime;


//     /* Mettre à jour la logique si la variable _lag est supérieure ou égale à la durée d'une frame */
//     while (Game._lag >= Game._frameDuration) {
//         myGrid.moveAnts();
//         myGrid.displayAnts();
//         /* Réduire la variable _lag par la durée d'une frame */
//         Game._lag -= Game._frameDuration;
//     }

//     requestAnimationFrame(Update); // La fonction de rappel est généralement appelée 60 fois par seconde.

// }

// let myGrid = Game.getInstance().grid;

// let _startTime = Date.now();
// let _timer = 0;

// let Update = function () {
//     /* Calcul du deltaTime */
//     let currentTime = Date.now();
//     let deltaTime = currentTime - _startTime; // La durée entre deux appels (entre 2 frames).
//     Game._lag += deltaTime;
//     _startTime = currentTime;
//     _timer += deltaTime;


//     /* Mettre à jour la logique si la variable _lag est supérieure ou égale à la durée d'une frame */
//     while (Game._lag >= Game._frameDuration) {
//         myGrid.moveAnts();
//         myGrid.displayAnts();
//         /* Réduire la variable _lag par la durée d'une frame */
//         Game._lag -= Game._frameDuration;
//     }

//     requestAnimationFrame(Update); // La fonction de rappel est généralement appelée 60 fois par seconde.

// }
// Update();

