// @ts-ignore
import * as THREE from 'three'
// @ts-ignore
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'

// @ts-ignore
import {throttle} from 'lodash';

import {sceneryMtls, kaoriMtls, renMtls, sceneryTextures, kaoriTextures, renTextures} from "./materials.ts";
import {transitionToNight} from "./transitionToNight.ts";

export function campsiteScene(loadingManager: THREE.LoadingManager): void {
    /**
     * Create Scene
     */
    const scene = new THREE.Scene();
    const canvas: HTMLCanvasElement | null = document.querySelector('canvas#webgl');

    /**
     * Load Models
     */

    // Delete the original maya materials
    // TODO: Is there a better way to do this?
    function disposeMaterial(material: THREE.Material) {
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

    // Scene
    // Lights
    let directionalLight: THREE.DirectionalLight;
    let ambientLight: THREE.AmbientLight;
    let pointLight;
    // Fire
    let fire: THREE.Mesh;
    let fireLight: THREE.PointLight;


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
                                fire = child as THREE.Mesh;
                                fire.material = sceneryMtls.fireMtl;
                                fire.material.opacity = 0;
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
    let kaoriMixer: THREE.AnimationMixer;
    let kaoriClips: Array<THREE.AnimationClip>;
    let kaoriActions: any;
    let kaori: any;
    fbxLoader.load(
        'models/kaori.fbx',
        (object: THREE.Group) => {
            kaoriMixer = new THREE.AnimationMixer(object);
            kaoriClips = object.animations;

            let danceAnim = THREE.AnimationClip.findByName(kaoriClips, 'Dance');

            kaoriActions = {
                idle: kaoriMixer.clipAction(THREE.AnimationClip.findByName(kaoriClips, 'Idle')),
                dance: kaoriMixer.clipAction(THREE.AnimationUtils.subclip(danceAnim, 'Dance', 75, 99)),
            }
            object.traverse(function (child: THREE.Mesh | any) {
                if ((child as THREE.Mesh).isMesh) {
                    (child as THREE.Mesh).castShadow = true;
                    (child as THREE.Mesh).receiveShadow = true;
                    if ((child as THREE.Mesh).material) {
                        const mtl = (child as THREE.Mesh).material;

                        if (Array.isArray(mtl)) {
                            mtl.forEach((item) => {
                                disposeMaterial(item);
                            });
                            mtl.forEach((item, index) => {
                                if (item.name === "Kaori_Rigged:Mouth") mtl[index] = kaoriMtls.mouth;
                                if (item.name === "Kaori_Rigged:Eyes") mtl[index] = kaoriMtls.eyes;
                                if (item.name === "Kaori_Rigged:Dress1") mtl[index] = kaoriMtls.skinCloth;
                                if (item.name === "Kaori_Rigged:Skin_and_Cloth") mtl[index] = kaoriMtls.skinCloth;
                                if (item.name === "Kaori_Rigged:Hood") mtl[index] = kaoriMtls.hood;
                            });
                            (child as THREE.Mesh).material = mtl;
                        } else {
                            disposeMaterial(mtl);
                            if (mtl.name === "Kaori_Rigged:Hair1") (child as THREE.Mesh).material = kaoriMtls.hair;
                            if (mtl.name === "Kaori_Rigged:Hood") (child as THREE.Mesh).material = kaoriMtls.hood;
                        }
                    }
                }
            })
            object.scale.set(.01, .01, .01);
            kaori = object;
            scene.add(object);
        }
    );

    // Ren
    let renMixer: THREE.AnimationMixer;
    let renClips: Array<THREE.AnimationClip>;
    let renActions: any;
    let ren: any;

    fbxLoader.load(
        'models/ren.fbx',
        (object: THREE.Group) => {
            renMixer = new THREE.AnimationMixer(object);
            renClips = object.animations;
            renActions = {
                idle: renMixer.clipAction(THREE.AnimationClip.findByName(renClips, 'Idle')),
                shoot: renMixer.clipAction(THREE.AnimationClip.findByName(renClips, 'Shoot')),
            }
            renMixer.addEventListener('loop', (e: any) => {
                if (e.action._clip.name === 'Shoot') {
                    renPending = true;
                }
            });
            object.traverse(function (child: THREE.Mesh | any) {
                if ((child as THREE.Mesh).isMesh) {
                    (child as THREE.Mesh).castShadow = true;
                    (child as THREE.Mesh).receiveShadow = true;
                    if ((child as THREE.Mesh).material) {
                        const mtl = (child as THREE.Mesh).material;

                        if (Array.isArray(mtl)) {
                            // Dispose of old materials before reassigning
                            mtl.forEach((item) => {
                                disposeMaterial(item);
                            });

                            // Reassign new materials
                            mtl.forEach((item, index) => {
                                if (item.name === "Ren_Rigged:Mouth") mtl[index] = renMtls.mouth;
                                if (item.name === "Ren_Rigged:Eyes") mtl[index] = renMtls.eyes;
                                if (item.name === "Ren_Rigged:Dress1") mtl[index] = renMtls.skinCloth;
                                if (item.name === "Ren_Rigged:Skin_and_Cloth") mtl[index] = renMtls.skinCloth;
                                if (item.name === "Ren_Rigged:Hood") mtl[index] = renMtls.boots;
                            });
                            (child as THREE.Mesh).material = mtl;
                        } else {
                            // Dispose of the old material before reassigning
                            disposeMaterial(mtl);

                            // Reassign new material
                            if (mtl.name === "Ren_Rigged:Hair1") (child as THREE.Mesh).material = renMtls.hair;
                            if (mtl.name === "Ren_Rigged:Hood") (child as THREE.Mesh).material = renMtls.boots;
                            if (mtl.name === "Ren_Rigged:Skin_and_Cloth") (child as THREE.Mesh).material = renMtls.skinCloth;
                        }
                    }
                }
            })
            object.scale.set(.01, .01, .01);
            ren = object;
            scene.add(object);
        }
    );

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
            transitionToNight(isNight, ambientLight, directionalLight, fireLight, fire, canvas, () => {
                fireLightActive = isNight;
            });
        }
        // Check if the midpoint of skills is within the viewport
        else if (skillsMidPoint >= 0 && skillsMidPoint <= window.innerHeight) {
            // Skills section is halfway on the screen
            isNight = true;
            transitionToNight(isNight, ambientLight, directionalLight, fireLight, fire, canvas, () => {
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

    // kaoriAnimation
    let kaoriModifier = 1;

    const updateKaoriAnimation = () => {
        kaoriModifier = 0.5;
        kaoriActions.dance.setEffectiveWeight(0);
        kaoriActions.idle.setEffectiveWeight(1);

        kaoriActions.dance.enabled = false;
        kaoriActions.idle.enabled = true;

        kaoriActions.idle.play();
    }

    // Ren Animation
    let renShoot = false;
    let renModifier = 1;
    let renPending = true;

    const updateRenAnimation = () => {
        if (renPending) {
            renModifier = 0.5;

            if (renActions.shoot.enabled) renActions.shoot.fadeOut(0);

            renActions.idle.setEffectiveWeight(1);
            renActions.shoot.setEffectiveWeight(0);

            renActions.idle.enabled = true;
            renActions.shoot.enabled = false;

            renActions.idle.play();
            renPending = false;
        }
        if (isNight && !renShoot) {
            renModifier = 1.5;

            // Smooth transition from 'Idle' to 'Shoot' with crossfade
            renActions.shoot.reset();
            renActions.shoot.setEffectiveWeight(1);
            renActions.idle.fadeOut(1.5);

            renActions.shoot.enabled = true;

            renActions.shoot.crossFadeFrom(renActions.idle, 1.5, true);  // Smooth blend to 'Shoot'
            renActions.shoot.play();  // Play shoot

            renShoot = true;  // Flag shoot state as true
        }
        if (!isNight) {
            renShoot = false;
        }
    }

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

    // Kaori blink config
    const kaoriBlink = [kaoriTextures.eyes.open, kaoriTextures.eyes.halfOpen, kaoriTextures.eyes.closed];
    let kaoriBlinkIdx = 0;
    let kaoriIsBlinking = false;

    // Ren blink config
    const renBlink = [renTextures.eyes.open, renTextures.eyes.halfOpen, renTextures.eyes.closed];
    let renBlinkIdx = 0;
    let renIsBlinking = false;

    const tick = () => {
        const elapsedTime = clock.getElapsedTime()
        const deltaTime = elapsedTime - previousTime;
        previousTime = elapsedTime;

        // The counter is used to throttle animation speed (1 frame per ms, essentially)
        counter += deltaTime;

        // Make Kaori blink randomly
        if (kaori) {
            if (!kaoriIsBlinking) {
                if (Math.random() > 0.995) kaoriIsBlinking = true;
            }
        }

        // Make Ren blink randomly
        if (ren) {
            if (!renIsBlinking) {
                if (Math.random() > 0.995) renIsBlinking = true;
            }
        }

        if (counter >= 0.1) {
            if (kaoriIsBlinking) {
                kaoriBlinkIdx++;
                kaoriMtls.eyes.map = kaoriBlink[kaoriBlinkIdx % 3];
                kaoriMtls.eyes.needsUpdate = true;

                if (kaoriBlinkIdx % 3 === 0) kaoriIsBlinking = false;
            }

            if (renIsBlinking) {
                renBlinkIdx++;
                renMtls.eyes.map = renBlink[renBlinkIdx % 3];
                renMtls.eyes.needsUpdate = true;

                if (renBlinkIdx % 3 === 0) renIsBlinking = false;
            }
            // Fire Animation
            if (fire && isNight) {
                if (fire.material.map === sceneryTextures.fireTxts.one) {
                    fire.material.map = sceneryTextures.fireTxts.two;
                } else if (fire.material.map === sceneryTextures.fireTxts.two) {
                    fire.material.map = sceneryTextures.fireTxts.three;
                } else if (fire.material.map === sceneryTextures.fireTxts.three) {
                    fire.material.map = sceneryTextures.fireTxts.one;
                }
                fire.material.needsUpdate = true;
            }
            if (fireLight && isNight && fireLightActive) {
                fireLight.intensity = Math.random() * (1 - 0.5) + 0.5;
            }
            counter = 0;
        }

        if (kaoriMixer && kaoriClips) {
            updateKaoriAnimation();
            kaoriMixer.update(deltaTime * kaoriModifier);
        }

        if (renMixer && renClips && renActions) {
            updateRenAnimation();
            renMixer.update(deltaTime * renModifier);
        }

        // Animate camera
        if (navBurger?.getAttribute('aria-expanded') === 'false') {
            cameraPositions = {
                x: 12.1,
                y: 0.6,
                z: 6
            }
            cameraRotationY = 0.7;
        } else {
            cameraPositions = {
                x: 13,
                y: 0.6,
                z: 4.2
            }
            cameraRotationY = 0.9;
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