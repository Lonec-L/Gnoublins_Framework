import { httpGetAsync } from '../utils/httpGetAsync.mjs';
import * as THREE from 'three';

const init = function (object) {
    // TODO: Implement this
}

export const loadDisplay = async () => {
    try {
        var myObject;
        init(myObject)
        return myObject;
    } catch (e) {
        console.error(e);
    }
    return;
}
