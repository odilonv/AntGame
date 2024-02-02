class Remote {
    static _instance = null;
    static _fps = 120; // Frame rate.
    static _frameDuration = 1000 / Remote._fps;
    static _QParameter = 1;
    static x = 18;
    static nbAnts = 20;
    static _speed = 10;
    static _cellSize = 40;

    static setInstance(value) {
        Remote._instance = value;
    }

    static getInstance() {
        if (!Remote._instance) {
            Remote._instance = new Remote();
        }
        return Remote._instance;
    }
}

export default Remote;