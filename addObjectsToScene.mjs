import { loadDashboard } from './model_inits/dashboard_init.mjs';
import { loadMiddleStorage } from './model_inits/middle_storage_init.mjs';
import { loadPanel } from './model_inits/panel_init.mjs';
import { loadBreak } from './model_inits/break_init.mjs';
import { loadSeat } from './model_inits/car_seat_init.mjs';
import { loadDisplay } from './model_inits/display_init.mjs';
import { loadGasPedal } from './model_inits/gas_pedal_init.mjs';
import { loadHandbrake } from './model_inits/handbrake_init.mjs';
import { loadClutchPedal } from './model_inits/clutch_pedal_init.mjs';
import { loadSurroundings } from './model_inits/surroundings_init.mjs';
import { loadLeftBlinker } from './model_inits/leftBlinker_init.mjs';
import { loadRightBlinker } from './model_inits/rightBlinker_init.mjs';
import { loadAirConditioning } from './model_inits/air_conditioning.mjs';
import { loadWindscreenWiperLever } from './model_inits/windscreen_wiper_lever.mjs';//dejan

import { loadLeftHand } from './model_inits/leftHand.mjs';
import { loadRightHand } from './model_inits/rightHand.mjs';
import { loadReflector } from './reflector.mjs';
import { loadShelby } from './model_inits/shelby_init.mjs';
import { addObject } from './utils';

export const addObjectsToScene = async (scene, gui) => {
    addObject(scene, gui, "Dashboard", loadDashboard);
    addObject(scene, gui, "Middle storage", loadMiddleStorage);
    addObject(scene, gui, "Panel", loadPanel);
    addObject(scene, gui, "Break", loadBreak);
    addObject(scene, gui, "LeftBlinker", loadLeftBlinker);
    addObject(scene, gui, "RightBlinker", loadRightBlinker);
    addObject(scene, gui, "Seat", loadSeat);
    addObject(scene, gui, "Display", loadDisplay);
    addObject(scene, gui, "Gas Pedal", loadGasPedal);
    addObject(scene, gui, "Handbrake", loadHandbrake);
    addObject(scene, gui, "Clutch Pedal", loadClutchPedal);
    addObject(scene, gui, "Surroundings", loadSurroundings);
    addObject(scene, gui, "Reflector", loadReflector);
    addObject(scene, gui, "AC", loadAirConditioning);
    addObject(scene, gui, "LeftHand", loadLeftHand);
    addObject(scene, gui, "RightHand", loadRightHand);
    addObject(scene, gui, "Windscreen Wiper Lever", loadWindscreenWiperLever);
    addObject(scene, gui, "Shelby", loadShelby);
}

