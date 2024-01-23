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
                    this.elapsedTime += 1000;
                }
            }, 1000);
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
}

export default Timer;