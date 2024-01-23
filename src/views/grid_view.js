import Game from '../models/game.js';

let game = Game.getInstance();
let grid = game.grid;
grid.drawGrid();

let _nbLines = grid.grid.length;
let _nbColumns = grid.grid[0].length;

let canvas = Game.canvas;

(function () {
    canvas.width = _nbColumns * Game._cellSize;
    canvas.height = _nbLines * Game._cellSize;
})();


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
                const tiles = grid.grid[i][j].getTile();
                addEventListenersToTiles(tiles, resolve);
            })
        )
    )
)
    .then(() => {
        let ctx = canvas.getContext('2d');
        for (let i = 0; i < _nbLines; i++) {
            for (let j = 0; j < _nbColumns; j++) {
                let tiles = grid.grid[i][j].getTile();

                let sx = grid.grid[i][j].tileIndex * Game.tileSize;
                let sy = grid.grid[i][j].tileIndex * Game.tileSize;
                let sWidth = Game.tileSize;
                let sHeight = Game.tileSize;
                let dx = j * Game._cellSize;
                let dy = i * Game._cellSize;

                let scale = 0.4;
                let dWidth = sWidth * scale;
                let dHeight = sHeight * scale;

                addEventListenersToTiles(tiles, () => {
                    if (Array.isArray(tiles)) {
                        ctx.drawImage(tiles[0], sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
                        ctx.drawImage(tiles[1], sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
                    } else {
                        // print a text on the cell
                        ctx.drawImage(tiles, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
                    }
                });
            }
        }
    });