// @ts-ignore
import * as THREE from 'three'

import { campsiteScene } from './3d/campsiteScene.ts'
import './DOM/navTransition.ts'
import './DOM/projects.ts'
import './DOM/loadingAnimation.ts'

import '/scss/style.scss'
import 'bootstrap';

import 'img-comparison-slider/dist/index.js'
import loadingAnimation from "./DOM/loadingAnimation.ts";
import {loadTextures} from "./3d/utils/materials.ts";

import './form/formSubmission.ts';
import formSubmission from "./form/formSubmission.ts";
import loadingScreen from "./DOM/loadingScreen.ts";

const loadingManager = new THREE.LoadingManager();

/**
 * Show loading screen
 */
loadingScreen(loadingManager);

/**
 * Load textures
 */
loadTextures(loadingManager);


/**
 * Load three.js scene
 */
campsiteScene(loadingManager);

/**
 * Loading animation
 */
loadingAnimation();

/**
 * Configure form submission
 */
formSubmission();