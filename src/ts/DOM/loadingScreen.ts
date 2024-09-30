// @ts-ignore
import * as THREE from 'three'

import gsap from "gsap";

export default function loadingScreen(loadingManager: THREE.LoadingManager): void {
    // Show loading screen while THREE loads resources
    const loadingStatus: HTMLElement | null = document.getElementById('loading-status');

    const docHTML: HTMLElement | null = document.querySelector('html');
    if (docHTML) docHTML.style.overflow = 'hidden';
    loadingManager.onProgress = function (_: string, itemsLoaded: number, itemsTotal: number) {
        if (loadingStatus) loadingStatus.innerHTML = `${Math.round(itemsLoaded / itemsTotal * 100)}%`;
        if (itemsLoaded / itemsTotal === 1) {
            const loadScreen: HTMLElement | null = document.querySelector('#loading');

            gsap.to(loadScreen, {
                duration: 1,
                opacity: 0,
                onComplete: () => {
                    loadScreen?.remove();
                }
            })

            if (docHTML) docHTML.style.overflow = 'initial';
        }
    };
}
