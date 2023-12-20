import { loadDashboard } from './model_inits/dashboard_init.mjs';
import { loadMiddleStorage } from './model_inits/middle_storage_init.mjs';
import { loadPanel } from './model_inits/panel_init.mjs';
import { loadBreak } from './model_inits/break_init.mjs';
import { loadSeat } from './model_inits/car_seat_init.mjs';
import { loadDisplay } from './model_inits/display_init.mjs';
import { loadGasPedal } from './model_inits/gas_pedal_init.mjs';
import { addObject } from './utils';

export const addObjectsToScene = async (scene, gui) => {
    addObject(scene, gui, "Dashboard", loadDashboard);
    addObject(scene, gui, "Middle storage", loadMiddleStorage);
    addObject(scene, gui, "Panel", loadPanel);
    addObject(scene, gui, "Break", loadBreak);
    addObject(scene, gui, "Seat", loadSeat);
    addObject(scene, gui, "Display", loadDisplay);
    addObject(scene, gui, "Gas Pedal", loadGasPedal);
}

