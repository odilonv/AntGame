class TimerView {
    constructor(timerDisplay) {
        this.timerDisplay = timerDisplay;
    }

    update(minutes, seconds) {
        this.timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    reset() {
        this.timerDisplay.textContent = '0:00';
    }
}

export default TimerView;