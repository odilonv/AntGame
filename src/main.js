import TimerController from './controllers/timer_controller.js';
import Timer from './models/timer.js';
import TimerView from './views/timer_view.js';

const timer = new TimerController(new Timer(), new TimerView('sidebar'));