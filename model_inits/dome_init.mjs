import * as THREE from 'three';

const createBlurredDome = function (texture) {
    const geometry = new THREE.SphereGeometry(50, 64, 64);  // Adjust the radius and resolution as needed

    const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide
    });

    const domeMesh = new THREE.Mesh(geometry, material);

    return domeMesh;
};

const textureLoader = new THREE.TextureLoader();

const init = function (object) {
    object.update = function () {
        object.getData();

        if (object.image) {
            textureLoader.load(object.image, function (texture) {
                object.material.map = texture;
                object.material.map.needsUpdate = true;
                object.image = null;
            });
        }
    }

    object.getData = function () {
        const timestamp = new Date().getTime();
        object.image = `http://localhost:3011/image?timestamp=${timestamp}`;
        object.dataTimeoutID = setTimeout(object.getData, 33.3);
    }

    object.init = function () {
        object.dataTimeoutID = setTimeout(object.getData, 33.3);
    }

    object.deInit = function () {
        clearTimeout(object.dataTimeoutID);
    }
}

export const loadDome = async () => {
    try {
        // Create an initial empty texture
        const initialTexture = new THREE.Texture();

        // Create the blurred dome with the initial texture
        var dome = createBlurredDome(initialTexture);

        // Apply update function to the dome
        init(dome);

        return dome;
    } catch (e) {
        console.error(e);
    }
    return;
}
