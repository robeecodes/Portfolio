import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js'
import GUI from 'lil-gui'
// import gsap from 'gsap'

import '/scss/style.scss'
import 'bootstrap';
import {NearestFilter, TextureLoader} from "three";

/**
 * Skill Buttons
 */
const skillButtons = Array.from(document.querySelectorAll('.skills-list > li > button'));

skillButtons.forEach(button => {
    button.addEventListener('click', () => {
        skillButtons.map(btn => btn.setAttribute('aria-selected', 'false'));
        button.setAttribute('aria-selected', 'true');
    });
});

/**
 * Scene
 */
const scene = new THREE.Scene();
scene.add(new THREE.AxesHelper(5));

const canvas = document.querySelector('canvas#webgl');

/**
 * GUI
 */
const gui = new GUI();
gui.domElement.id = "gui";

/**
 * Textures
 */
const textureLoader = new TextureLoader();

const sceneryTextures = {
    panoramaTxt: textureLoader.load('textures/scenery/Trees.webp'),
}

Object.values(sceneryTextures).forEach(txt => {
   txt.colorSpace = THREE.SRGBColorSpace;
   txt.minFilter = THREE.NearestFilter;
   txt.magFilter = THREE.NearestFilter;
});

const kaoriTextures = {
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
}

Object.values(kaoriTextures).forEach(txt => {
    if (typeof txt === 'object' && !txt.isTexture) {
        Object.values(txt).forEach(t => {
            t.colorSpace = THREE.SRGBColorSpace;
        });
    }
    else {
        txt.colorSpace = THREE.SRGBColorSpace;
    }
})

/**
 * Materials
 */

// Scenery //
// Bark Material
const barkMtl = new THREE.MeshLambertMaterial({
    color: 0x060303
});

// Bush Material
const bushMtl = new THREE.MeshLambertMaterial({
    color: 0x0a1105,
    flatShading: true
});

// Panorama Material
const panoramaMtl = new THREE.MeshLambertMaterial({
    map: sceneryTextures.panoramaTxt,
    transparent: true
});

// Kaori //
const kaoriMtls = {
    eyes: new THREE.MeshLambertMaterial({
        map: kaoriTextures.eyes.open
    }),
    mouth:  new THREE.MeshLambertMaterial({
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
}

/**
 * Load Models
 */
let fire;
let fireLight;

const fbxLoader = new FBXLoader();
fbxLoader.load(
    'models/scene.fbx',
    (object) => {
        object.traverse(function (child) {
            if (child.name === "pointLight1") fireLight = child;
            if ((child as THREE.Mesh).isMesh) {
                if ((child as THREE.Mesh).material) {
                    const mtl = (child as THREE.Mesh).material;

                    if (mtl.name === "Bark") (child as THREE.Mesh).material = barkMtl;
                    if (mtl.name === "Bush9") (child as THREE.Mesh).material = bushMtl;
                    // This is the panorama material... Nice naming(!!)
                    if (mtl.name === "standardSurface2") (child as THREE.Mesh).material = panoramaMtl;

                    if (mtl.name === "Fire") fire = child as THREE.Mesh;
                }
            }
        });
        object.scale.set(.01, .01, .01);
        scene.add(object);
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    (error) => {
        console.log(error);
    }
);

fbxLoader.load(
    'models/kaori.fbx',
    (object) => {
        object.traverse(function (child) {
            if ((child as THREE.Mesh).isMesh) {
                if ((child as THREE.Mesh).material) {
                    const mtl = (child as THREE.Mesh).material;

                    if (Array.isArray(mtl)) {
                        mtl.forEach((item) => {
                            if (item.name === "Kaori_Rigged:Mouth") (child as THREE.Mesh).material = kaoriMtls.mouth;
                            if (item.name === "Kaori_Rigged:Eyes") (child as THREE.Mesh).material = kaoriMtls.eyes;
                            if (item.name === "Kaori_Rigged:Dress1") (child as THREE.Mesh).material = kaoriMtls.skinCloth;
                            if (item.name === "Kaori_Rigged:Skin_And_Cloth") (child as THREE.Mesh).material = kaoriMtls.skinCloth;
                        });
                    } else {
                        if (mtl.name === "Kaori_Rigged:Hair1") (child as THREE.Mesh).material = kaoriMtls.hair;
                        if (mtl.name === "Kaori_Rigged:Hood") (child as THREE.Mesh).material = kaoriMtls.hood;
                    }
                }
            }
        })
        object.scale.set(.01, .01, .01);
        scene.add(object);
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    (error) => {
        console.log(error);
    }
);

fbxLoader.load(
    'models/ren.fbx',
    (object) => {
        object.traverse(function (child) {
            if ((child as THREE.Mesh).isMesh) {
                if ((child as THREE.Mesh).material) {
                    ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).transparent = false;
                }
            }
        })
        object.scale.set(.01, .01, .01);
        scene.add(object);
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
    },
    (error) => {
        console.log(error);
    }
);
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Lights
 */
const light = new THREE.PointLight(0xffffff, 50);
light.position.set(0.8, 1.4, 1.0);
scene.add(light);

const ambientLight = new THREE.AmbientLight();
scene.add(ambientLight);

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(12, 0.6, 6);
camera.rotation.set(-0.15, 0.6, 0.1);
scene.add(camera);

const camFolder = gui.addFolder("Camera");
camFolder.add(camera.position, 'x');
camFolder.add(camera.position, 'y');
camFolder.add(camera.position, 'z');
camFolder.add(camera.rotation, 'x');
camFolder.add(camera.rotation, 'y');
camFolder.add(camera.rotation, 'z');


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    if (fire) fire.visible = false;
    if (fireLight) fireLight.visible = false;

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()