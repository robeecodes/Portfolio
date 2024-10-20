// @ts-ignore
import * as THREE from 'three'

const sceneryMtls: { [key: string]: THREE.Material } = {},
    kaoriMtls: { [key: string]: THREE.Material } = {},
    renMtls: { [key: string]: THREE.Material } = {},
    sceneryTextures: { [key: string]: THREE.Material } = {},
    kaoriTextures: { [key: string]: THREE.Material } = {},
    renTextures: { [key: string]: THREE.Material } = {};

export function loadTextures(loadingManager: THREE.LoadingManager) {
    /**
     * Textures
     */
    const textureLoader = new THREE.TextureLoader(loadingManager);

// Scenery
    Object.assign(sceneryTextures, {
        grassTxt: textureLoader.load('textures/scenery/Grass.webp'),
        groundTxt: textureLoader.load('textures/scenery/Ground.webp'),
        panoramaTxt: textureLoader.load('textures/scenery/Trees.webp'),
        fireTxts: {
            one: textureLoader.load('textures/fire/fire_000.webp'),
            two: textureLoader.load('textures/fire/fire_001.webp'),
            three: textureLoader.load('textures/fire/fire_002.webp'),
        }
    });

    Object.values(sceneryTextures).forEach(txt => {
        txt.colorSpace = THREE.SRGBColorSpace;
        if (txt !== sceneryTextures.panoramaTxt) {
            txt.minFilter = THREE.NearestFilter;
            txt.magFilter = THREE.NearestFilter;
        } else {
            txt.wrapS = txt.wrapT = THREE.RepeatWrapping;
            txt.offset.set(0.2, 0);
        }

        if (txt === sceneryTextures.grassTxt) {
            txt.wrapS = txt.wrapT = THREE.RepeatWrapping;
            txt.repeat.set(25, 25);
        }

        if (txt === sceneryTextures.groundTxt) {
            txt.wrapS = txt.wrapT = THREE.RepeatWrapping;
            txt.repeat.set(200, 200);
        }
    });

// Kaori
    Object.assign(kaoriTextures, {
        eyes: {
            open: textureLoader.load('textures/kaori/eyes/Eyes_01.webp'),
            halfOpen: textureLoader.load('textures/kaori/eyes/Eyes_02.webp'),
            closed: textureLoader.load('textures/kaori/eyes/Eyes_03.webp'),
        },
        mouths: {
            smile: textureLoader.load('textures/kaori/mouths/Mouth_01.webp'),
            grin: textureLoader.load('textures/kaori/mouths/Mouth_02.webp'),
            open: textureLoader.load('textures/kaori/mouths/Mouth_03.webp'),
        },
        uvMap: textureLoader.load('textures/kaori/UV Map.webp')
    });

    Object.values(kaoriTextures).forEach(txt => {
        if (typeof txt === 'object' && !txt.isTexture) {
            Object.values(txt).forEach((t: THREE.Texture) => {
                t.colorSpace = THREE.SRGBColorSpace;
                t.minFilter = THREE.NearestFilter;
                t.magFilter = THREE.NearestFilter;
            });
        } else {
            txt.colorSpace = THREE.SRGBColorSpace;
            txt.minFilter = THREE.NearestFilter;
            txt.magFilter = THREE.NearestFilter;
        }
    });

// Ren
    Object.assign(renTextures, {
        eyes: {
            open: textureLoader.load('textures/ren/eyes/Eyes_000.webp'),
            halfOpen: textureLoader.load('textures/ren/eyes/Eyes_001.webp'),
            closed: textureLoader.load('textures/ren/eyes/Eyes_002.webp'),
        },
        mouths: {
            smile: textureLoader.load('textures/ren/mouths/Mouth_000.webp'),
            grin: textureLoader.load('textures/ren/mouths/Mouth_001.webp'),
            open: textureLoader.load('textures/ren/mouths/Mouth_002.webp'),
        },
        uvMap: textureLoader.load('textures/ren/UV Map.webp')
    });

    Object.values(renTextures).forEach(txt => {
        if (typeof txt === 'object' && !txt.isTexture) {
            Object.values(txt).forEach((t: THREE.Texture) => {
                t.colorSpace = THREE.SRGBColorSpace;
                t.minFilter = THREE.NearestFilter;
                t.magFilter = THREE.NearestFilter;
            });
        } else {
            txt.colorSpace = THREE.SRGBColorSpace;
            txt.minFilter = THREE.NearestFilter;
            txt.magFilter = THREE.NearestFilter;
        }
    });

    /**
     * Materials
     */
    Object.assign(sceneryMtls, {
        axeMtl: new THREE.MeshPhongMaterial({
            color: 0xe6eff0,
            shininess: 200
        }),
        barkMtl: new THREE.MeshLambertMaterial({
            color: 0x462626,
        }),
        bushMtl: new THREE.MeshLambertMaterial({
            color: 0x52632b,
            flatShading: true
        }),
        grassMtl: new THREE.MeshLambertMaterial({
            map: sceneryTextures.grassTxt
        }),
        groundMtl: new THREE.MeshLambertMaterial({
            map: sceneryTextures.groundTxt
        }),
        mushMtl: new THREE.MeshLambertMaterial({
            color: 0x972f1c,
        }),
        panoramaMtl: new THREE.MeshLambertMaterial({
            map: sceneryTextures.panoramaTxt,
            transparent: true
        }),
        rockMtl: new THREE.MeshLambertMaterial({
            color: 0xbababa
        }),
        stumpMtl: new THREE.MeshLambertMaterial({
            color: 0xf2bd75
        }),
        tentMtl: new THREE.MeshPhongMaterial({
            color: 0x41a8b9,
            shininess: 20,
        }),
        fireMtl: new THREE.MeshLambertMaterial({
            map: sceneryTextures.fireTxts.one,
            transparent: true,
            side: THREE.DoubleSide
        }),
    });

// Kaori //
    Object.assign(kaoriMtls, {
        eyes: new THREE.MeshLambertMaterial({
            map: kaoriTextures.eyes.open
        }),
        mouth: new THREE.MeshLambertMaterial({
            map: kaoriTextures.mouths.smile
        }),
        skinCloth: new THREE.MeshLambertMaterial({
            map: kaoriTextures.uvMap,
        }),
        hair: new THREE.MeshPhongMaterial({
            map: kaoriTextures.uvMap
        }),
        hood: new THREE.MeshPhongMaterial({
            map: kaoriTextures.uvMap,
            side: THREE.DoubleSide
        })
    });

// Ren //
    Object.assign(renMtls, {
        eyes: new THREE.MeshLambertMaterial({
            map: renTextures.eyes.open
        }),
        mouth: new THREE.MeshLambertMaterial({
            map: renTextures.mouths.smile,
        }),
        skinCloth: new THREE.MeshLambertMaterial({
            map: renTextures.uvMap,
        }),
        hair: new THREE.MeshPhongMaterial({
            map: renTextures.uvMap
        }),
        boots: new THREE.MeshPhongMaterial({
            map: renTextures.uvMap,
        })
    });
}

export {sceneryMtls, kaoriMtls, renMtls, sceneryTextures, kaoriTextures, renTextures}