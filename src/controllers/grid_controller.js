class GridController {
    constructor(gridModel, gridView) {
        this.gridModel = gridModel;
        this.gridView = gridView;

        this.bindDrawGrid = this.bindDrawGrid.bind(this);
        this.gridModel.bindDrawGrid(this.bindDrawGrid);

        this.bindGetDrawingGrid = this.bindGetDrawingGrid.bind(this);
        this.gridView.bindGetDrawingGrid(this.bindGetDrawingGrid);

        this.bindStartAnt = this.bindStartAnt.bind(this);
        this.gridView.bindStartAnt(this.bindStartAnt);

    }

    bindDrawGrid() {
        this.gridView.drawGrid();
    }

    bindGetDrawingGrid() {
        this.gridModel.getDrawingGrid();
    }

    bindStartAnt() {
        this.gridModel.startAnt();
    }
}

export default GridController;