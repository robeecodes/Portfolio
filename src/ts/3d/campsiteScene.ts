import * as THREE from 'three'
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import GUI from 'lil-gui'
import gsap from 'gsap'

import {sceneryMtls, kaoriMtls, renMtls} from "./materials.ts";
import {TextureLoader} from "three";

export function campsiteScene(): void {
    /**
     * GUI
     */
    const gui = new GUI();
    gui.domElement.id = "gui";


    /**
     * Create Scene
     */
    const textureLoader = new TextureLoader();
    const background = {
        day: textureLoader.load('textures/scenery/Day.webp', () => {
            background.day.mapping = THREE.EquirectangularReflectionMapping;
        }),
        night: textureLoader.load('textures/scenery/Night.webp', () => {
            background.night.mapping = THREE.EquirectangularReflectionMapping;
        })
    }

    const scene = new THREE.Scene();
    scene.background = background.day;

    const canvas = document.querySelector('canvas#webgl');

    /**
     * Load Models
     */

        // Scene
    let fire: { visible: boolean; };
    let fireLight: { visible: boolean; };

    const fbxLoader = new FBXLoader();
    fbxLoader.load(
        'models/scene.fbx',
        (object) => {
            object.traverse(function (child) {
                if (child.name === "pointLight1") fireLight = child;
                if ((child as THREE.Mesh).isMesh) {
                    if ((child as THREE.Mesh).material) {
                        const mtl = (child as THREE.Mesh).material;

                        if (Array.isArray(mtl)) {
                            mtl.forEach((item, index) => {
                                if (item.name === "Bark") mtl[index] = sceneryMtls.barkMtl;
                                if (item.name === "StumpTop") mtl[index] = sceneryMtls.stumpMtl;
                            });
                            (child as THREE.Mesh).material = mtl;
                        } else {
                            if (mtl.name === "Axe") (child as THREE.Mesh).material = sceneryMtls.axeMtl;
                            if (mtl.name === "Bark") (child as THREE.Mesh).material = sceneryMtls.barkMtl;
                            if (mtl.name === "Bush9") (child as THREE.Mesh).material = sceneryMtls.bushMtl;
                            if (mtl.name === "Ground") (child as THREE.Mesh).material = sceneryMtls.groundMtl;
                            if (mtl.name === "Grass2") (child as THREE.Mesh).material = sceneryMtls.grassMtl;
                            if (mtl.name === "Ground") (child as THREE.Mesh).material = sceneryMtls.groundMtl;
                            if (mtl.name === "MushTop") (child as THREE.Mesh).material = sceneryMtls.mushMtl;
                            if (mtl.name === "Rock") (child as THREE.Mesh).material = sceneryMtls.rockMtl;
                            if (mtl.name === "StumpTop") (child as THREE.Mesh).material = sceneryMtls.stumpMtl;
                            // This is the panorama material... Nice naming(!!)
                            if (mtl.name === "standardSurface2") (child as THREE.Mesh).material = sceneryMtls.panoramaMtl;
                            if (mtl.name === "Tent1") (child as THREE.Mesh).material = sceneryMtls.tentMtl;
                            if (mtl.name === "Fire") fire = child as THREE.Mesh;
                        }
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

    // Kaori
    fbxLoader.load(
        'models/kaori.fbx',
        (object) => {
            object.traverse(function (child) {
                if ((child as THREE.Mesh).isMesh) {
                    if ((child as THREE.Mesh).material) {
                        const mtl = (child as THREE.Mesh).material;

                        if (Array.isArray(mtl)) {
                            mtl.forEach((item, index) => {
                                if (item.name === "Kaori_Rigged:Mouth") mtl[index] = kaoriMtls.mouth;
                                if (item.name === "Kaori_Rigged:Eyes") mtl[index] = kaoriMtls.eyes;
                                if (item.name === "Kaori_Rigged:Dress1") mtl[index] = kaoriMtls.skinCloth;
                                if (item.name === "Kaori_Rigged:Skin_and_Cloth") mtl[index] = kaoriMtls.skinCloth;
                                if (item.name === "Kaori_Rigged:Hood") mtl[index] = kaoriMtls.hood;
                            });
                            (child as THREE.Mesh).material = mtl;
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

    // Ren
    fbxLoader.load(
        'models/ren.fbx',
        (object) => {
            object.traverse(function (child) {
                if ((child as THREE.Mesh).isMesh) {
                    if ((child as THREE.Mesh).material) {
                        const mtl = (child as THREE.Mesh).material;

                        if (Array.isArray(mtl)) {
                            mtl.forEach((item, index) => {
                                if (item.name === "Ren_Rigged:Mouth") mtl[index] = renMtls.mouth;
                                if (item.name === "Ren_Rigged:Eyes") mtl[index] = renMtls.eyes;
                                if (item.name === "Ren_Rigged:Dress1") mtl[index] = renMtls.skinCloth;
                                if (item.name === "Ren_Rigged:Skin_and_Cloth") mtl[index] = renMtls.skinCloth;
                                if (item.name === "Ren_Rigged:Hood") mtl[index] = renMtls.boots;
                            });
                            (child as THREE.Mesh).material = mtl;
                        } else {
                            if (mtl.name === "Ren_Rigged:Hair1") (child as THREE.Mesh).material = renMtls.hair;
                            if (mtl.name === "Ren_Rigged:Hood") (child as THREE.Mesh).material = renMtls.boots;
                            if (mtl.name === "Ren_Rigged:Skin_and_Cloth") (child as THREE.Mesh).material = renMtls.skinCloth;
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
    const ambientLight = new THREE.AmbientLight();
    scene.add(ambientLight);

    /**
     * Camera
     */
    const cameraPositions = {
        x: 12.1,
        y: 0.6,
        z: 6
    }

    const cameraRotationY = 0.7;

    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.set(cameraPositions.x, cameraPositions.y, cameraPositions.z);
    camera.rotation.set(0, cameraRotationY, 0);
    scene.add(camera);

    const camFolder = gui.addFolder("Camera");
    camFolder.add(camera.position, 'x');
    camFolder.add(camera.position, 'y');
    camFolder.add(camera.position, 'z');
    camFolder.add(camera.rotation, 'x');
    camFolder.add(camera.rotation, 'y');
    camFolder.add(camera.rotation, 'z');

    gui.close();

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
     * Day/Night Switch
     */
    // const targetElement = document.querySelector('#skills');
    //
    // const options = {
    //     root: null, // viewport
    //     rootMargin: '0px',
    //     threshold: 0.5 // 50% visibility required for callback to be triggered
    // };
    //
    // const callback = (entries, observer) => {
    //     entries.forEach(entry => {
    //         if (entry.isIntersecting) {
    //             // Element is visible
    //             console.log('Element is visible on the screen');
    //             fadeBackground(1);
    //         } else {
    //             // Element is not visible
    //             console.log('Element is not visible on the screen');
    //             fadeBackground(0);
    //         }
    //     });
    // };
    //
    // const observer = new IntersectionObserver(callback, options);
    // observer.observe(targetElement as Element);
    //
    // // Function to fade between backgrounds using GSAP
    // function fadeBackground(targetBlendFactor: number) {
    //     gsap.to(bgMtl.uniforms.blendFactor, {
    //         duration: 2,
    //         value: targetBlendFactor, // Animate blend factor between 0 and 1
    //         ease: "power2.out"
    //     });
    // }

    /**
     * Parallax
     */
    const cursor = {
        x: 0,
        y: 0
    }

    let targetCameraX = cameraPositions.x;
    let targetCameraY = cameraPositions.y;
    let targetRotationCameraY = cameraRotationY;

    const movementSensitivity = 0.05;
    const rotationSensitivity = 0.025;

    window.addEventListener('mousemove', (e) => {
        // Get normalized mouse position (range -1 to 1)
        cursor.x = (e.clientX / window.innerWidth) * 2 - 1;
        cursor.y = (e.clientY / window.innerHeight) * 2 - 1;
    });

    /**
     * Animate
     */
    const clock = new THREE.Clock();
    let previousTime = 0;

    const tick = () => {
        const elapsedTime = clock.getElapsedTime()
        const deltaTime = elapsedTime - previousTime;
        previousTime = elapsedTime;

        if (fire) fire.visible = false;
        if (fireLight) fireLight.visible = false;

        // Animate camera
        // Calculate target positions based on mouse movement
        targetCameraX = cameraPositions.x - cursor.x * movementSensitivity;
        targetCameraY = cameraPositions.y + cursor.y * movementSensitivity;

        // Calculate target rotation around the y-axis based on mouseX
        targetRotationCameraY = cameraRotationY - cursor.x * rotationSensitivity;

        // Interpolate camera's current position towards target using deltaTime for smooth movement
        const lerpFactor = 0.1; // Smaller values make the movement smoother
        camera.position.x += (targetCameraX - camera.position.x) * lerpFactor * deltaTime * 60;
        camera.position.y += (targetCameraY - camera.position.y) * lerpFactor * deltaTime * 60;

        camera.rotation.y += (targetRotationCameraY - camera.rotation.y) * lerpFactor * deltaTime * 60;

        // Render
        renderer.render(scene, camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
    }

    tick();
}