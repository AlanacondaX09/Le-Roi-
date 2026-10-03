/* =========================================
   LE ROI — SERVICE WORKER 👑
========================================= */

const CACHE_NAME = "le-roi-v1";


const APP_SHELL = [

    "./",

    "./index.html",

    "./manifest.json",

    /* =========================
       CSS
    ========================= */

    "./css/main.css",
    "./css/themes.css",


    /* =========================
       JAVASCRIPT
    ========================= */

    "./js/supabase.js",
    "./js/theme.js",
    "./js/settings.js",
    "./js/navigation.js",
    "./js/sound.js",
    "./js/background.js",

    "./js/lessons.js",
    "./js/exams.js",
    "./js/exam.js",
    "./js/results.js",


    /* =========================
       PAGES
    ========================= */

    "./lessons.html",
    "./exams.html",
    "./exam.html",
    "./results.html",
    "./settings.html",


    /* =========================
       PWA ICONS
    ========================= */

    "./assets/icon/icon-192.png",
    "./assets/icon/icon-512.png"

];


/* =========================================
   INSTALL
========================================= */

self.addEventListener("install", event => {

    console.log("LE ROI SERVICE WORKER — INSTALL 👑");

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                console.log(
                    "Caching Le Roi app shell..."
                );

                return cache.addAll(APP_SHELL);

            })

    );

    self.skipWaiting();

});


/* =========================================
   ACTIVATE
========================================= */

self.addEventListener("activate", event => {

    console.log("LE ROI SERVICE WORKER — ACTIVATE 👑");

    event.waitUntil(

        caches.keys()
            .then(cacheNames => {

                return Promise.all(

                    cacheNames
                        .filter(
                            cacheName =>
                                cacheName !== CACHE_NAME
                        )
                        .map(
                            cacheName =>
                                caches.delete(cacheName)
                        )

                );

            })

    );

    self.clients.claim();

});


/* =========================================
   FETCH
========================================= */

self.addEventListener("fetch", event => {

    const request = event.request;


    /* =========================
       Only handle GET requests
    ========================= */

    if (request.method !== "GET") {
        return;
    }


    /* =========================
       Navigation requests
       Network first
    ========================= */

    if (request.mode === "navigate") {

        event.respondWith(

            fetch(request)

                .then(response => {

                    const responseClone =
                        response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {

                            cache.put(
                                request,
                                responseClone
                            );

                        });

                    return response;

                })

                .catch(() => {

                    return caches.match(
                        request
                    )
                    .then(cachedPage => {

                        return (
                            cachedPage ||
                            caches.match(
                                "./index.html"
                            )
                        );

                    });

                })

        );

        return;
    }


    /* =========================
       Static files
       Cache first
    ========================= */

    event.respondWith(

        caches.match(request)

            .then(cachedResponse => {

                if (cachedResponse) {

                    return cachedResponse;

                }


                return fetch(request)

                    .then(response => {

                        if (
                            !response ||
                            response.status !== 200 ||
                            response.type === "opaque"
                        ) {

                            return response;

                        }


                        const responseClone =
                            response.clone();


                        caches.open(CACHE_NAME)
                            .then(cache => {

                                cache.put(
                                    request,
                                    responseClone
                                );

                            });


                        return response;

                    });

            })

    );

});