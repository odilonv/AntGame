import Game from '../models/game.js';

let game = Game.getInstance();
let grid = game.grid;
grid.drawGrid();

let _nbLines = grid.grid.length;
let _nbColumns = grid.grid[0].length;

let canvas = Game.canvas;

canvas.width = _nbColumns * Game._cellSize;
canvas.height = _nbLines * Game._cellSize;


function addEventListenersToTiles(tiles, resolve) {
    if (Array.isArray(tiles)) {
        tiles[0].addEventListener('load', resolve);
        tiles[1].addEventListener('load', resolve);
    } else {
        tiles.addEventListener('load', resolve);
    }
}



let ctx = canvas.getContext('2d');

for (let i = 0; i < _nbLines; i++) {
    for (let j = 0; j < _nbColumns; j++) {

        let tiles = grid.grid[i][j].getTile();

        let sx = grid.grid[i][j].tileIndex[0];
        let sy = grid.grid[i][j].tileIndex[1];
        let sWidth = grid.grid[i][j].tileSize;
        let sHeight = grid.grid[i][j].tileSize;
        let dx = j * Game._cellSize;
        let dy = i * Game._cellSize;

        let scale = 0.4;

        let dWidth = sWidth * scale;
        let dHeight = sHeight * scale;
        addEventListenersToTiles(tiles, () => {
            if (Array.isArray(tiles)) {
                ctx.drawImage(tiles[0],
                    sx, sy, sWidth, sHeight, // Source
                    dx, dy, dWidth, dHeight); // Destination
                ctx.drawImage(tiles[1], sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            } else {
                ctx.drawImage(tiles, sx, sy, sWidth, sHeight, dx + 18, dy + 12, sWidth, sHeight);
            }
        });
    }
}


export default GridView;
