console.log("LESSONS JS LOADED 👑");


/* ==============================
   DOM ELEMENT
================================ */

const lessonsContainer =
    document.getElementById(
        "lessonsContainer"
    );


/* ==============================
   LOAD LESSONS
================================ */

async function loadLessons() {

    console.log(
        "Loading lessons..."
    );


    /* ==============================
       GET LESSONS FROM SUPABASE
    =============================== */

    const {
        data,
        error
    } = await supabaseClient

        .from("lessons")

        .select(
            "id, title, description, content, image_url, pdf_url, created_at"
        )

        .order(
            "created_at",
            {
                ascending: false
            }
        );


    /* ==============================
       ERROR
    =============================== */

    if (error) {

        console.error(
            "Error loading lessons:",
            error
        );


        lessonsContainer.innerHTML = `

            <p>
                Failed to load lessons.
            </p>

        `;

        return;
    }


    console.log(
        "Lessons loaded:",
        data
    );


    /* ==============================
       NO LESSONS
    =============================== */

    if (
        !data ||
        data.length === 0
    ) {

        lessonsContainer.innerHTML = `

            <p>
                No lessons available yet.
            </p>

        `;

        return;
    }


    /* ==============================
       CLEAR LOADING
    =============================== */

    lessonsContainer.innerHTML = "";


    /* ==============================
       RENDER LESSONS
    =============================== */

    data.forEach(
        lesson => {

            const lessonCard =
                document.createElement(
                    "article"
                );


            lessonCard.className =
                "lesson-card";


            /* ==============================
               IMAGE
            =============================== */

            let imageHTML = "";


            if (
                lesson.image_url
            ) {

                imageHTML = `

                    <img
                        src="${escapeHTML(
                            lesson.image_url
                        )}"
                        alt="${escapeHTML(
                            lesson.title
                        )}"
                        loading="lazy"
                    >

                `;

            }


            /* ==============================
               PDF BUTTON
            =============================== */

            let pdfHTML = "";


            if (
                lesson.pdf_url
            ) {

                pdfHTML = `

                    <button
                        type="button"
                        class="pdf-button"
                        data-pdf="${escapeHTML(
                            lesson.pdf_url
                        )}"
                    >
                        Open Summary PDF
                    </button>

                `;

            }


            /* ==============================
               CARD HTML
            =============================== */

            lessonCard.innerHTML = `

                ${
                    imageHTML
                }


                <div class="lesson-content">

                    <h3>
                        ${escapeHTML(
                            lesson.title
                        )}
                    </h3>


                    ${
                        lesson.description
                            ? `
                                <p>
                                    ${escapeHTML(
                                        lesson.description
                                    )}
                                </p>
                              `
                            : ""
                    }


                    ${
                        lesson.content
                            ? `
                                <div
                                    class="lesson-summary"
                                >
                                    ${formatContent(
                                        lesson.content
                                    )}
                                </div>
                              `
                            : ""
                    }


                    ${
                        pdfHTML
                    }

                </div>

            `;


            lessonsContainer.appendChild(
                lessonCard
            );

        }
    );


    /* ==============================
       PDF BUTTONS
    =============================== */

    setupPDFButtons();

}


/* ==============================
   PDF BUTTONS
================================ */

function setupPDFButtons() {

    const pdfButtons =
        document.querySelectorAll(
            ".pdf-button"
        );


    pdfButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                async () => {

                    const pdfPath =
                        button.dataset.pdf;


                    if (!pdfPath) {

                        return;

                    }


                    await openLessonPDF(
                        pdfPath
                    );

                }
            );

        }
    );

}


/* ==============================
   OPEN PRIVATE PDF
================================ */

async function openLessonPDF(
    pdfPath
) {

    console.log(
        "Opening lesson PDF:",
        pdfPath
    );


    /*
       lesson-pdfs is a PRIVATE bucket.

       Therefore we cannot simply use
       a public URL.

       We create a temporary signed URL.
    */

    const {
        data,
        error
    } = await supabaseClient
        .storage
        .from("lesson-pdfs")
        .createSignedUrl(
            pdfPath,
            60 * 5
        );


    if (error) {

        console.error(
            "Error creating PDF URL:",
            error
        );


        alert(
            "Unable to open the lesson PDF."
        );

        return;
    }


    if (
        !data ||
        !data.signedUrl
    ) {

        alert(
            "PDF URL could not be created."
        );

        return;
    }


    window.open(
        data.signedUrl,
        "_blank"
    );

}


/* ==============================
   FORMAT LESSON CONTENT
================================ */

function formatContent(
    content
) {

    if (!content) {

        return "";

    }


    /*
       Keep the lesson content as text
       and convert line breaks into
       readable paragraphs.
    */

    return escapeHTML(
        content
    )
    .replace(
        /\r\n/g,
        "\n"
    )
    .replace(
        /\r/g,
        "\n"
    )
    .split("\n")
    .map(
        line => {

            if (
                line.trim() === ""
            ) {

                return "";

            }


            return `
                <p>
                    ${line}
                </p>
            `;

        }
    )
    .join("");

}


/* ==============================
   ESCAPE HTML
================================ */

function escapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* ==============================
   START
================================ */

loadLessons();