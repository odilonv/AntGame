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
    }

    bindGetCubes(callback) {
        this.getCubes = callback;
    }

    bindHandleGame(callback) {
        this.handleGame = callback;
    }

    initView(size) {
        let div = document.querySelector(`#${this.div_id}`);
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'my_canvas';
        this.canvas.width = size * this.cellSize;
        this.canvas.height = size * this.cellSize;

        if (document.getElementById('startButton') && document.getElementById('stopButton')) {
            let startButton = document.getElementById('startButton');
            let stopButton = document.getElementById('stopButton');

            stopButton.addEventListener('click', () => {
                this.handleGame('stop');
            }
            );
            startButton.addEventListener('click',
                () => {
                    if (startButton.textContent === 'Start') {
                        this.handleGame('start');
                        startButton.textContent = 'Pause';

                    } else if (startButton.textContent === 'Pause') {
                        this.handleGame('pause');
                        startButton.textContent = 'Resume';
                    }
                    else if (startButton.textContent === 'Resume') {
                        this.handleGame('resume');
                        startButton.textContent = 'Pause';

                    }
                }
            );
        }

        div.appendChild(this.canvas);

        let game = this;

        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === 'hidden' && startButton.textContent === 'Pause') {
                game.handleGame('pause');
                startButton.textContent = 'Resume';
            } else if (startButton.textContent === 'Resume') {
                let notification = document.createElement('div');
                notification.textContent = 'Le jeu a été mis en pause';
                notification.id = 'pauseNotif';
                document.body.appendChild(notification);

                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 5000);
            }
        });
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

    displayFree(i, j, cube, qtyMax) {
        if (false) {
            let value = cube._qty;

            this.ctx.font = "10px Arial";

            this.ctx.fillStyle = this.getColorFromQty(value);
            this.ctx.fillText(value.toFixed(2), j * this.cellSize + 23, i * this.cellSize + 40);
        } else {
            let value = cube._qtyFromBegining;
            let ratio = value / qtyMax;
            this.ctx.beginPath();
            this.ctx.arc(j * this.cellSize + 30, i * this.cellSize + 30, 10 * ratio, 0, 2 * Math.PI);
            this.ctx.fillStyle = this.getColorFromQty(value);
            this.ctx.fill();
        }
    }

    getColorFromQty(value) {
        if (value == 0)
            return "#ffffff";
        else if (value > 0) {
            if (value < 0.02)
                return "#d0c087";
            else if (value < 0.04)
                return "#94ae8f";
            else if (value < 0.06)
                return "#79bc79";
            else
                return "#b98d0d";
        }
    }

    displaySpecialCube(i, j, cube) {
        this.ctx.clearRect(j * this.cellSize + 20, i * this.cellSize + 20, 30, 30);
        if (cube.getType() == "Objective") {
            // si c'est un objectif, on affiche l'image proportionnellement à la quantité restantes de nourriture
            this.ctx.drawImage(cube.getTile(), cube.tileIndex[0], cube.tileIndex[1], cube.tileSize, cube.tileSize, j * this.cellSize + 20, i * this.cellSize + 20, 30 * (cube._qty + 0.1), 30 * (cube._qty + 0.1));
        } else {
            this.ctx.drawImage(cube.getTile(), cube.tileIndex[0], cube.tileIndex[1], cube.tileSize, cube.tileSize, j * this.cellSize + 20, i * this.cellSize + 20, 30, 30);
        }
    }

    displayAnt(ant) {
        let image = new Image();
        image.src = 'web/images/tiles/ant.png';

        let x = ant.column * this.cellSize;
        let y = ant.row * this.cellSize;

        this.ctx.save();
        this.ctx.translate(y + 30, x + 30);
        this.ctx.rotate(ant.direction == 'up' ? 0 : ant.direction == 'right' ? 3 * Math.PI / 2 : ant.direction == 'down' ? Math.PI : Math.PI / 2);
        this.ctx.drawImage(image, -10, -10, 20, 20);
        this.ctx.restore();

        if (ant.capacity == 0) {
            // descine un petit rond rouge sur la fourmis
            this.ctx.beginPath();
            this.ctx.arc(y + 30, x + 30, 2, 0, 2 * Math.PI);
            this.ctx.fillStyle = "#ff0000";
            this.ctx.fill();
        }

    }

    clearAntPath(previousY, previousX) {
        this.ctx.clearRect(previousY * this.cellSize + 20, previousX * this.cellSize + 20, 20, 20);
    }
}

export default GridView;