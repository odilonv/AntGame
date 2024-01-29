class GridController {
    constructor(gridModel, gridView) {
        this.gridModel = gridModel;
        this.gridView = gridView;

        this.bindDrawGrid = this.bindDrawGrid.bind(this);
        this.gridModel.bindDrawGrid(this.bindDrawGrid);

        this.bindGetDrawingGrid = this.bindGetDrawingGrid.bind(this);
        this.gridView.bindGetDrawingGrid(this.bindGetDrawingGrid);

        this.bindDrawSpecialCube = this.bindDrawSpecialCube.bind(this);
        this.gridModel.bindDrawSpecialCube(this.bindDrawSpecialCube);
        
        this.bindDrawFreeCube = this.bindDrawFreeCube.bind(this);
        this.gridModel.bindDrawFreeCube(this.bindDrawFreeCube);
        
        this.bindDrawAnt = this.bindDrawAnt.bind(this);
        this.gridModel.bindDrawAnt(this.bindDrawAnt);

        this.bindGetCubes = this.bindGetCubes.bind(this);
        this.gridView.bindGetCubes(this.bindGetCubes);
    }

    bindDrawGrid(tiles, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
        this.gridView.displayBackground(tiles, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }

    bindDrawSpecialCube(cube) {
        this.gridView.displaySpecialCube(cube);
    }

    bindDrawFreeCube(value, cube) {
        this.gridView.displayFree(value, cube);
    }
    
    bindDrawAnt(x, y, direction) {
        this.gridView.displayAnt(x, y, direction);
    }

    bindGetDrawingGrid() {
        this.gridModel.getDrawingGrid();
    }

    bindGetCubes() {
        this.gridModel.getCubes();
    }

}

export default GridController;