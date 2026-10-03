console.log("THEME JS LOADED 👑");


/* ==============================
   THEME CONFIGURATION
================================ */

const THEMES = {

    royal: {
        name: "Royal",
        className: "theme-royal"
    },

    ocean: {
        name: "Ocean",
        className: "theme-ocean"
    },

    midnight: {
        name: "Midnight",
        className: "theme-midnight"
    },

    emerald: {
        name: "Emerald",
        className: "theme-emerald"
    },

    paris: {
        name: "Paris",
        className: "theme-paris"
    }

};


/* ==============================
   DEFAULT THEME
================================ */

const DEFAULT_THEME = "royal";

const THEME_STORAGE_KEY =
    "leRoiTheme";


/* ==============================
   GET SAVED THEME
================================ */

function getSavedTheme() {

    const savedTheme =
        localStorage.getItem(
            THEME_STORAGE_KEY
        );


    if (
        savedTheme &&
        THEMES[savedTheme]
    ) {

        return savedTheme;

    }


    return DEFAULT_THEME;

}


/* ==============================
   APPLY THEME
================================ */

function applyTheme(
    themeName
) {

    /*
       Make sure the requested theme
       actually exists.
    */

    if (
        !THEMES[themeName]
    ) {

        themeName =
            DEFAULT_THEME;

    }


    /*
       Remove previous theme classes.
    */

    Object.values(THEMES)
        .forEach(
            theme => {

                document.body.classList
                    .remove(
                        theme.className
                    );

            }
        );


    /*
       Add the new theme class.
    */

    document.body.classList.add(
        THEMES[themeName].className
    );


    /*
       Save the user's choice.
    */

    localStorage.setItem(
        THEME_STORAGE_KEY,
        themeName
    );


    /*
       Store globally so other JS
       files can access the current theme.
    */

    window.currentLeRoiTheme =
        themeName;
       window.dispatchEvent(
    new CustomEvent(
        "leRoiThemeChanged",
        {
            detail: {
                theme: themeName
            }
        }
    )
);

    console.log(
        "Theme applied:",
        themeName
    );

}


/* ==============================
   CHANGE THEME
================================ */

function changeTheme(
    themeName
) {

    applyTheme(
        themeName
    );

}


/* ==============================
   GET CURRENT THEME
================================ */

function getCurrentTheme() {

    return getSavedTheme();

}


/* ==============================
   INITIALIZE THEME
================================ */

function initializeTheme() {

    const savedTheme =
        getSavedTheme();


    applyTheme(
        savedTheme
    );

}


/* ==============================
   INTERACTIVE MOUSE LIGHT
================================ */

document.addEventListener(
    "pointermove",
    event => {

        const x =
            (event.clientX /
                window.innerWidth) * 100;


        const y =
            (event.clientY /
                window.innerHeight) * 100;


        document.documentElement.style
            .setProperty(
                "--theme-mouse-x",
                `${x}%`
            );


        document.documentElement.style
            .setProperty(
                "--theme-mouse-y",
                `${y}%`
            );

    }
);


/* ==============================
   START THEME SYSTEM
================================ */

initializeTheme();