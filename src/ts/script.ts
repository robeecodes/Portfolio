import { campsiteScene } from './3d/campsiteScene.ts'
// import gsap from 'gsap'

import '/scss/style.scss'
import 'bootstrap';

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
 * Load three.js scene
 */
campsiteScene();