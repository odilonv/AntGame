class TimerView {
    constructor(div_id) {
        this.div_id = div_id;
        this.seconds;
        this.centiseconds;
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
        let timerDisplay = document.createElement('div');
        let separator = document.createElement('div');

        this.seconds = document.createElement('div');
        this.centiseconds = document.createElement('div');
        timerDisplay.id = 'timerDisplay';
        this.seconds.id = 'seconds';
        this.centiseconds.id = 'centiseconds';

        this.seconds.textContent = '00';
        separator.textContent = ' : '
        this.centiseconds.textContent = '00';

        div.appendChild(timerDisplay);
        timerDisplay.appendChild(this.seconds);
        timerDisplay.appendChild(separator);
        timerDisplay.appendChild(this.centiseconds);

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
                } else if (startButton.textContent === 'Resume') {
                    this.resumeTimer();
                } else {
                    this.startTimer();
                    stopButton.disabled = false;
                    this.getTimer();
                }
            }
        );

        divButtons.appendChild(stopButton);
        divButtons.appendChild(pheromones);
        div.appendChild(startButton);
    }

    displayTimer(seconds, centiseconds) {
        if (this.seconds && this.centiseconds) {
            this.seconds.textContent = `${seconds < 10 ? '0' : ''}${seconds}`;
            this.centiseconds.textContent = `${centiseconds < 10 ? '0' : ''}${centiseconds}`;
        }
    }

    resetTimer() {
        if (this.seconds && this.centiseconds) {
            this.seconds.textContent = '00';
            this.centiseconds.textContent = '00';
        }
    }
}

export default TimerView;