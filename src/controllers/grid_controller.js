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
        
        this.bindClearAntPath = this.bindClearAntPath.bind(this);
        this.gridModel.bindClearAntPath(this.bindClearAntPath);

        this.bindGetCubes = this.bindGetCubes.bind(this);
        this.gridView.bindGetCubes(this.bindGetCubes);

        this.gridModel.update();
    }

    bindDrawGrid(tiles, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
        this.gridView.displayBackground(tiles, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }

    bindClearAntPath(previousY, previousX){
        this.gridView.clearAntPath(previousY, previousX);
    }

    bindDrawSpecialCube(i, j, cube) {
        this.gridView.displaySpecialCube(i, j, cube);
    }

    bindDrawFreeCube(i, j, cube) {
        this.gridView.displayFree(i, j, cube);
    }

    bindDrawAnt(ant) {
        this.gridView.displayAnt(ant);
    }

    bindGetDrawingGrid() {
        this.gridModel.getDrawingGrid();
    }

    bindGetCubes() {
        this.gridModel.getCubes();
    }

}

export default GridController;