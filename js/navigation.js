console.log("NAVIGATION JS LOADED 👑");


/* =========================================
   LE ROI — NAVIGATION SYSTEM
========================================= */


/* =========================================
   NAVIGATION LINKS
========================================= */

const navigationLinks = [
    {
        name: "Home",
        href: "./index.html"
    },

    {
        name: "Lessons",
        href: "./lessons.html"
    },

    {
        name: "Exams",
        href: "./exams.html"
    },

    {
        name: "Vocabulary",
        href: "#",
        planned: true
    },

    {
        name: "Listening",
        href: "#",
        planned: true
    },

    {
        name: "Settings",
        href: "./settings.html"
    }
];


/* =========================================
   CREATE NAVBAR
========================================= */

function createNavbar() {

    const navbar =
        document.createElement("nav");

    navbar.className =
        "site-navbar";


    navbar.innerHTML = `

        <div class="nav-container">

            <a
                href="./index.html"
                class="nav-logo"
            >
                <span class="nav-logo-icon">
                    👑
                </span>

                <span>
                    Le Roi
                </span>
            </a>


            <button
                class="mobile-menu-button"
                id="mobileMenuButton"
                type="button"
                aria-label="Open navigation menu"
                aria-expanded="false"
            >

                <span></span>
                <span></span>
                <span></span>

            </button>


            <div
                class="nav-links"
                id="navLinks"
            >

                ${navigationLinks.map(
                    link => {

                        if (link.planned) {

                            return `
                                <a
                                    href="#"
                                    class="nav-link planned-link"
                                    data-planned="true"
                                >
                                    ${link.name}
                                    <span class="planned-badge">
                                        Soon
                                    </span>
                                </a>
                            `;

                        }

                        return `
                            <a
                                href="${link.href}"
                                class="nav-link"
                            >
                                ${link.name}
                            </a>
                        `;

                    }
                ).join("")}

            </div>

        </div>

    `;


    document.body.prepend(navbar);


    initializeNavbar();

}


/* =========================================
   INITIALIZE NAVBAR
========================================= */

function initializeNavbar() {

    const menuButton =
        document.getElementById(
            "mobileMenuButton"
        );


    const navLinks =
        document.getElementById(
            "navLinks"
        );


    if (!menuButton || !navLinks) {

        return;

    }


    /* =====================================
       MOBILE MENU
    ===================================== */

    menuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                navLinks.classList.toggle(
                    "open"
                );


            menuButton.classList.toggle(
                "open",
                isOpen
            );


            menuButton.setAttribute(
                "aria-expanded",
                isOpen
            );


            menuButton.setAttribute(
                "aria-label",

                isOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );

        }
    );


    /* =====================================
       CLOSE MENU AFTER NAVIGATION
    ===================================== */

    navLinks
        .querySelectorAll(
            ".nav-link:not(.planned-link)"
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        closeMobileMenu();

                    }
                );

            }
        );


    /* =====================================
       PLANNED FEATURES
    ===================================== */

    navLinks
        .querySelectorAll(
            ".planned-link"
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();


                        alert(
                            `${link.textContent.trim().replace("Soon", "")} is coming soon 👑`
                        );

                    }
                );

            }
        );


    /* =====================================
       ACTIVE PAGE
    ===================================== */

    setActiveNavigation();


    /* =====================================
       CLOSE MENU WHEN CLICKING OUTSIDE
    ===================================== */

    document.addEventListener(
        "click",
        event => {

            const clickedInsideNavbar =
                event.target.closest(
                    ".site-navbar"
                );


            if (
                !clickedInsideNavbar &&
                navLinks.classList.contains("open")
            ) {

                closeMobileMenu();

            }

        }
    );


    /* =====================================
       CLOSE MENU WITH ESCAPE
    ===================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                navLinks.classList.contains("open")
            ) {

                closeMobileMenu();

            }

        }
    );

}


/* =========================================
   CLOSE MOBILE MENU
========================================= */

function closeMobileMenu() {

    const menuButton =
        document.getElementById(
            "mobileMenuButton"
        );


    const navLinks =
        document.getElementById(
            "navLinks"
        );


    if (!menuButton || !navLinks) {

        return;

    }


    navLinks.classList.remove(
        "open"
    );


    menuButton.classList.remove(
        "open"
    );


    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );


    menuButton.setAttribute(
        "aria-label",
        "Open navigation menu"
    );

}


/* =========================================
   ACTIVE NAVIGATION
========================================= */

function setActiveNavigation() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop() || "index.html";


    const navLinks =
        document.querySelectorAll(
            ".nav-link"
        );


    navLinks.forEach(
        link => {

            const href =
                link.getAttribute("href");


            if (!href || href === "#") {

                return;

            }


            const linkPage =
                href
                    .split("/")
                    .pop();


            if (
                linkPage === currentPage
            ) {

                link.classList.add(
                    "active"
                );

            }

        }
    );

}


/* =========================================
   START NAVIGATION
========================================= */

function initializeNavigation() {

    createNavbar();

}


initializeNavigation();

createFooter();

/* =========================================
   CREATE FOOTER
========================================= */

function createFooter() {

    const footer =
        document.createElement("footer");

    footer.className =
        "site-footer";

    footer.innerHTML = `

        <div class="footer-container">

            <div class="footer-brand">
                👑 Le Roi
            </div>

            <p class="footer-credit">
                Created with AlanacondaX09🐍 & code by
                <a
                    href="https://www.facebook.com/ali.elkady.1253?locale=ar_AR"
                    class="creator-link"
                    id="creatorLink"
                >
                    Ali Samir
                </a>
            </p>

            <p class="footer-copy">
                © 2026 Le Roi. All rights reserved.
            </p>

        </div>

    `;

    document.body.appendChild(footer);

}