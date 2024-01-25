class TimerView {
    constructor(div_id) {
        this.div_id = div_id;
        this.timerDisplay;
        this.initView();
    }

    bindPauseTimer(callback) {
        this.pauseTimer = callback;
    }

    bindResumeTimer(callback) {
        this.resumeTimer = callback;
    }

    bindStartTimer(callback) {
        this.startTimer = callback;
    }

    bindStopTimer(callback) {
        this.stopTimer = callback;
    }

    bindGetTimer(callback) {
        this.getTimer = callback;
    }

    initView() {
        let div = document.querySelector(`#${this.div_id}`);
        let divButtons;

        this.timerDisplay = document.createElement('div');
        this.timerDisplay.id = 'timerDisplay';
        this.timerDisplay.textContent = '00:00';
        div.appendChild(this.timerDisplay);

        if (!document.querySelector('.buttons')) {
            divButtons = document.createElement('div');
            divButtons.className = 'buttons';
            div.appendChild(divButtons);
        }
        else {
            divButtons = document.querySelector('.buttons');
        }

        let stopButton = document.createElement('button');
        let pheromones = document.createElement('button');
        let startButton = document.createElement('button');

        stopButton.id = 'stopButton';
        stopButton.textContent = 'Stop';
        stopButton.disabled = true;

        pheromones.id = 'pheromones';
        pheromones.textContent = 'Pheromones';

        startButton.id = 'startButton';
        startButton.textContent = 'Start';

        stopButton.addEventListener('click', () => {
            this.stopTimer();
            startButton.textContent = 'Start';
            this.resetTimer();
            stopButton.disabled = true;
        }
        );
        startButton.addEventListener('click',
            () => {
                if (startButton.textContent === 'Pause') {
                    this.pauseTimer();
                    startButton.textContent = 'Resume';
                } else if (startButton.textContent === 'Resume') {
                    this.resumeTimer();
                    startButton.textContent = 'Pause';
                } else {
                    this.startTimer();
                    stopButton.disabled = false;
                    startButton.textContent = 'Pause';
                    this.getTimer();
                }
            }
        );

        divButtons.appendChild(stopButton);
        divButtons.appendChild(pheromones);
        div.appendChild(startButton);
    }

    displayTimer(seconds, centiseconds) {
        console.log('View : ' + seconds + " " + centiseconds);
        if (this.timerDisplay) {
            this.timerDisplay.textContent = `${seconds < 10 ? '0' : ''}${seconds}:${centiseconds < 10 ? '0' : ''}${centiseconds}`;
        }
    }

    resetTimer() {
        if (this.timerDisplay) {
            this.timerDisplay.textContent = '00:00';
        }
    }
}

export default TimerView;