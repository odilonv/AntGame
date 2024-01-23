import Free from './free.js';
class Start extends Free {
    constructor(x, y) {
        super(x, y);
        this.tile.src = 'web/images/tiles/foodAndColony.png';
        this.tileIndex = [190, 642];
        this.tileSize = 32;
    }
    getTile() { return this.tile; }

}

export default Start;
