import GridController from './controllers/grid_controller.js';
import Grid from './models/grid.js';
import GridView from './views/grid_view.js';

import TimerController from './controllers/timer_controller.js';
import Timer from './models/timer.js';
import TimerView from './views/timer_view.js';

import AntController from './controllers/ants_controller.js';
import Agent from './models/agent.js';
import AntView from './views/ants_view.js';




const timer = new TimerController(new Timer(), new TimerView('sidebar'));

//const grid = new GridController(new Grid(), new GridView());
//const ants = new AntController(new Agent(), new AntView());