class TimerController {
    constructor(timerModel, timerView) {
        this.timerModel = timerModel;
        this.timerView = timerView;

        this.bindDisplayTimer = this.bindDisplayTimer.bind(this);
        this.timerModel.bindDisplayTimer(this.bindDisplayTimer);

        this.bindGetTimer = this.bindGetTimer.bind(this);
        this.timerView.bindGetTimer(this.bindGetTimer);

        this.bindStartTimer = this.bindStartTimer.bind(this);
        this.timerView.bindStartTimer(this.bindStartTimer);

        this.bindPauseTimer = this.bindPauseTimer.bind(this);
        this.timerView.bindPauseTimer(this.bindPauseTimer);

        this.bindResumeTimer = this.bindResumeTimer.bind(this);
        this.timerView.bindResumeTimer(this.bindResumeTimer);

        this.bindStopTimer = this.bindStopTimer.bind(this);
        this.timerView.bindStopTimer(this.bindStopTimer);
    }

    bindDisplayTimer(seconds, centiseconds) {
        this.timerView.displayTimer(seconds, centiseconds);
    }

    bindGetTimer() {
        this.timerModel.getTimer();
    }

    bindStartTimer() {
        this.timerModel.start();
    }

    bindPauseTimer() {
        this.timerModel.pause();
    }

    bindResumeTimer() {
        this.timerModel.resume();
    }

    bindStopTimer() {
        this.timerModel.stop();
    }

}

export default TimerController;