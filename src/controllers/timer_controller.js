import Timer from '../models/timer.js';
import TimerView from '../views/timer_view.js';

class TimerController {
    constructor(startButton, stopButton, timerDisplay) {
        this.timer = new Timer();
        this.timerView = new TimerView(timerDisplay);
        this.startButton = startButton;
        this.stopButton = stopButton;

        this.stopButton.addEventListener('click', () => this.stopTimer());
        this.startButton.addEventListener('click', () => this.toggleTimer());
    }

    toggleTimer() {
        if (this.startButton.textContent === 'Pause') {
            this.timer.pause();
            this.startButton.textContent = 'Resume';
        } else if (this.startButton.textContent === 'Resume') {
            this.timer.resume();
            this.startButton.textContent = 'Pause';
        } else {
            this.timer.start();
            this.stopButton.disabled = false;
            this.startButton.textContent = 'Pause';
            this.updateTimerDisplay();
        }
    }

    stopTimer() {
        this.timer.stop();
        this.startButton.textContent = 'Start';
        this.timerView.reset();
        this.stopButton.disabled = true;
    }

    updateTimerDisplay() {
        setInterval(() => {
            let elapsedTime = this.timer.getElapsedTime();
            let minutes = Math.floor(elapsedTime / 60000);
            let seconds = ((elapsedTime % 60000) / 1000).toFixed(0);
            this.timerView.update(minutes, seconds);
        }, 1000);
    }
}

export default TimerController;