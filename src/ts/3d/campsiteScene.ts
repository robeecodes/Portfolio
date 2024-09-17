// @ts-ignore
import * as THREE from 'three'
// @ts-ignore
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'
import GUI from 'lil-gui'
import gsap from 'gsap'
import {ScrollToPlugin} from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

import {sceneryMtls, kaoriMtls, renMtls, sceneryTextures} from "./materials.ts";

export function campsiteScene(): void {
    /**
     * GUI
     */
    const gui = new GUI();
    gui.domElement.id = "gui";


    /**
     * Create Scene
     */
    const scene = new THREE.Scene();

    const canvas = document.querySelector('canvas#webgl');

    const daytimeImage = "textures/scenery/Day.webp";
    const nightTimeImage = "textures/scenery/Night.webp";

    /**
     * Load Models
     */
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


    const fbxLoader = new FBXLoader();
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
        },
        (xhr: THREE.progress) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error: THREE.error) => {
            console.log(error);
        }
    );

    // Kaori
    fbxLoader.load(
        'models/kaori.fbx',
        (object: THREE.Group) => {
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
            scene.add(object);
        },
        (xhr: THREE.progress) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error: THREE.error) => {
            console.log(error);
        }
    );

    // Ren
    let renMixer: THREE.AnimationMixer;
    let renClips: Array<THREE.AnimationClip>;
    let renActions: any;

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
            scene.add(object);
        },
        (xhr: THREE.progress) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error: THREE.error) => {
            console.log(error);
        }
    );

    /**
     * Lights
     */
    ambientLight = new THREE.AmbientLight(0xffffff, 2.0);

    scene.add(ambientLight);

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
     * Camera
     */
    let cameraPositions = {
        x: 12.1,
        y: 0.6,
        z: 6
    }

    let cameraRotationY = 0.7;

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
    let isNight = false;

    function disableScroll() {
        document.body.style.overflow = 'hidden';
    }

    function enableScroll() {
        document.body.style.overflow = 'auto';
    }

    let fireLightActive: boolean = false;

    function transitionToNight(isNight: boolean) {
        // Disable scrolling while animating
        disableScroll();

        // Scroll to the correct section (#hero for day, #skills for night)
        const targetSection = isNight ? "#skills" : "#hero";

        gsap.to(window, {
            scrollTo: {
                y: targetSection,  // Scroll to the target section
                autoKill: false    // Prevent killing the scroll during animation
            },
            duration: 0.75,
            ease: "power2.out",
            onComplete: () => {
                // Once the scroll is complete, start light animations
                gsap.to(ambientLight, {
                    duration: 0.75,
                    intensity: isNight ? 0 : 2.0,
                    ease: "power2.out"
                });
                gsap.to(directionalLight, {
                    duration: 0.75,
                    intensity: isNight ? 0 : 1.0,
                    ease: "power2.out"
                });
                gsap.to(fireLight, {
                    duration: 1,
                    intensity: isNight ? 1 : 0,
                    delay: isNight ? 1.5 : 0,
                    ease: "power2.out",
                    onComplete: () => {fireLightActive = isNight;}
                });
                if (fire) {
                    gsap.to(fire.material, {
                        duration: 1,
                        opacity: isNight ? 1 : 0,
                        delay: isNight ? 1.5 : 0,
                        ease: "power2.out",
                    });
                }
                gsap.to(canvas, {
                    opacity: 1,
                    duration: 1,
                    ease: 'power2.out',
                    background: `url(${isNight ? nightTimeImage : daytimeImage})`
                });

                // Enable scrolling again after animations are done
                gsap.delayedCall(1, enableScroll);  // Delay to match the total animation duration
            }
        });
    }

    const heroElement = document.querySelector('#hero');
    const skillsElement = document.querySelector('#skills');

    const options = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.5
    };

    const callback = (entries: any[]) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Check which element is intersecting
                if (entry.target.id === 'skills') {
                    isNight = true;
                    transitionToNight(true);
                } else if (entry.target.id === 'hero') {
                    isNight = false;
                    transitionToNight(false);
                }
            }
        });
    };

// Create the IntersectionObserver
    const observer = new IntersectionObserver(callback, options);

// Observe both the #hero and #skills sections
    observer.observe(heroElement as Element);
    observer.observe(skillsElement as Element);

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

    const tick = () => {
        if (isActive) {
            const elapsedTime = clock.getElapsedTime()
            const deltaTime = elapsedTime - previousTime;
            previousTime = elapsedTime;
            counter += deltaTime;

            // Fire Animation
            if (counter >= 0.1) {
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

            if (renMixer && renClips) {
                renMixer.update(deltaTime * renModifier);
                updateRenAnimation();
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

            // Render
            renderer.render(scene, camera);
        }
        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
    }

    tick();
}