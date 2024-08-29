// import * as THREE from 'three'
// import gsap from 'gsap'

import '/scss/style.scss'
import * as bootstrap from 'bootstrap'
console.log(bootstrap);

const skillButtons = Array.from(document.querySelectorAll('.skills-list > li > button'));

skillButtons.forEach(button => {
    button.addEventListener('click', () => {
        skillButtons.map(btn => btn.setAttribute('aria-selected', 'false'));
        button.setAttribute('aria-selected', 'true');
    });
});