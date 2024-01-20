class Agent {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    moveRandomly() {
        const directions = ['up', 'down', 'left', 'right'];
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];

        switch (randomDirection) {
            case 'up':
                this.y-=40;
                break;
            case 'down':
                this.y+=40;
                break;
            case 'left':
                this.x-=40;
                break;
            case 'right':
                this.x+=40;
                break;
        }
        if (this.x > 50) {
            return 'right';
        }
        if (this.x < 50) {
            return 'left';
        }
        if (this.y > 50) {
            return 'down';
        }
        if (this.y < 50) {
            return 'up';
        }
        return 'null';
    }
}

export default Agent;
