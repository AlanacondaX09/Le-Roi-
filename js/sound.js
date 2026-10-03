
/* =========================================
   LE ROI — SOUND SYSTEM 👑
========================================= */

(() => {
    "use strict";

    console.log("SOUND JS LOADED 👑");

    const STORAGE_KEY = "leRoiSoundSettings";

    const DEFAULT_SETTINGS = {
        enabled: true,
        volume: 0.7
    };

    let audioContext = null;

    function getSettings() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            );

            return {
                enabled:
                    typeof saved?.enabled === "boolean"
                        ? saved.enabled
                        : DEFAULT_SETTINGS.enabled,

                volume:
                    typeof saved?.volume === "number"
                        ? Math.max(0, Math.min(1, saved.volume))
                        : DEFAULT_SETTINGS.volume
            };
        } catch {
            return { ...DEFAULT_SETTINGS };
        }
    }

    function saveSettings(settings) {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(settings)
        );
    }

    function getAudioContext() {
        if (!audioContext) {
            const AudioContextClass =
                window.AudioContext ||
                window.webkitAudioContext;

            if (!AudioContextClass) {
                console.warn("Web Audio is not supported.");
                return null;
            }

            audioContext = new AudioContextClass();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume().catch(console.error);
        }

        return audioContext;
    }

    function playTone(
        frequency,
        startTime,
        duration,
        volume,
        type = "sine"
    ) {
        const context = getAudioContext();
        if (!context) return;

        const oscillator = context.createOscillator();
        const gain = context.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(
            frequency,
            startTime
        );

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(
            volume,
            startTime + 0.01
        );
        gain.gain.exponentialRampToValueAtTime(
            0.001,
            startTime + duration
        );

        oscillator.connect(gain);
        gain.connect(context.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration + 0.02);
    }

    function playSound(type) {
        const settings = getSettings();

        if (!settings.enabled || settings.volume <= 0) {
            return;
        }

        const context = getAudioContext();
        if (!context) return;

        const now = context.currentTime;
        const volume = settings.volume * 0.18;

        switch (type) {
            case "click":
                playTone(
                    700, now, 0.07, volume, "sine"
                );
                break;

            case "success":
                playTone(
                    523.25, now, 0.16, volume, "sine"
                );
                playTone(
                    659.25, now + 0.12, 0.18,
                    volume, "sine"
                );
                playTone(
                    783.99, now + 0.24, 0.28,
                    volume, "sine"
                );
                break;

            case "error":
                playTone(
                    330, now, 0.16, volume, "triangle"
                );
                playTone(
                    220, now + 0.14, 0.22,
                    volume, "triangle"
                );
                break;
        }
    }

    function setSoundEnabled(enabled) {
        const settings = getSettings();
        settings.enabled = Boolean(enabled);
        saveSettings(settings);
    }

    function setSoundVolume(volume) {
        const settings = getSettings();

        settings.volume = Math.max(
            0,
            Math.min(1, Number(volume))
        );

        saveSettings(settings);
    }

    // Public sound controls
    window.playClickSound = () => playSound("click");
    window.playSuccessSound = () => playSound("success");
    window.playErrorSound = () => playSound("error");

    window.setSoundEnabled = setSoundEnabled;
    window.setSoundVolume = setSoundVolume;

    window.getLeRoiSoundSettings = getSettings;

})();
