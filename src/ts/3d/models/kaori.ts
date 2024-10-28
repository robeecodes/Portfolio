// @ts-ignore
import * as THREE from 'three';
import disposeMaterial from "../utils/disposeMaterial.ts";
// @ts-ignore
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import {kaoriMtls, kaoriTextures} from "../utils/materials.ts";

export default class Kaori {
    static model: any;
    static animations: any;
    static blinkFrames: any;

    private _blinkFrameIdx: number;
    private _isLoaded = false;
    private _modifier = 0.5;
    private kaoriActions = {
        idle: THREE.AnimationAction,
    };

    mesh: THREE.Mesh;
    mixer: THREE.AnimationMixer;
    isBlinking: boolean;

    constructor(loader: THREE.FBXLoader, scene: THREE.Scene) {
        if (!Kaori.model) {
            this.loadModel(loader).then(() => {
                this.createKaoriInstance(scene);
            })
        } else {
            this.createKaoriInstance(scene);
        }

        this.isBlinking = false;
        this._blinkFrameIdx = 0;
        this._modifier = 0.5;
    }

    private async loadModel(loader: THREE.FBXLoader) {
        const fbx = await loader.loadAsync('models/kaori.fbx');

        Kaori.model = fbx;
        Kaori.animations = fbx.animations;

        Kaori.blinkFrames = [kaoriTextures.eyes.open, kaoriTextures.eyes.halfOpen, kaoriTextures.eyes.closed];

        Kaori.model.traverse(function (child: THREE.Mesh | any) {
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
        });
    }

    private createKaoriInstance(scene: THREE.Scene) {
        this.mesh = SkeletonUtils.clone(Kaori.model);

        this.mixer = new THREE.AnimationMixer(this.mesh);
        this.kaoriActions.idle = this.mixer.clipAction(Kaori.animations[0]);


        if (Kaori.animations) {
            this.kaoriActions.idle.play();
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
        kaoriMtls.eyes.map = Kaori.blinkFrames[this._blinkFrameIdx % 3];
        kaoriMtls.eyes.needsUpdate = true;

        if (this._blinkFrameIdx % 3 === 0) this.isBlinking = false;
    }

    public update(deltaTime: number) {
        if (Math.random() > 0.995) this.isBlinking = true;
        if (this.mixer) {
            this.mixer.update(deltaTime * this._modifier);
        }
    }
}