import GridController from './controllers/grid_controller.js';
import Grid from './models/grid.js';
import GridView from './views/grid_view.js';

import TimerController from './controllers/timer_controller.js';
import Timer from './models/timer.js';
import TimerView from './views/timer_view.js';

let gridSize = 18, cellSize = 40;
const timer = new TimerController(new Timer(), new TimerView('sidebar'));
const grid = new GridController(new Grid(gridSize, cellSize), new GridView(gridSize, 'main', cellSize));

