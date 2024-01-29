class GridView {
    constructor(size, div_id, cellSize) {
        this.div_id = div_id;
        this.size = size;
        this.canvas;
        this.cellSize = cellSize;
        this.initView(this.size);
    }

    bindGetDrawingGrid(callback) {
        this.getDrawingGrid = callback;
        this.getDrawingGrid();
    }

    bindGetCubes(callback) {
        this.getCubes = callback;
        this.getCubes();
    }

    initView(size) {
        let div = document.querySelector(`#${this.div_id}`);
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'my_canvas';
        this.canvas.width = size * this.cellSize;
        this.canvas.height = size * this.cellSize;

        div.appendChild(this.canvas);
    }

    addEventListenersToTiles(tiles, resolve) {
        if (Array.isArray(tiles)) {
            tiles[0].addEventListener('load', resolve);
            tiles[1].addEventListener('load', resolve);
        } else {
            tiles.addEventListener('load', resolve);
        }
    }

    displayBackground(tiles, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
        let ctx = this.canvas.getContext('2d');

        this.addEventListenersToTiles(tiles, () => {
            if (Array.isArray(tiles)) {
                ctx.drawImage(tiles[0],
                    sx, sy, sWidth, sHeight, // Source
                    dx, dy, dWidth, dHeight); // Destination
                ctx.drawImage(tiles[1], sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            }
        });
    }

    displayFree(value, cube) {
        let ctx = this.canvas.getContext('2d');

        ctx.font = "10px Arial";

        if (value == 0)
            ctx.fillStyle = "#ffffff";
        else if (value < 0.02)
            ctx.fillStyle = "#d0c087";
        else if (value < 0.04)
            ctx.fillStyle = "#94ae8f";
        else if (value < 0.06)
            ctx.fillStyle = "#79bc79";
        else
            ctx.fillStyle = "#b98d0d";


        ctx.clearRect(j * this.cellSize + 20, i * this.cellSize + 20, 30, 20);
        ctx.drawImage(cube.getTile(), cube.tileIndex[0], cube.tileIndex[1], cube.tileSize, cube.tileSize, j * this.cellSize + 20, i * this.cellSize + 20, 30, 30);

        ctx.fillText(value.toFixed(2), j * this.cellSize + 23, i * this.cellSize + 40);
    }

    displaySpecialCube(cube) {
        let ctx = this.canvas.getContext('2d');

        ctx.clearRect(j * this.cellSize + 20, i * this.cellSize + 20, 30, 20);
        ctx.drawImage(cube.getTile(), cube.tileIndex[0], cube.tileIndex[1], cube.tileSize, cube.tileSize, j * this.cellSize + 20, i * this.cellSize + 20, 30, 30);
    }

    displayAnt(x, y, direction) {
        let ctx = this.canvas.getContext('2d');

        let image = new Image();
        image.src = 'web/images/tiles/ant.png';

        ctx.save();
        ctx.translate(y + 30, x + 30);
        ctx.rotate((direction == 'up' ? 0 : direction == 'right' ? Math.PI / 2 : direction == 'down' ? Math.PI : 3 * Math.PI / 2));
        ctx.drawImage(image, -10, -10, 20, 20);
        ctx.restore();
    }





}

export default GridView;