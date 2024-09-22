import gsap from "gsap";
// @ts-ignore
import * as THREE from 'three'

export const transitionToNight = (isNight: boolean, ambientLight: THREE.AmbientLight, directionalLight: THREE.DirectionalLight, fireLight: THREE.PointLight, _fireLightActive: boolean, fire: THREE.Mesh, canvas: THREE.Canvas) => {
    const daytimeImage = "textures/scenery/Day.webp";
    const nightTimeImage = "textures/scenery/Night.webp";

        // Once the scroll is complete, start light animations
        gsap.to(ambientLight, {
            duration: 0.75,
            intensity: isNight ? 0 : 0.6,
            ease: "power2.out",
            overwrite: true
        });
        gsap.to(directionalLight, {
            duration: 0.75,
            intensity: isNight ? 0 : 7,
            ease: "power2.out",
            overwrite: true
        });
        gsap.to(fireLight, {
            duration: isNight ? 2 : 0.2,
            intensity: isNight ? 1 : 0,
            delay: isNight ? 2 : 0,
            ease: "power2.out",
            overwrite: true,
            onComplete: () => {
                _fireLightActive = isNight;
            }
        });
        if (fire) {
            gsap.to(fire.material, {
                duration: isNight ? 2 : 0.2,
                opacity: isNight ? 1 : 0,
                delay: isNight ? 2 : 0,
                ease: "power2.out",
                overwrite: true
            });
        }
        gsap.to(canvas, {
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            background: `url(${isNight ? nightTimeImage : daytimeImage})`,
            overwrite: true
        });
}