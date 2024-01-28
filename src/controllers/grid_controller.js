class GridController {
    constructor(gridModel, gridView) {
        this.gridModel = gridModel;
        this.gridView = gridView;

        this.bindDrawGrid = this.bindDrawGrid.bind(this);
        this.gridModel.bindDrawGrid(this.bindDrawGrid);

        this.bindGetDrawingGrid = this.bindGetDrawingGrid.bind(this);
        this.gridView.bindGetDrawingGrid(this.bindGetDrawingGrid);
    }

    bindDrawGrid(tiles, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
        this.gridView.displayBackground(tiles, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }

    bindGetDrawingGrid() {
        this.gridModel.getDrawingGrid();
    }

}

export default GridController;