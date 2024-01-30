class GridView {
    constructor(size, div_id, cellSize) {
        this.div_id = div_id;
        this.size = size;
        this.canvas;
        this.cellSize = cellSize;
        this.initView(this.size);
        this.ctx = this.canvas.getContext('2d');
    }

    bindGetDrawingGrid(callback) {
        this.getDrawingGrid = callback;
        this.getDrawingGrid();
    }

    bindGetCubes(callback) {
        this.getCubes = callback;
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

        this.addEventListenersToTiles(tiles, () => {
            if (Array.isArray(tiles)) {
                this.ctx.drawImage(tiles[0],
                    sx, sy, sWidth, sHeight, // Source
                    dx, dy, dWidth, dHeight); // Destination
                this.ctx.drawImage(tiles[1], sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
            }
        });
    }

    displayFree(i, j, cube) {
        let value = cube._qty;


        this.ctx.font = "10px Arial";

        if (value == 0)
            this.ctx.fillStyle = "#ffffff";
        else if (value > 0) {
            if (value < 0.02)
                this.ctx.fillStyle = "#d0c087";
            else if (value < 0.04)
                this.ctx.fillStyle = "#94ae8f";
            else if (value < 0.06)
                this.ctx.fillStyle = "#79bc79";
            else
                this.ctx.fillStyle = "#b98d0d";
        }

        this.ctx.clearRect(j * this.cellSize + 20, i * this.cellSize + 20, 30, 20);
        this.ctx.drawImage(cube.getTile(), cube.tileIndex[0], cube.tileIndex[1], cube.tileSize, cube.tileSize, j * this.cellSize + 20, i * this.cellSize + 20, 30, 30);

        this.ctx.fillText(value.toFixed(2), j * this.cellSize + 23, i * this.cellSize + 40);
    }

    displaySpecialCube(i, j, cube) {
        this.ctx.clearRect(j * this.cellSize + 20, i * this.cellSize + 20, 30, 20);
        this.ctx.drawImage(cube.getTile(), cube.tileIndex[0], cube.tileIndex[1], cube.tileSize, cube.tileSize, j * this.cellSize + 20, i * this.cellSize + 20, 30, 30);
    }

    displayAnt(x, y, direction) {
        let image = new Image();
        image.src = 'web/images/tiles/ant.png';

        this.ctx.save();
        this.ctx.translate(y + 30, x + 30);
        this.ctx.rotate(direction == 'up' ? 0 : direction == 'right' ? 3 * Math.PI / 2 : direction == 'down' ? Math.PI : Math.PI / 2);
        this.ctx.drawImage(image, -10, -10, 20, 20);
        this.ctx.restore();
    }

    clearAntPath(previousY, previousX) {
        this.ctx.clearRect(previousY * this.cellSize + 20, previousX * this.cellSize + 20, 20, 20);
    }







}

export default GridView;