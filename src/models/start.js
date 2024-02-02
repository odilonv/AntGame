import Free from './free.js';
class Start extends Free {
    constructor(x, y) {
        super(x, y);
        let startCaseIndex = [[190, 642], [160, 642], [130, 642], [99, 642], [65, 642]];

        this.tile.src = 'web/images/tiles/foodAndColony.png';
        this.tileIndex = startCaseIndex[Math.floor(Math.random() * startCaseIndex.length)];
        this.tileSize = 32;
    }
    getTile() { return this.tile; }
    getTileIndex() { return this.tileIndex; }

}

export default Start;
