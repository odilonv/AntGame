import Cell from './cell.js';

class Obstacle extends Cell {
    constructor(x, y) {
        super(x, y);
        this.tile.src = '/web/images/tiles/tree.png';
    }
}

export default Obstacle;
