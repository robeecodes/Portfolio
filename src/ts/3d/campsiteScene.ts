// @ts-ignore
import * as THREE from 'three'
// @ts-ignore
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'

// @ts-ignore
import {throttle} from 'lodash';

import {sceneryMtls, sceneryTextures} from "./utils/materials.ts";
import {transitionToNight} from "./transitionToNight.ts";
import disposeMaterial from "./utils/disposeMaterial.ts";
import Ren from "./models/ren.ts";
import Kaori from "./models/kaori.ts";

export function campsiteScene(loadingManager: THREE.LoadingManager): void {
    /**
     * Create Scene
     */
    const scene = new THREE.Scene();
    const canvas: HTMLCanvasElement | null = document.querySelector('canvas#webgl');

    /**
     * Load Models
     */

    // Scene
    // Lights
    let directionalLight: THREE.DirectionalLight;
    let ambientLight: THREE.AmbientLight;
    let pointLight;
    // Fire
    let fireMesh: THREE.Mesh;
    let fireLight: THREE.PointLight;
    const firePivot = new THREE.Group();
    firePivot.position.set(0, 0, 0);
    scene.add(firePivot);

    const fbxLoader = new FBXLoader(loadingManager);
    fbxLoader.load(
        'models/scene.fbx',
        (object: THREE.Group) => {
            object.traverse(function (child: THREE.Mesh | any) {
                if (child.name === "pointLight1") {
                    fireLight = child;
                    fireLight.intensity = 0;
                }
                if (child.name === "directionalLight1") {
                    directionalLight = child;
                    directionalLight.castShadow = true;
                    directionalLight.intensity = 7;

                    directionalLight.target.position.set(15, 0, 0);
                    scene.add(directionalLight.target);
                }
                if (child.name === "ambientLight1") {
                    pointLight = child;
                    pointLight.intensity = 0;
                }
                if ((child as THREE.Mesh).isMesh) {
                    if ((child as THREE.Mesh).material) {
                        const mtl = (child as THREE.Mesh).material;

                        if (Array.isArray(mtl)) {
                            mtl.forEach((item) => {
                                disposeMaterial(item);
                            });
                            mtl.forEach((item, index) => {
                                if (item.name === "Bark") {
                                    mtl[index] = sceneryMtls.barkMtl;
                                    (child as THREE.Mesh).castShadow = true;
                                    (child as THREE.Mesh).receiveShadow = true;
                                }
                                if (item.name === "StumpTop") mtl[index] = sceneryMtls.stumpMtl;
                            });
                            (child as THREE.Mesh).material = mtl;
                        } else {
                            disposeMaterial(mtl);
                            if (mtl.name === "Axe") {
                                (child as THREE.Mesh).material = sceneryMtls.axeMtl;
                                (child as THREE.Mesh).castShadow = true;
                                (child as THREE.Mesh).receiveShadow = true;
                            }
                            if (mtl.name === "Bark") {
                                (child as THREE.Mesh).material = sceneryMtls.barkMtl;
                                (child as THREE.Mesh).castShadow = true;
                                (child as THREE.Mesh).receiveShadow = true;
                            }
                            if (mtl.name === "Bush9") {
                                (child as THREE.Mesh).material = sceneryMtls.bushMtl;
                                (child as THREE.Mesh).castShadow = true;
                                (child as THREE.Mesh).receiveShadow = true;
                            }
                            if (mtl.name === "Ground") {
                                (child as THREE.Mesh).material = sceneryMtls.groundMtl;
                                (child as THREE.Mesh).receiveShadow = true;
                            }
                            if (mtl.name === "Grass2") {
                                (child as THREE.Mesh).material = sceneryMtls.grassMtl;
                                (child as THREE.Mesh).receiveShadow = true;
                            }
                            if (mtl.name === "Ground") {
                                (child as THREE.Mesh).material = sceneryMtls.groundMtl;
                                (child as THREE.Mesh).receiveShadow = true;
                            }
                            if (mtl.name === "MushTop") {
                                (child as THREE.Mesh).material = sceneryMtls.mushMtl;
                                (child as THREE.Mesh).castShadow = true;
                                (child as THREE.Mesh).receiveShadow = true;
                            }
                            if (mtl.name === "Rock") {
                                (child as THREE.Mesh).material = sceneryMtls.rockMtl;
                                (child as THREE.Mesh).castShadow = true;
                                (child as THREE.Mesh).receiveShadow = true;
                            }
                            if (mtl.name === "StumpTop") (child as THREE.Mesh).material = sceneryMtls.stumpMtl;
                            // This is the panorama material... Nice naming(!!)
                            if (mtl.name === "standardSurface2") (child as THREE.Mesh).material = sceneryMtls.panoramaMtl;
                            if (mtl.name === "Tent1") (child as THREE.Mesh).material = sceneryMtls.tentMtl;
                            if (mtl.name === "Fire") {
                                fireMesh = child as THREE.Mesh;
                                const box = new THREE.Box3().setFromObject(fireMesh);
                                const center = box.getCenter(new THREE.Vector3());
                                fireMesh.geometry.translate(-center.x, -center.y, -center.z);
                                fireMesh.position.set(0, 0, 0);
                                firePivot.add(fireMesh);
                                fireMesh.scale.set(.01, .01, .01);
                                fireMesh.material = sceneryMtls.fireMtl;
                                fireMesh.material.opacity = 0;
                            }
                        }
                    }
                }
            });
            object.scale.set(.01, .01, .01);
            scene.add(object);
        }
    );

    // Kaori
    const kaori = new Kaori(fbxLoader, scene);

    // Ren
    const ren = new Ren(fbxLoader, scene);

    /**
     * Lights
     */
    ambientLight = new THREE.AmbientLight(0xfcefbb, 0.6);

    scene.add(ambientLight);

    /**
     * Sizes
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    /**
     * Camera
     */
    let cameraPositions = {
        x: 12.1,
        y: 0.6,
        z: 6
    }

    let cameraRotationY = 0.7;

    const baseFOV = 75;
    let aspect = sizes.width / sizes.height;

    window.addEventListener('resize', () => {
        // Update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        aspect = sizes.width / sizes.height;

        if (aspect > 16 / 9) {
            camera.fov = baseFOV / (aspect / (16 / 9));
        } else {
            camera.fov = baseFOV;
        }

        // Update camera
        camera.aspect = aspect;
        camera.updateProjectionMatrix();

        // Update renderer
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


    });

    const camera = new THREE.PerspectiveCamera(baseFOV, aspect, 0.1, 100);
    if (aspect > 16 / 9) {
        camera.fov = baseFOV / (aspect / (16 / 9));
    } else {
        camera.fov = baseFOV;
    }
    camera.position.set(cameraPositions.x, cameraPositions.y, cameraPositions.z);
    camera.rotation.set(0, cameraRotationY, 0);
    scene.add(camera);

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


    /**
     * Day/Night Switch
     */
    let isNight: boolean = false;
    let fireLightActive: boolean = false;

    // Allow night transition when skills section is visible
    const heroElement = document.querySelector('#hero');
    const skillsElement = document.querySelector('#skills');

    const handleScroll = () => {
        // @ts-ignore
        const heroRect = heroElement.getBoundingClientRect();
        // @ts-ignore
        const skillsRect = skillsElement.getBoundingClientRect();

        // Calculate the halfway point of the hero section
        const heroMidPoint = heroRect.top + heroRect.height / 2;

        // Calculate the halfway point of the skills section
        const skillsMidPoint = skillsRect.top + skillsRect.height / 2;

        // Check if the midpoint of hero is within the viewport
        if (heroMidPoint >= 0 && heroMidPoint <= window.innerHeight) {
            // Hero section is halfway on the screen
            isNight = false;
            transitionToNight(isNight, ambientLight, directionalLight, fireLight, fireMesh, canvas, () => {
                fireLightActive = isNight;
            });
        }
        // Check if the midpoint of skills is within the viewport
        else if (skillsMidPoint >= 0 && skillsMidPoint <= window.innerHeight) {
            // Skills section is halfway on the screen
            isNight = true;
            transitionToNight(isNight, ambientLight, directionalLight, fireLight, fireMesh, canvas, () => {
                fireLightActive = isNight;
            });
        }
    };

// Throttle the scroll event handler to run once every 100ms
    const throttledScroll = throttle(handleScroll, 100);

    window.addEventListener('scroll', throttledScroll);
    // Make sure page loads at top
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    } else {
        window.onbeforeunload = function () {
            window.scrollTo(0, 0);
        }
    }

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
    let counter = 0;

    let isActive = true;

    // Event listener for visibility change
    document.addEventListener('visibilitychange', () => {
        isActive = document.visibilityState === 'visible';

    });

// Event listener for window focus and blur
    window.addEventListener('blur', () => {
        isActive = false;
    });

    window.addEventListener('focus', () => {
        isActive = true;
    });

    const navBurger: HTMLButtonElement | null = document.querySelector('button.navbar-toggler');

    const tick = () => {
        const elapsedTime = clock.getElapsedTime()
        const deltaTime = elapsedTime - previousTime;
        previousTime = elapsedTime;

        kaori.update(deltaTime);
        ren.update(deltaTime, isNight);

        // The counter is used to throttle animation speed (1 frame per ms, essentially)
        counter += deltaTime;

        if (counter >= 0.1) {
            if (kaori.isBlinking) kaori.blink();

            if (ren.isBlinking) ren.blink();

            // Fire Animation
            if (fireMesh && isNight) {
                if (fireMesh.material.map === sceneryTextures.fireTxts.one) {
                    fireMesh.material.map = sceneryTextures.fireTxts.two;
                } else if (fireMesh.material.map === sceneryTextures.fireTxts.two) {
                    fireMesh.material.map = sceneryTextures.fireTxts.three;
                } else if (fireMesh.material.map === sceneryTextures.fireTxts.three) {
                    fireMesh.material.map = sceneryTextures.fireTxts.one;
                }
                fireMesh.material.needsUpdate = true;
            }
            if (fireLight && isNight && fireLightActive) {
                fireLight.intensity = Math.random() * (1 - 0.5) + 0.5;
            }
            counter = 0;
        }

        // if (kaoriMixer && kaoriClips) {
        //     updateKaoriAnimation();
        //     kaoriMixer.update(deltaTime * kaoriModifier);
        // }

        // Animate camera and fire
        if (navBurger?.getAttribute('aria-expanded') === 'false') {
            cameraPositions = {
                x: 12.1,
                y: 0.6,
                z: 6
            }
            cameraRotationY = 0.7;
            firePivot?.rotation.set(0, 0, 0);
            firePivot?.position.set(11.357, -0.097, 4.497);
        } else {
            cameraPositions = {
                x: 13,
                y: 0.6,
                z: 4.2
            }
            cameraRotationY = 0.9;
            firePivot?.rotation.set(0, 1.056, 0);
            firePivot?.position.set(11.396, -0.097, 4.333);
        }

        // Parallax
        if (isActive) {
            // Calculate target positions based on mouse movement
            targetCameraX = cameraPositions.x - cursor.x * movementSensitivity;
            targetCameraY = cameraPositions.y + cursor.y * movementSensitivity;

            // Calculate target rotation around the y-axis based on mouseX
            targetRotationCameraY = cameraRotationY - cursor.x * rotationSensitivity;

            // Interpolate camera's current position towards target using deltaTime for smooth movement
            const lerpFactor = 0.1; // Smaller values make the movement smoother
            camera.position.x += (targetCameraX - camera.position.x) * lerpFactor * deltaTime * 60;
            camera.position.y += (targetCameraY - camera.position.y) * lerpFactor * deltaTime * 60;
            camera.position.z = cameraPositions.z;

            camera.rotation.y += (targetRotationCameraY - camera.rotation.y) * lerpFactor * deltaTime * 60;
        }
        // Render
        renderer.render(scene, camera);
        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
    }

    tick();
}