import MagicGrid from "magic-grid";

const cards: NodeListOf<Element> = document.querySelectorAll("#projects-grid > .card");
const projects: Array<{ ref: Element, tags: string[] }> = [];
const grid: Element | null = document.querySelector('#projects-grid');

let magicGrid = new MagicGrid({
    container: "#projects-grid",
    items: cards.length,
    animate: true
});

magicGrid.listen();

// Collect all projects with their tags
cards.forEach((card: Element) => {
    const tags: string[] | undefined = card.getAttribute('data-tags')?.split(",");
    projects.push({
        ref: card,
        tags: tags || []
    });
});

// Set up the filter checkboxes
const filterBoxes: NodeListOf<HTMLInputElement> = document.querySelectorAll('.filter-box > input[type="checkbox"]');
let activeFilters: string[] = [];

// Update filters when checkboxes change
filterBoxes.forEach((box: HTMLInputElement) => {
    box.addEventListener('change', () => {
        const val: string | null = box.getAttribute('value');

        if (val) {
            if (box.checked) {
                activeFilters.push(val);
            } else {
                activeFilters = activeFilters.filter((filter) => filter !== val);
            }
        }

        // Filter and update the grid
        filterProjects();
    });
});

// Filter and re-render the grid
function filterProjects() {
    // Clear the grid
    // @ts-ignore
    grid.innerHTML = '';

    projects.forEach((project: any) => {
        // Show the project if it has any of the active filter tags, or if no filters are active
        const shouldShow = activeFilters.length === 0 || project.tags.some((tag: string) => activeFilters.includes(tag));

        if (shouldShow) {
            grid?.appendChild(project.ref);
        }
    });

    // Reposition grid items after filtering
    magicGrid.positionItems();
}

window.addEventListener('DOMContentLoaded', () => {
    filterBoxes.forEach((box: HTMLInputElement) => {
        box.checked = false; // Uncheck each checkbox
    });

    filterProjects();
});