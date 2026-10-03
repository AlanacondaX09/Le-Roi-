console.log("SETTINGS JS LOADED 👑");

/* =========================================
   THEME NAMES
========================================= */

const settingsThemeNames = {
    royal: "Royal 👑",
    ocean: "Ocean 🌊",
    midnight: "Midnight 🌌",
    emerald: "Emerald 🌿",
    paris: "Paris 🇫🇷"
};


/* =========================================
   STORAGE KEYS
========================================= */

const settingsSoundStorageKey = "leRoiSoundSettings";
const settingsBackgroundStorageKey = "leRoiBackgroundSettings";
const settingsThemeStorageKey = "leRoiTheme";


/* =========================================
   DEFAULT SETTINGS
========================================= */

const settingsDefaultSound = {
    enabled: true,
    volume: 0.7
};

const settingsDefaultBackground = {
    enabled: true,
    intensity: 1
};

let settingsBackground = {
    ...settingsDefaultBackground
};


/* =========================================
   DOM ELEMENTS
========================================= */

const settingsThemeOptions =
    document.querySelectorAll(".theme-option");

const settingsCurrentTheme =
    document.getElementById("currentTheme");

const settingsBackButton =
    document.getElementById("backButton");

const settingsSoundToggle =
    document.getElementById("soundToggle");

const settingsVolumeSlider =
    document.getElementById("volumeSlider");

const settingsVolumeValue =
    document.getElementById("volumeValue");

const settingsTestSoundButton =
    document.getElementById("testSoundButton");

const settingsResetButton =
    document.getElementById("resetSettingsButton");

const settingsBackgroundToggle =
    document.getElementById("backgroundToggle");

const settingsBackgroundIntensity =
    document.getElementById("backgroundIntensity");

const settingsIntensityValue =
    document.getElementById("intensityValue");


/* =========================================
   SOUND
========================================= */

function settingsGetSound() {

    try {

        const saved =
            localStorage.getItem(
                settingsSoundStorageKey
            );

        if (!saved) {
            return {
                ...settingsDefaultSound
            };
        }

        return {
            ...settingsDefaultSound,
            ...JSON.parse(saved)
        };

    } catch (error) {

        console.error(
            "Could not load sound settings:",
            error
        );

        return {
            ...settingsDefaultSound
        };
    }
}


function settingsSaveSound(enabled, volume) {

    const settings = {
        enabled: Boolean(enabled),
        volume: Number(volume)
    };

    localStorage.setItem(
        settingsSoundStorageKey,
        JSON.stringify(settings)
    );

    if (
        typeof window.setSoundEnabled ===
        "function"
    ) {
        window.setSoundEnabled(
            settings.enabled
        );
    }

    if (
        typeof window.setSoundVolume ===
        "function"
    ) {
        window.setSoundVolume(
            settings.volume
        );
    }
}


function settingsUpdateSoundUI() {

    const settings =
        settingsGetSound();

    if (settingsSoundToggle) {

        settingsSoundToggle.checked =
            settings.enabled;
    }

    if (settingsVolumeSlider) {

        settingsVolumeSlider.value =
            Math.round(
                settings.volume * 100
            );
    }

    settingsUpdateVolumeText();
}


function settingsUpdateVolumeText() {

    if (
        !settingsVolumeSlider ||
        !settingsVolumeValue
    ) {
        return;
    }

    settingsVolumeValue.textContent =
        `${settingsVolumeSlider.value}%`;
}


/* =========================================
   BACKGROUND
========================================= */

function settingsLoadBackground() {

    try {

        const saved =
            localStorage.getItem(
                settingsBackgroundStorageKey
            );

        if (!saved) {

            settingsBackground = {
                ...settingsDefaultBackground
            };

            return;
        }

        settingsBackground = {
            ...settingsDefaultBackground,
            ...JSON.parse(saved)
        };

    } catch (error) {

        console.error(
            "Could not load background settings:",
            error
        );

        settingsBackground = {
            ...settingsDefaultBackground
        };
    }
}


function settingsSaveBackground() {

    localStorage.setItem(
        settingsBackgroundStorageKey,
        JSON.stringify(
            settingsBackground
        )
    );
}


function settingsApplyBackground() {

    const background =
        document.getElementById(
            "leRoiInteractiveBackground"
        );

    if (!background) {
        return;
    }

    background.style.display =
        settingsBackground.enabled
            ? "block"
            : "none";

    background.style.opacity =
        settingsBackground.intensity;
}


function settingsUpdateBackgroundUI() {

    if (settingsBackgroundToggle) {

        settingsBackgroundToggle.checked =
            settingsBackground.enabled;
    }

    if (settingsBackgroundIntensity) {

        settingsBackgroundIntensity.value =
            Math.round(
                settingsBackground.intensity * 100
            );
    }

    settingsUpdateIntensityText();
}


function settingsUpdateIntensityText() {

    if (
        !settingsBackgroundIntensity ||
        !settingsIntensityValue
    ) {
        return;
    }

    settingsIntensityValue.textContent =
        `${settingsBackgroundIntensity.value}%`;
}


/* =========================================
   THEME
========================================= */

function settingsUpdateThemeUI(themeName) {

    settingsThemeOptions.forEach(
        option => {

            option.classList.toggle(
                "active",
                option.dataset.theme === themeName
            );

        }
    );

    if (settingsCurrentTheme) {

        settingsCurrentTheme.textContent =
            settingsThemeNames[themeName] ||
            themeName;
    }
}


function settingsApplyTheme(themeName) {

    if (
        typeof window.changeTheme ===
        "function"
    ) {

        window.changeTheme(
            themeName
        );

    } else {

        document.body.classList.remove(
            "theme-royal",
            "theme-ocean",
            "theme-midnight",
            "theme-emerald",
            "theme-paris"
        );

        document.body.classList.add(
            `theme-${themeName}`
        );

        localStorage.setItem(
            settingsThemeStorageKey,
            themeName
        );
    }

    settingsUpdateThemeUI(
        themeName
    );
}


/* =========================================
   THEME CLICK
========================================= */

settingsThemeOptions.forEach(
    option => {

        option.addEventListener(
            "click",
            () => {

                const selectedTheme =
                    option.dataset.theme;

                if (!selectedTheme) {

                    console.error(
                        "Theme option has no data-theme."
                    );

                    return;
                }

                console.log(
                    "THEME CARD CLICKED:",
                    selectedTheme
                );

                settingsApplyTheme(
                    selectedTheme
                );

                if (
                    typeof window.playClickSound ===
                    "function"
                ) {

                    window.playClickSound();
                }
            }
        );

    }
);


/* =========================================
   SOUND TOGGLE
========================================= */

if (settingsSoundToggle) {

    settingsSoundToggle.addEventListener(
        "change",
        () => {

            const current =
                settingsGetSound();

            settingsSaveSound(
                settingsSoundToggle.checked,
                current.volume
            );

        }
    );
}


/* =========================================
   VOLUME
========================================= */

if (settingsVolumeSlider) {

    settingsVolumeSlider.addEventListener(
        "input",
        () => {

            const current =
                settingsGetSound();

            const volume =
                Number(
                    settingsVolumeSlider.value
                ) / 100;

            settingsSaveSound(
                current.enabled,
                volume
            );

            settingsUpdateVolumeText();

        }
    );
}


/* =========================================
   TEST SOUND
========================================= */

if (settingsTestSoundButton) {

    settingsTestSoundButton.addEventListener(
        "click",
        () => {

            if (
                typeof window.playClickSound ===
                "function"
            ) {

                window.playClickSound();

            } else {

                console.warn(
                    "playClickSound() is not available."
                );
            }

        }
    );
}


/* =========================================
   BACKGROUND TOGGLE
========================================= */

if (settingsBackgroundToggle) {

    settingsBackgroundToggle.addEventListener(
        "change",
        () => {

            settingsBackground.enabled =
                settingsBackgroundToggle.checked;

            settingsSaveBackground();
            settingsApplyBackground();

        }
    );
}


/* =========================================
   BACKGROUND INTENSITY
========================================= */

if (settingsBackgroundIntensity) {

    settingsBackgroundIntensity.addEventListener(
        "input",
        () => {

            settingsBackground.intensity =
                Number(
                    settingsBackgroundIntensity.value
                ) / 100;

            settingsSaveBackground();
            settingsApplyBackground();
            settingsUpdateIntensityText();

        }
    );
}


/* =========================================
   BACK BUTTON
========================================= */

if (settingsBackButton) {

    settingsBackButton.addEventListener(
        "click",
        () => {

            window.history.back();

        }
    );
}


/* =========================================
   RESET SETTINGS
========================================= */

if (settingsResetButton) {

    settingsResetButton.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                settingsThemeStorageKey
            );

            localStorage.removeItem(
                settingsSoundStorageKey
            );

            localStorage.removeItem(
                settingsBackgroundStorageKey
            );

            settingsBackground = {
                ...settingsDefaultBackground
            };

            settingsApplyTheme("royal");

            settingsSaveSound(
                true,
                0.7
            );

            settingsApplyBackground();

            settingsUpdateSoundUI();
            settingsUpdateBackgroundUI();

            console.log(
                "Settings reset to defaults 👑"
            );

        }
    );
}


/* =========================================
   INITIALIZE
========================================= */

function settingsInitialize() {

    const savedTheme =
        localStorage.getItem(
            settingsThemeStorageKey
        ) || "royal";

    settingsLoadBackground();

    settingsUpdateThemeUI(
        savedTheme
    );

    settingsUpdateSoundUI();

    settingsUpdateBackgroundUI();

    settingsApplyBackground();

    console.log(
        "Settings initialized 👑"
    );
}


settingsInitialize();