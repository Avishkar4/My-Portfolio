document.addEventListener("DOMContentLoaded", () => {
    
    // Ensure GSAP plugins are fully registered
    gsap.registerPlugin(ScrollTrigger);

    /* ==========================================================================
       1. Lenis Smooth Scroll Engine Integration
       ========================================================================== */
    const lenis = new Lenis({
        duration: 1.4,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Heavy, premium fluid dampening
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth60Hz: true,
        infinite: false
    });

    // Synchronize Lenis scrolling engine milestones straight into GSAP's operations loop
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    /* ==========================================================================
       2. Modular Navigation Link Fix
       ========================================================================== */
    const navLinks = document.querySelectorAll(".nav-item, .logo, .hero-cta-group a");
    
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            const targetId = link.getAttribute("href");
            
            // Check if the link target is a valid on-page element anchor
            if (targetId && targetId.startsWith("#")) {
                e.preventDefault();
                
                if (targetId === "#") {
                    lenis.scrollTo(0);
                } else {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        // Offset scroll execution to account for fixed global header navigation clearance
                        lenis.scrollTo(targetElement, {
                            offset: -80
                        });
                    }
                }
            }
        });
    });

    /* ==========================================================================
       3. Precision Custom Cursor Mechanics
       ========================================================================== */
    const cursorDot = document.querySelector(".custom-cursor-dot");
    const cursorRing = document.querySelector(".custom-cursor-ring");
    
    if (cursorDot && cursorRing) {
        window.addEventListener("mousemove", (e) => {
            // Smooth micro-lag positioning via basic GSAP transform injection
            gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.05 });
            gsap.to(cursorRing, { x: e.clientX, y: e.clientY, duration: 0.25 });
        });

        // Expand target interaction states across buttons/interactive components
        const interactiveTargets = document.querySelectorAll("a, .btn, .metric-card, .experience-card, .cert-card, .achievement-row");
        interactiveTargets.forEach(target => {
            target.addEventListener("mouseenter", () => {
                cursorRing.style.width = "50px";
                cursorRing.style.height = "50px";
                cursorRing.style.borderColor = "#FFFFFF";
            });
            target.addEventListener("mouseleave", () => {
                cursorRing.style.width = "34px";
                cursorRing.style.height = "34px";
                cursorRing.style.borderColor = "#636366";
            });
        });
    }

    /* ==========================================================================
       4. Core Animation Profiles (GSAP & ScrollTrigger)
       ========================================================================== */
    
    // --- Hero Entrance Reveal Logic ---
    const initialTimeline = gsap.timeline();
    
    initialTimeline.from(".reveal-text", {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out"
    }).from(".split-words", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.8").from(".reveal-element", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out"
    }, "-=0.6");

    // --- Modular Block Component Scroll Triggers ---
    const explicitScrollElements = document.querySelectorAll(".section .reveal-element, .timeline-item, .metric-card, .cert-card, .achievement-row");
    
    explicitScrollElements.forEach((element) => {
        gsap.fromTo(element, 
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 0.85,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 88%", // Triggers reliably before entering the main viewport field
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // --- Parallax Imagery Logic Execution ---
    const parallaxContainer = document.querySelector(".parallax-banner");
    const parallaxTarget = document.querySelector(".parallax-bg");
    
    if (parallaxContainer && parallaxTarget) {
        const structuralSpeed = parseFloat(parallaxTarget.getAttribute("data-speed")) || 0.3;
        
        gsap.fromTo(parallaxTarget,
            { y: 0 },
            {
                y: () => parallaxContainer.offsetHeight * structuralSpeed,
                ease: "none",
                scrollTrigger: {
                    trigger: parallaxContainer,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            }
        );
    }

    /* ==========================================================================
       5. Horizontal Gallery Scroll Execution Matrix
       ========================================================================== */
    const sliderContainer = document.querySelector(".horizontal-slider");
    const structuralContainer = document.getElementById("projects-pin-container");
    
    if (sliderContainer && structuralContainer) {
        const projectSlides = document.querySelectorAll(".slide");
        const aggregateSlidesCount = projectSlides.length;
        
        // Match width parameters dynamically
        sliderContainer.style.width = `${aggregateSlidesCount * 100}vw`;

        gsap.to(sliderContainer, {
            x: () => -(sliderContainer.scrollWidth - window.innerWidth),
            ease: "none",
            scrollTrigger: {
                trigger: structuralContainer,
                pin: true,
                scrub: 1, // High responsiveness translation tracking
                start: "top top",
                end: () => `+=${sliderContainer.scrollWidth - window.innerWidth}`,
                invalidateOnRefresh: true
            }
        });
    }
});