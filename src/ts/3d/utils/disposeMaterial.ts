// @ts-ignore
import * as THREE from 'three';

// Delete the original maya materials
// TODO: Is there a better way to do this?
export default function disposeMaterial(material: THREE.Material) {
    if (material) {
        if (material.map) material.map.dispose(); // Dispose of textures
        if (material.lightMap) material.lightMap.dispose();
        if (material.bumpMap) material.bumpMap.dispose();
        if (material.normalMap) material.normalMap.dispose();
        if (material.specularMap) material.specularMap.dispose();
        if (material.envMap) material.envMap.dispose();
        material.dispose(); // Dispose of the material itself
    }
}