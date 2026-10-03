console.log("BACKGROUND JS LOADED 👑");


/* =========================================================
   LE ROI — INTERACTIVE BACKGROUND SYSTEM
========================================================= */


/* =========================================================
   CONFIGURATION
========================================================= */

const BACKGROUND_CONTAINER_ID =
    "leRoiInteractiveBackground";

const PARTICLES_CONTAINER_ID =
    "leRoiParticles";

const BACKGROUND_STORAGE_KEY =
    "leRoiBackgroundSettings";


const BACKGROUND_THEMES = {

    royal: {
        colors: [
            "#d7ad55",
            "#ffe4a0",
            "#ffffff"
        ],
        lineColor: "#d7ad55",
        count: 55,
        speed: 0.7,
        size: {
            min: 1,
            max: 3
        }
    },

    ocean: {
        colors: [
            "#62d9ff",
            "#9cecff",
            "#ffffff"
        ],
        lineColor: "#62d9ff",
        count: 65,
        speed: 1.1,
        size: {
            min: 1,
            max: 3
        }
    },

    midnight: {
        colors: [
            "#ffffff",
            "#b9c7ff",
            "#7f8cff"
        ],
        lineColor: "#8f9bff",
        count: 80,
        speed: 0.35,
        size: {
            min: 1,
            max: 2.5
        }
    },

    emerald: {
        colors: [
            "#62f5a8",
            "#a8ffd0",
            "#ffffff"
        ],
        lineColor: "#62f5a8",
        count: 60,
        speed: 0.75,
        size: {
            min: 1,
            max: 3
        }
    },

    paris: {
        colors: [
            "#d7ad55",
            "#ffe4a0",
            "#ffffff"
        ],
        lineColor: "#d7ad55",
        count: 50,
        speed: 0.5,
        size: {
            min: 1,
            max: 3
        }
    }

};


/* =========================================================
   STATE
========================================================= */

let backgroundContainer = null;

let particlesCanvas = null;

let animationFrame = null;

let particles = [];

let currentTheme = "royal";

let backgroundSettings = {
    enabled: true,
    intensity: 1
};


/* =========================================================
   CREATE BACKGROUND CONTAINER
========================================================= */

function createBackgroundContainer() {

    let container =
        document.getElementById(
            BACKGROUND_CONTAINER_ID
        );

    if (container) {

        backgroundContainer =
            container;

        return;

    }


    container =
        document.createElement("div");


    container.id =
        BACKGROUND_CONTAINER_ID;


    container.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.prepend(
        container
    );


    backgroundContainer =
        container;

}


/* =========================================================
   STYLE BACKGROUND CONTAINER
========================================================= */

function styleBackgroundContainer() {

    if (!backgroundContainer) {
        return;
    }


    backgroundContainer.style.position =
        "fixed";

    backgroundContainer.style.inset =
        "0";

    backgroundContainer.style.width =
        "100%";

    backgroundContainer.style.height =
        "100%";

    backgroundContainer.style.pointerEvents =
        "none";

    backgroundContainer.style.overflow =
        "hidden";

    /*
       IMPORTANT:
       We keep this above the body background
       but below the website content.
    */

    backgroundContainer.style.zIndex =
        "0";


    backgroundContainer.style.opacity =
        String(
            backgroundSettings.intensity
        );


    backgroundContainer.style.transition =
        "opacity 0.3s ease";


    backgroundContainer.style.mixBlendMode =
        "screen";

}


/* =========================================================
   CREATE CANVAS
========================================================= */

function createCanvas() {

    if (!backgroundContainer) {
        return;
    }


    if (particlesCanvas) {

        particlesCanvas.remove();

    }


    particlesCanvas =
        document.createElement("canvas");


    particlesCanvas.id =
        PARTICLES_CONTAINER_ID;


    particlesCanvas.style.position =
        "absolute";

    particlesCanvas.style.inset =
        "0";

    particlesCanvas.style.width =
        "100%";

    particlesCanvas.style.height =
        "100%";


    particlesCanvas.style.display =
        "block";


    backgroundContainer.appendChild(
        particlesCanvas
    );


    resizeCanvas();

}


/* =========================================================
   RESIZE CANVAS
========================================================= */

function resizeCanvas() {

    if (!particlesCanvas) {
        return;
    }


    const dpr =
        Math.min(
            window.devicePixelRatio || 1,
            2
        );


    particlesCanvas.width =
        window.innerWidth * dpr;


    particlesCanvas.height =
        window.innerHeight * dpr;


    const context =
        particlesCanvas.getContext("2d");


    if (context) {

        context.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

    }

}


/* =========================================================
   CREATE PARTICLES
========================================================= */

function createParticles() {

    const config =
        BACKGROUND_THEMES[currentTheme] ||
        BACKGROUND_THEMES.royal;


    particles = [];


    const count =
        config.count;


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const color =
            config.colors[
                Math.floor(
                    Math.random() *
                    config.colors.length
                )
            ];


        const angle =
            Math.random() *
            Math.PI *
            2;


        const speed =
            (
                Math.random() *
                0.5 +
                0.5
            ) *
            config.speed;


        particles.push({

            x:
                Math.random() *
                window.innerWidth,

            y:
                Math.random() *
                window.innerHeight,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            size:
                config.size.min +
                Math.random() *
                (
                    config.size.max -
                    config.size.min
                ),

            opacity:
                0.25 +
                Math.random() *
                0.5,

            color:
                color

        });

    }

}


/* =========================================================
   DRAW PARTICLES
========================================================= */

function drawParticles() {

    if (
        !particlesCanvas ||
        !backgroundSettings.enabled
    ) {
        return;
    }


    const context =
        particlesCanvas.getContext("2d");


    if (!context) {
        return;
    }


    context.clearRect(
        0,
        0,
        window.innerWidth,
        window.innerHeight
    );


    const config =
        BACKGROUND_THEMES[currentTheme] ||
        BACKGROUND_THEMES.royal;


    const maxDistance =
        150;


    /*
       Draw connections
    */

    for (
        let i = 0;
        i < particles.length;
        i++
    ) {

        const particleA =
            particles[i];


        for (
            let j = i + 1;
            j < particles.length;
            j++
        ) {

            const particleB =
                particles[j];


            const dx =
                particleA.x -
                particleB.x;


            const dy =
                particleA.y -
                particleB.y;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            if (
                distance <=
                maxDistance
            ) {

                const opacity =
                    (
                        1 -
                        distance /
                        maxDistance
                    ) *
                    0.18 *
                    backgroundSettings.intensity;


                context.beginPath();


                context.moveTo(
                    particleA.x,
                    particleA.y
                );


                context.lineTo(
                    particleB.x,
                    particleB.y
                );


                context.strokeStyle =
                    hexToRgba(
                        config.lineColor,
                        opacity
                    );


                context.lineWidth =
                    1;


                context.stroke();

            }

        }

    }


    /*
       Draw particles
    */

    particles.forEach(
        particle => {

            context.beginPath();


            context.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );


            context.fillStyle =
                hexToRgba(
                    particle.color,
                    particle.opacity *
                    backgroundSettings.intensity
                );


            context.fill();

        }
    );

}


/* =========================================================
   UPDATE PARTICLES
========================================================= */

function updateParticles() {

    if (
        !backgroundSettings.enabled
    ) {
        return;
    }


    particles.forEach(
        particle => {

            particle.x +=
                particle.vx;


            particle.y +=
                particle.vy;


            /*
               Wrap around screen
            */

            if (
                particle.x < -20
            ) {

                particle.x =
                    window.innerWidth + 20;

            }


            if (
                particle.x >
                window.innerWidth + 20
            ) {

                particle.x = -20;

            }


            if (
                particle.y < -20
            ) {

                particle.y =
                    window.innerHeight + 20;

            }


            if (
                particle.y >
                window.innerHeight + 20
            ) {

                particle.y = -20;

            }

        }
    );

}


/* =========================================================
   ANIMATION LOOP
========================================================= */

function animateBackground() {

    updateParticles();

    drawParticles();


    animationFrame =
        requestAnimationFrame(
            animateBackground
        );

}


/* =========================================================
   START ANIMATION
========================================================= */

function startAnimation() {

    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

    }


    animationFrame =
        requestAnimationFrame(
            animateBackground
        );

}


/* =========================================================
   STOP ANIMATION
========================================================= */

function stopAnimation() {

    if (!animationFrame) {
        return;
    }


    cancelAnimationFrame(
        animationFrame
    );


    animationFrame =
        null;

}


/* =========================================================
   HEX → RGBA
========================================================= */

function hexToRgba(
    hex,
    alpha
) {

    const cleanHex =
        hex.replace(
            "#",
            ""
        );


    const bigint =
        parseInt(
            cleanHex,
            16
        );


    const r =
        (bigint >> 16) & 255;


    const g =
        (bigint >> 8) & 255;


    const b =
        bigint & 255;


    return `
        rgba(
            ${r},
            ${g},
            ${b},
            ${alpha}
        )
    `;

}


/* =========================================================
   MOUSE INTERACTION
========================================================= */

let mouseX = null;

let mouseY = null;


document.addEventListener(
    "pointermove",
    event => {

        mouseX =
            event.clientX;

        mouseY =
            event.clientY;

    }
);


/* =========================================================
   MOUSE EFFECT
========================================================= */

function applyMouseInteraction() {

    if (
        mouseX === null ||
        mouseY === null
    ) {
        return;
    }


    particles.forEach(
        particle => {

            const dx =
                mouseX -
                particle.x;


            const dy =
                mouseY -
                particle.y;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dy * dy
                );


            const interactionRadius =
                140;


            if (
                distance <
                interactionRadius
            ) {

                const force =
                    (
                        interactionRadius -
                        distance
                    ) /
                    interactionRadius;


                particle.x -=
                    (
                        dx /
                        (distance || 1)
                    ) *
                    force *
                    0.35;


                particle.y -=
                    (
                        dy /
                        (distance || 1)
                    ) *
                    force *
                    0.35;

            }

        }
    );

}


/* =========================================================
   PATCH UPDATE LOOP
========================================================= */

const originalUpdateParticles =
    updateParticles;


updateParticles =
    function () {

        originalUpdateParticles();

        applyMouseInteraction();

    };


/* =========================================================
   CHANGE THEME
========================================================= */

function changeInteractiveBackground(
    themeName
) {

    if (
        !BACKGROUND_THEMES[themeName]
    ) {

        themeName =
            "royal";

    }


    currentTheme =
        themeName;


    createParticles();


    console.log(
        "Interactive background changed:",
        themeName
    );

}


/* =========================================================
   APPLY BACKGROUND SETTINGS
========================================================= */

function applyBackgroundSettings() {

    if (!backgroundContainer) {
        return;
    }


    backgroundContainer.style.display =
        backgroundSettings.enabled
            ? "block"
            : "none";


    backgroundContainer.style.opacity =
        String(
            backgroundSettings.intensity
        );


    if (
        backgroundSettings.enabled
    ) {

        startAnimation();

    } else {

        stopAnimation();

    }

}


/* =========================================================
   LOAD SETTINGS
========================================================= */

function loadBackgroundSettings() {

    const saved =
        localStorage.getItem(
            BACKGROUND_STORAGE_KEY
        );


    if (!saved) {
        return;
    }


    try {

        const parsed =
            JSON.parse(saved);


        backgroundSettings = {

            ...backgroundSettings,

            ...parsed

        };

    } catch (error) {

        console.warn(
            "Could not load background settings:",
            error
        );

    }

}


/* =========================================================
   REDUCED MOTION
========================================================= */

function handleReducedMotion() {

    const mediaQuery =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        );


    if (
        mediaQuery.matches
    ) {

        stopAnimation();

    }

}


/* =========================================================
   THEME CHANGE LISTENER
========================================================= */

window.addEventListener(
    "leRoiThemeChanged",
    event => {

        const themeName =
            event.detail?.theme ||
            "royal";


        changeInteractiveBackground(
            themeName
        );

    }
);


/* =========================================================
   WINDOW RESIZE
========================================================= */

window.addEventListener(
    "resize",
    () => {

        resizeCanvas();

        createParticles();

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

function initializeBackground() {

    loadBackgroundSettings();


    createBackgroundContainer();


    styleBackgroundContainer();


    createCanvas();


    currentTheme =
        window.currentLeRoiTheme ||
        localStorage.getItem(
            "leRoiTheme"
        ) ||
        "royal";


    changeInteractiveBackground(
        currentTheme
    );


    applyBackgroundSettings();


    handleReducedMotion();


    console.log(
        "Interactive background initialized 👑"
    );

}


/* =========================================================
   START
========================================================= */

initializeBackground();