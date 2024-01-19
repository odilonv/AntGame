import Grid from '../models/grid.js';

let size = 15;
let myGrid = new Grid(size);
myGrid.drawGrid();


let _nbLines = myGrid.grid.length;
let _nbColumns = myGrid.grid[0].length;
let _cellSize = 50;


(function () {
    let canvas = document.getElementById('my_canvas');
    canvas.width = _nbColumns * _cellSize;
    canvas.height = _nbLines * _cellSize;
    let ctx = canvas.getContext('2d');
})();

let canvas = document.getElementById('my_canvas');
let tileSize = 128;

Promise.all([
    new Promise((resolve) => {
        myGrid.grid[0][0].getTile().addEventListener('load', () => {
            resolve();
        });
    })
])
    .then(() => {
        let ctx = canvas.getContext('2d');

        for (let i = 0; i < _nbLines; i++) {
            for (let j = 0; j < _nbColumns; j++) {
                let tileIndex = myGrid.grid[i][j].tile;
                let sx = 0 * tileSize;
                let sy = 0;
                let sWidth = tileSize;
                let sHeight = tileSize;
                let dx = j * _cellSize;
                let dy = i * _cellSize;
                let dWidth = _cellSize;
                let dHeight = _cellSize;
                ctx.drawImage(myGrid.grid[i][j].getTile(), sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            }
        }
    });