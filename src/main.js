import TimerController from './controllers/timer_controller.js';

let startButton = document.getElementById('startButton');
let stopButton = document.getElementById('stopButton');
stopButton.disabled = true;
let timerDisplay = document.getElementById('timerDisplay');

let timerController = new TimerController(startButton, stopButton, timerDisplay);