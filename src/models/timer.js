class Timer {
    constructor() {
        this.startTime = null;
        this.endTime = null;
        this.running = false;
    }

    start() {
        this.startTime = new Date();
        this.running = true;
    }

    stop() {
        this.endTime = new Date();
        this.running = false;
    }

    getElapsedTime() {
        if (!this.startTime) {
            throw new Error('Timer has not been started.');
        }

        let endTime = this.endTime;

        if (this.running) {
            endTime = new Date();
        }

        return endTime - this.startTime;
    }

    isRunning() {
        return this.running;
    }
}

export default Timer;