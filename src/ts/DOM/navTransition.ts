import gsap from 'gsap';
import scrollSnapping from "./scrollSnapping.ts";

const navBurger: HTMLButtonElement | null = document.querySelector('button.navbar-toggler');
const navExit: HTMLButtonElement | null = document.querySelector('button.btn-close');
const navBar: HTMLElement | null = document.querySelector('#offcanvasNavbar');
const navLinks: Array<HTMLAnchorElement> = Array.from(document.querySelectorAll('.nav-link'));

const transitionalElems: NodeListOf<Element> | null = document.querySelectorAll('.transitional-elem');

// Transition sidebar away and back
const transition: Function = () => {
    transitionalElems.forEach((el: Element) => {
        if (navBurger?.getAttribute('aria-expanded') === 'true') {
            gsap.to (el, {
                    duration: 0.2,
                    transform: 'translateX(-100%)',
                }
            )
        } else {
            gsap.to (el, {
                    duration: 0.2,
                    transform: 'translateX(0)',
                }
            )
        }
    });
}

document.addEventListener('click', (e) => {
   let target = e.target as Element;
   if (!navBar?.contains(target) && !navBurger?.contains(target) && navBurger?.getAttribute('aria-expanded') === 'true') {
       if (target !== navBar) {
           navBurger?.setAttribute('aria-expanded', 'false');
           transition();
       }
   }
});

navBurger?.addEventListener('click', () => {
    navBurger.setAttribute('aria-expanded', 'true');
    transition();
});

navExit?.addEventListener('click', () => {
    navBurger?.setAttribute('aria-expanded', 'false');
    transition();
});


// Links
const updateLink = (link: HTMLAnchorElement) => {
    navLinks.map((link) => {
        link.setAttribute('aria-current', '');
        link.classList.remove('active');
    });
    link.setAttribute('aria-current', 'page');
    link.classList.add('active');
}

let snappingDisabled: boolean = false;
let targetSection: string | null = null;

navLinks.forEach((navLink: HTMLAnchorElement) => {
   navLink.addEventListener('click', () => {
       updateLink(navLink);
       navExit?.click();
       transition();

       snappingDisabled = true;
       // @ts-ignore
       targetSection = navLink.getAttribute('href').substring(1);
   });
});

let contactBtn: HTMLAnchorElement | null = document.querySelector('#hero a');
contactBtn?.addEventListener('click', () => {
    snappingDisabled = true;
    // @ts-ignore
    targetSection = contactBtn.getAttribute('href').substring(1);
});

// Sync current link to visible content
const observerOptions = {
    rootMargin: '0px',
    threshold: 0.25
}

const observer = new IntersectionObserver(observerCallback, observerOptions);

function observerCallback(entries: any, _observer: any) {
    entries.forEach((entry: any) => {
        if(entry.isIntersecting) {
            if (entry.target.id === 'hero') {
                updateLink(navLinks[0]);
                if (!snappingDisabled) scrollSnapping(entry.target);
            }
            if (entry.target.id === 'skills') {
                updateLink(navLinks[1]);
                if (!snappingDisabled) scrollSnapping(entry.target);
            }
            if (entry.target.id === 'projects') updateLink(navLinks[2]);
            if (entry.target.id === 'contact') updateLink(navLinks[3]);
            if (entry.target.id === targetSection) {
                snappingDisabled = false;
                targetSection = null;
            }
        }
    });
}

const target = 'section';
document.querySelectorAll(target).forEach((i) => {
    if (i) {
        observer.observe(i);
    }
});