
import IESSpotLight from 'three/addons/lights/IESSpotLight.js';

import { IESLoader } from 'three/addons/loaders/IESLoader.js';

export const loadReflector = async(scene) =>{
   
    try
    {
        const iesLoader = new IESLoader().setPath( './ies/' );

        const [ iesTexture1, iesTexture2] = await Promise.all( [
            iesLoader.loadAsync( '1a936937a49c63374e6d4fbed9252b29.ies' ),
        ] );

        const spotLight = new IESSpotLight( 0xffffff, 300 );
        spotLight.position.set( -6.5, 1.5, 6.5 );
        spotLight.angle = Math.PI / 8;
        spotLight.penumbra = 0.7;
        spotLight.distance = 15;
        spotLight.iesMap = iesTexture1;
        spotLight.name = "spotlight";
        return spotLight;
    }
    catch (e) {
        console.error(e);
    }
    return;
}