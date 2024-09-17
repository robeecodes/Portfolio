import MagicGrid from "magic-grid";

let magicGrid = new MagicGrid({
    container: "#projects-grid",
    items: 5,
    animate: true
});

magicGrid.listen();

const cards: NodeListOf<Element> = document.querySelectorAll("#projects-grid > .card");
const projects: Array<Object> = [];
const grid: Element | null = document.querySelector('#projects-grid');

cards.forEach((card: Element) => {
    const tags: string[] | undefined = card.getAttribute('data-tags')?.split(",");

    projects.push ({
        ref: card,
        tags: tags
    });
});


// window.onload = () => {
//     projects.forEach((project: any) => {
//         if (project.tags?.includes("unity")) {
//             project.ref.remove();
//         }
//         magicGrid.positionItems();
//     });
// }
//
// window.onclick = () => {
//     projects.forEach((project: any) => {
//         if (project.tags?.includes("unity")) {
//             grid?.appendChild(project.ref);
//         }
//         magicGrid.positionItems();
//     });
// }