class Timer {
    constructor() {
        this.elapsedTime = 0;
        this.intervalId = null;
        this.isPaused = false;
    }

    start() {
        if (this.intervalId === null) {
            this.intervalId = setInterval(() => {
                if (!this.isPaused) {
                    this.elapsedTime += 10;
                }
            }, 10);
        }
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    stop() {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.isPaused = false;
        this.elapsedTime = 0;
    }

    getElapsedTime() {
        return this.elapsedTime;
    }


    bindDisplayTimer(callback) {
        this.DisplayTimer = callback;
    }

    getTimer() {
        this.timerInterval = setInterval(() => {
            let elapsedTime = this.getElapsedTime();
            let seconds = Math.floor((elapsedTime / 1000) % 60);
            let centiseconds = Math.floor((elapsedTime - (seconds * 1000)) / 10);
            this.DisplayTimer(seconds, centiseconds);
        }, 10);
    }


}

export default Timer;