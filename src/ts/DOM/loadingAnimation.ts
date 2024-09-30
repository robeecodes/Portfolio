import gsap from "gsap";

export default function loadingAnimation(): void {
    const balls = document.querySelectorAll(".ball");
    const shadows = document.querySelectorAll(".shadow");

    balls.forEach((ball: Element, idx: number) => {
        const tl = gsap.timeline({
            repeat: -1,
            delay: (idx + 1) / 10
        });

        // Squish at bottom
        tl.to(ball, {
            scaleY: 0.5,
            scaleX: 1.2,
            y: 0,
            duration: 0.5,
            ease: "power1.out",
        }, "-=0.1");

        tl.to(ball, {
            scaleY: 1.4,
            scaleX: 1,
            y: 0,
            duration: 0.3,
            ease: "power1.out"
        }, "-=0.2");

        // Ball up
        tl.to(ball, {
            scaleY: 1,
            y: -100,
            duration: 1,
            ease: "power2.out"
        }, "-=0.2");

        tl.to(ball, {
            scaleY: 1.4,
            y: 0,
            duration: 1,
            ease: "power1.in",
        });
    });

    shadows.forEach((shadow: Element, idx : number) => {
        const tl = gsap.timeline({
            repeat: -1,
            delay: (idx + 1) / 10
        });
        // Shadow stretches as the ball squishes
        tl.to(shadow, {
            scaleX: 1,
            duration: .3,
            opacity: 1
        });

        // Shadow shrinks as the ball goes up
        tl.to(shadow, {
            scaleX: 0.5,
            duration: 1.6,
            opacity: 0.2
        });

        tl.to(shadow, {
            scaleX: 1,
            duration: .6,
            opacity: 1
        }, "-=0.1");
    });
}