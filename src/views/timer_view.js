import Timer from '../models/timer.js';

let startButton = document.getElementById('startAndStop');
let timerDisplay = document.getElementById('timer');
let timer = new Timer();
let intervalId = null;
let hasStarted = false; 

startButton.addEventListener('click', () => {
    if (timer.isRunning()) {
        timer.stop();
        startButton.textContent = hasStarted ? 'Restart' : 'Start';
        clearInterval(intervalId);
    } else {
        timer.start();
        startButton.textContent = 'Stop';
        intervalId = setInterval(() => {
            let elapsedTime = timer.getElapsedTime();
            if (!isNaN(elapsedTime)) {
                let minutes = Math.floor(elapsedTime / 60000);
                let seconds = ((elapsedTime % 60000) / 1000).toFixed(0);
                timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            }
        }, 1000);
        hasStarted = true; 
    }
});