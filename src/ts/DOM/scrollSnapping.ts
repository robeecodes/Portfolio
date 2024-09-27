// Function to force snap the mandatory section into view
export default function scrollSnapping(section: HTMLElement): void {
    if (section.classList.contains('mandatory')) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}