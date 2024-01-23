import Cell from './cell.js';

class Obstacle extends Cell {
    constructor(x, y) {
        super(x, y);
        this.tile.src = 'web/images/tiles/tree.png';
        this.tileIndex = [0, 0];
        this.tileSize = 150;
    }

    getTile() {
        let shadowTile = new Image();
        shadowTile.src = 'web/images/tiles/shadow.png';
        return [shadowTile, this.tile];
    }
}

export default Obstacle;
