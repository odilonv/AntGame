import Grid from '../models/grid.js';

let size = 18;
let myGrid = Grid.getInstance(size);
myGrid.drawGrid();

let _nbLines = myGrid.grid.length;
let _nbColumns = myGrid.grid[0].length;
let _cellSize = 40;

(function () {
    let canvas = document.getElementById('my_canvas');
    canvas.width = _nbColumns * _cellSize;
    canvas.height = _nbLines * _cellSize;
})();

let canvas = document.getElementById('my_canvas');
let tileSize = 150;

function addEventListenersToTiles(tiles, resolve) {
    if (Array.isArray(tiles)) {
        tiles.forEach((tile) => {
            tile.addEventListener('load', resolve);
        });
    } else {
        tiles.addEventListener('load', resolve);
    }
}

Promise.all(
    Array.from({ length: _nbLines }, (_, i) =>
        Array.from({ length: _nbColumns }, (_, j) =>
            new Promise((resolve) => {
                const tiles = myGrid.grid[i][j].getTile();
                addEventListenersToTiles(tiles, resolve);
            })
        )
    )
)
    .then(() => {
        let ctx = canvas.getContext('2d');
        for (let i = 0; i < _nbLines; i++) {
            for (let j = 0; j < _nbColumns; j++) {
                let tiles = myGrid.grid[i][j].getTile();

                let sx = myGrid.grid[i][j].tileIndex * tileSize;
                let sy = myGrid.grid[i][j].tileIndex * tileSize;
                let sWidth = tileSize;
                let sHeight = tileSize;
                let dx = j * _cellSize;
                let dy = i * _cellSize;

                let scale = 0.4;
                let dWidth = sWidth * scale;
                let dHeight = sHeight * scale;

                addEventListenersToTiles(tiles, () => {
                    if (Array.isArray(tiles)) {
                        ctx.drawImage(tiles[0], sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
                        ctx.drawImage(tiles[1], sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
                    } else {
                        ctx.drawImage(tiles, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
                    }
                });
            }
        }
    });