import gsap from 'gsap';

const navBurger: HTMLButtonElement | null = document.querySelector('button.navbar-toggler');
const navExit: HTMLButtonElement | null = document.querySelector('button.btn-close');
const navBar: HTMLElement | null = document.querySelector('#offcanvasNavbar');

const transitionalElems: NodeListOf<Element> | null = document.querySelectorAll('.transitional-elem');

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