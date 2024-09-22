import MagicGrid from "magic-grid";
// @ts-ignore
import * as basicLightbox from 'basiclightbox';

// Select all buttons and lightboxes
const buttons: NodeListOf<Element> = document.querySelectorAll("#apse-designs > .card > button");
const lightboxes: NodeListOf<Element> = document.querySelectorAll(".lightbox");
const instances: Array<any> = [];

// Initialize MagicGrid
let magicGrid = new MagicGrid({
    container: "#apse-designs",
    items: buttons.length,
    animate: true
});

magicGrid.listen();

lightboxes.forEach((lightbox: Element) => {
    const instance = basicLightbox.create(lightbox.innerHTML, {
        closable: true
    });
    instances.push(instance);
});

buttons.forEach((button: Element, i: number) => {
    button.addEventListener('click', () => {
        if (instances[i]) {
            instances[i].show();
        }
    });
});
