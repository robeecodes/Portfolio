// @ts-ignore
import * as THREE from 'three';
import disposeMaterial from "../utils/disposeMaterial.ts";
import {renMtls, renTextures} from "../utils/materials.ts";
// @ts-ignore
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

export default class Ren {
    static model: any;
    static animations: any;
    static blinkFrames: any;

    private _blinkFrameIdx: number;
    private _isLoaded = false;
    private _modifier = 0.5;
    private hasShot = true;
    private renActions = {
        idle: THREE.AnimationAction,
        shoot: THREE.AnimationAction
    };

    mesh: THREE.Mesh;
    mixer: THREE.AnimationMixer;
    isBlinking: boolean;

    constructor(loader: THREE.FBXLoader, scene: THREE.Scene) {
        if (!Ren.model) {
            this.loadModel(loader).then(() => {
                this.createRenInstance(scene);
            })
        } else {
            this.createRenInstance(scene);
        }

        this.isBlinking = false;
        this._blinkFrameIdx = 0;
        this._modifier = 0.5;
    }

    private async loadModel(loader: THREE.FBXLoader) {
        const fbx = await loader.loadAsync('models/ren.fbx');

        Ren.model = fbx;
        Ren.animations = fbx.animations;

        Ren.blinkFrames = [renTextures.eyes.open, renTextures.eyes.halfOpen, renTextures.eyes.closed];

        Ren.model.traverse(function (child: THREE.Mesh | any) {
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
        });
    }

    private createRenInstance(scene: THREE.Scene) {
        this.mesh = SkeletonUtils.clone(Ren.model);

        this.mixer = new THREE.AnimationMixer(this.mesh);
        this.renActions.idle = this.mixer.clipAction(Ren.animations[0]);
        this.renActions.shoot = this.mixer.clipAction(Ren.animations[1]);


        if (Ren.animations) {
            this.renActions.idle.play();
        }

        this.mesh.scale.set(.01, .01, .01);

        scene.add(this.mesh);

        this._isLoaded = true;
    }

    public set modifier(val: number) {
        this._modifier = val;
    }

    public blink() {
        if (!this._isLoaded) return;
        this._blinkFrameIdx++;
        renMtls.eyes.map = Ren.blinkFrames[this._blinkFrameIdx % 3];
        renMtls.eyes.needsUpdate = true;

        if (this._blinkFrameIdx % 3 === 0) this.isBlinking = false;
    }

    public shoot() {
        if (this._isLoaded) {
            this.modifier = 1.2;
            this.renActions.idle.fadeOut(1.2);

            this.renActions.shoot.reset();
            this.renActions.shoot.setEffectiveWeight(1);
            this.renActions.shoot.crossFadeFrom(this.renActions.idle, 1.2, true);

            this.renActions.shoot.enabled = true;

            this.renActions.shoot.play();

            const onFinish = () => {
                this._modifier = 0.5;

                this.renActions.idle.reset();
                this.renActions.idle.setEffectiveWeight(1);
                this.renActions.idle.play();

                setTimeout(() => {
                        this.renActions.shoot.setEffectiveWeight(0); // Fade out the shoot animation
                        this.renActions.shoot.enabled = false; // Disable shooting to avoid conflicts
                }, 250);

                this.mixer.removeEventListener('loop', onFinish);
            }

            this.mixer.addEventListener('loop', onFinish);
        }
    }

    public update(deltaTime: number, isNight: boolean) {
        if (Math.random() > 0.995) this.isBlinking = true;
        if (this.mixer) {
            this.mixer.update(deltaTime * this._modifier);
            if (isNight && !this.hasShot) {
                this.shoot();
                this.hasShot = true;
            } else if (!isNight && this.hasShot) this.hasShot = false;
        }
    }
}