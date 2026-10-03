console.log("LESSONS JS LOADED 👑");

// ========================================
// ELEMENTS
// ========================================

const lessonForm = document.getElementById("lessonForm");

const lessonMessage = document.getElementById("lessonMessage");

const lessonsContainer = document.getElementById("lessonsContainer");

const backButton = document.getElementById("backButton");

const lessonImageInput = document.getElementById("lessonImage");

const lessonPDFInput = document.getElementById("lessonPDF");


// ========================================
// CURRENT EDITING LESSON
// ========================================

let editingLessonId = null;


// ========================================
// BACK TO DASHBOARD
// ========================================

if (backButton) {

    backButton.addEventListener("click", () => {

        window.location.href = "./dashboard.html";

    });

}


// ========================================
// ADD / UPDATE LESSON
// ========================================

if (lessonForm) {

    lessonForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        // ========================================
        // GET FORM DATA
        // ========================================

        const title =
            document.getElementById("lessonTitle").value.trim();

        const description =
            document.getElementById("lessonDescription").value.trim();

        const content =
            document.getElementById("lessonContent").value.trim();

        const imageFile =
            lessonImageInput.files[0];

        const pdfFile =
            lessonPDFInput.files[0];


        // ========================================
        // VALIDATION
        // ========================================

        if (!title) {

            lessonMessage.textContent =
                "Please enter a lesson title.";

            return;
        }


        // ========================================
        // UPDATE EXISTING LESSON
        // ========================================

        if (editingLessonId) {

            await updateLesson(
                title,
                description,
                content,
                imageFile,
                pdfFile
            );

            return;
        }


        // ========================================
        // ADD NEW LESSON
        // ========================================

        await addLesson(
            title,
            description,
            content,
            imageFile,
            pdfFile
        );

    });

}


// ========================================
// ADD NEW LESSON
// ========================================

async function addLesson(
    title,
    description,
    content,
    imageFile,
    pdfFile
) {

    try {

        lessonMessage.textContent =
            "Preparing lesson...";


        let imageUrl = null;

        let pdfPath = null;


        // ========================================
        // UPLOAD IMAGE
        // ========================================

        if (imageFile) {

            const uploadedImage =
                await uploadLessonImage(imageFile);


            if (!uploadedImage) {

                return;
            }


            imageUrl =
                uploadedImage;

        }


        // ========================================
        // UPLOAD PDF
        // ========================================

        if (pdfFile) {

            const uploadedPDF =
                await uploadLessonPDF(pdfFile);


            if (!uploadedPDF) {

                return;
            }


            pdfPath =
                uploadedPDF;

        }


        // ========================================
        // INSERT LESSON INTO DATABASE
        // ========================================

        lessonMessage.textContent =
            "Saving lesson...";


        const {
            data,
            error
        } =
            await supabaseClient
                .from("lessons")
                .insert([
                    {
                        title: title,
                        description: description,
                        content: content,
                        image_url: imageUrl,
                        pdf_url: pdfPath
                    }
                ])
                .select();


        if (error) {

            console.error(
                "Add Lesson Error:",
                error
            );


            lessonMessage.textContent =
                "Could not save lesson.";

            return;
        }


        console.log(
            "Lesson added:",
            data
        );


        lessonMessage.textContent =
            "Lesson saved successfully! 👑";


        lessonForm.reset();


        await loadLessons();

    }

    catch (error) {

        console.error(
            "Unexpected Add Lesson Error:",
            error
        );


        lessonMessage.textContent =
            "Something went wrong.";

    }

}


// ========================================
// UPDATE LESSON
// ========================================

async function updateLesson(
    title,
    description,
    content,
    imageFile,
    pdfFile
) {

    try {

        lessonMessage.textContent =
            "Loading lesson...";


        // ========================================
        // GET CURRENT LESSON
        // ========================================

        const {
            data: oldLesson,
            error: oldLessonError
        } =
            await supabaseClient
                .from("lessons")
                .select("*")
                .eq("id", editingLessonId)
                .single();


        if (oldLessonError) {

            console.error(
                "Get Lesson Error:",
                oldLessonError
            );


            lessonMessage.textContent =
                "Could not load lesson.";

            return;
        }


        // ========================================
        // KEEP OLD FILES
        // ========================================

        let imageUrl =
            oldLesson.image_url || null;


        let pdfPath =
            oldLesson.pdf_url || null;


        // ========================================
        // UPLOAD NEW IMAGE
        // ========================================

        if (imageFile) {

            const uploadedImage =
                await uploadLessonImage(imageFile);


            if (!uploadedImage) {

                return;
            }


            imageUrl =
                uploadedImage;

        }


        // ========================================
        // UPLOAD NEW PDF
        // ========================================

        if (pdfFile) {

            const uploadedPDF =
                await uploadLessonPDF(pdfFile);


            if (!uploadedPDF) {

                return;
            }


            pdfPath =
                uploadedPDF;

        }


        // ========================================
        // UPDATE DATABASE
        // ========================================

        lessonMessage.textContent =
            "Updating lesson...";


        const {
            data,
            error
        } =
            await supabaseClient
                .from("lessons")
                .update({
                    title: title,
                    description: description,
                    content: content,
                    image_url: imageUrl,
                    pdf_url: pdfPath
                })
                .eq("id", editingLessonId)
                .select();


        if (error) {

            console.error(
                "Update Lesson Error:",
                error
            );


            lessonMessage.textContent =
                "Could not update lesson.";

            return;
        }


        console.log(
            "Lesson updated:",
            data
        );


        lessonMessage.textContent =
            "Lesson updated successfully! 👑";


        editingLessonId = null;


        lessonForm.reset();


        resetFormButton();


        await loadLessons();

    }

    catch (error) {

        console.error(
            "Unexpected Update Error:",
            error
        );


        lessonMessage.textContent =
            "Something went wrong.";

    }

}


// ========================================
// UPLOAD LESSON IMAGE
// ========================================

async function uploadLessonImage(file) {

    // ========================================
    // CHECK TYPE
    // ========================================

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];


    if (!allowedTypes.includes(file.type)) {

        lessonMessage.textContent =
            "Please select a JPG, PNG, or WEBP image.";

        return null;
    }


    // ========================================
    // CHECK SIZE
    // ========================================

    const maxSize =
        5 * 1024 * 1024;


    if (file.size > maxSize) {

        lessonMessage.textContent =
            "Image must be smaller than 5MB.";

        return null;
    }


    // ========================================
    // CREATE UNIQUE FILE NAME
    // ========================================

    const fileExtension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    const fileName =
        `${crypto.randomUUID()}.${fileExtension}`;


    const filePath =
        `lessons/${fileName}`;


    console.log(
        "Uploading image:",
        filePath
    );


    lessonMessage.textContent =
        "Uploading image...";


    // ========================================
    // UPLOAD TO SUPABASE STORAGE
    // ========================================

    const {
        error
    } =
        await supabaseClient
            .storage
            .from("lesson-images")
            .upload(
                filePath,
                file,
                {
                    cacheControl: "3600",
                    upsert: false
                }
            );


    if (error) {

        console.error(
            "Image Upload Error:",
            error
        );


        lessonMessage.textContent =
            "Could not upload image.";

        return null;
    }


    // ========================================
    // GET PUBLIC URL
    // ========================================

    const {
        data
    } =
        supabaseClient
            .storage
            .from("lesson-images")
            .getPublicUrl(filePath);


    console.log(
        "Image URL:",
        data.publicUrl
    );


    return data.publicUrl;

}


// ========================================
// UPLOAD LESSON PDF
// ========================================

async function uploadLessonPDF(file) {

    // ========================================
    // CHECK TYPE
    // ========================================

    if (file.type !== "application/pdf") {

        lessonMessage.textContent =
            "Please select a PDF file.";

        return null;
    }


    // ========================================
    // CHECK SIZE
    // ========================================

    const maxSize =
        20 * 1024 * 1024;


    if (file.size > maxSize) {

        lessonMessage.textContent =
            "PDF must be smaller than 20MB.";

        return null;
    }


    // ========================================
    // CREATE UNIQUE FILE NAME
    // ========================================

    const fileName =
        `${crypto.randomUUID()}.pdf`;


    const filePath =
        `lessons/${fileName}`;


    console.log(
        "Uploading PDF:",
        filePath
    );


    lessonMessage.textContent =
        "Uploading PDF...";


    // ========================================
    // UPLOAD TO PRIVATE STORAGE
    // ========================================

    const {
        error
    } =
        await supabaseClient
            .storage
            .from("lesson-pdfs")
            .upload(
                filePath,
                file,
                {
                    cacheControl: "3600",
                    upsert: false
                }
            );


    if (error) {

        console.error(
            "PDF Upload Error:",
            error
        );


        lessonMessage.textContent =
            "Could not upload PDF.";

        return null;
    }


    console.log(
        "PDF uploaded successfully:",
        filePath
    );


    return filePath;

}


// ========================================
// LOAD LESSONS
// ========================================

async function loadLessons() {

    lessonsContainer.innerHTML =
        "<p>Loading lessons...</p>";


    const {
        data,
        error
    } =
        await supabaseClient
            .from("lessons")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Load Lessons Error:",
            error
        );


        lessonsContainer.innerHTML =
            "<p>Could not load lessons.</p>";

        return;
    }


    // ========================================
    // NO LESSONS
    // ========================================

    if (!data || data.length === 0) {

        lessonsContainer.innerHTML =
            "<p>No lessons yet.</p>";

        return;
    }


    lessonsContainer.innerHTML = "";


    // ========================================
    // CREATE LESSON CARDS
    // ========================================

    data.forEach((lesson) => {

        const lessonCard =
            document.createElement("div");


        lessonCard.className =
            "lesson-card";


        // ========================================
        // IMAGE
        // ========================================

        let imageHTML = "";


        if (lesson.image_url) {

            imageHTML = `

                <img
                    src="${escapeHTML(
                        lesson.image_url
                    )}"
                    alt="${escapeHTML(
                        lesson.title
                    )}"
                    class="lesson-image"
                >

            `;

        }


        // ========================================
        // PDF STATUS
        // ========================================

        let pdfHTML = "";


        if (lesson.pdf_url) {

            pdfHTML = `

                <p class="pdf-status">
                    📄 PDF attached
                </p>

            `;

        }


        // ========================================
        // CARD HTML
        // ========================================

        lessonCard.innerHTML = `

            ${imageHTML}

            <h3>
                ${escapeHTML(
                    lesson.title
                )}
            </h3>

            <p>
                ${escapeHTML(
                    lesson.description || ""
                )}
            </p>

            ${pdfHTML}

            <small>
                ${new Date(
                    lesson.created_at
                ).toLocaleString()}
            </small>

            <div class="lesson-actions">

                <button
                    class="edit-lesson-button"
                    data-id="${lesson.id}"
                >
                    Edit
                </button>

                <button
                    class="delete-lesson-button"
                    data-id="${lesson.id}"
                >
                    Delete
                </button>

            </div>

        `;


        lessonsContainer.appendChild(
            lessonCard
        );

    });


    // ========================================
    // EDIT BUTTONS
    // ========================================

    const editButtons =
        document.querySelectorAll(
            ".edit-lesson-button"
        );


    editButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const lessonId =
                    Number(
                        button.dataset.id
                    );


                editLesson(lessonId);

            }
        );

    });


    // ========================================
    // DELETE BUTTONS
    // ========================================

    const deleteButtons =
        document.querySelectorAll(
            ".delete-lesson-button"
        );


    deleteButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const lessonId =
                    Number(
                        button.dataset.id
                    );


                deleteLesson(lessonId);

            }
        );

    });

}


// ========================================
// EDIT LESSON
// ========================================

async function editLesson(lessonId) {

    console.log(
        "Editing lesson:",
        lessonId
    );


    const {
        data,
        error
    } =
        await supabaseClient
            .from("lessons")
            .select("*")
            .eq("id", lessonId)
            .single();


    if (error) {

        console.error(
            "Get Lesson Error:",
            error
        );


        lessonMessage.textContent =
            "Could not load lesson.";

        return;
    }


    // ========================================
    // PUT DATA INTO FORM
    // ========================================

    document.getElementById(
        "lessonTitle"
    ).value =
        data.title || "";


    document.getElementById(
        "lessonDescription"
    ).value =
        data.description || "";


    document.getElementById(
        "lessonContent"
    ).value =
        data.content || "";


    // ========================================
    // SAVE EDITING ID
    // ========================================

    editingLessonId =
        data.id;


    // ========================================
    // CHANGE BUTTON
    // ========================================

    const submitButton =
        lessonForm.querySelector(
            'button[type="submit"]'
        );


    submitButton.textContent =
        "Update Lesson";


    lessonMessage.textContent =
        "Editing lesson...";


    // ========================================
    // SCROLL TO FORM
    // ========================================

    lessonForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// ========================================
// DELETE LESSON
// ========================================

async function deleteLesson(lessonId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this lesson?"
        );


    if (!confirmed) {

        return;
    }


    console.log(
        "Deleting lesson:",
        lessonId
    );


    const {
        error
    } =
        await supabaseClient
            .from("lessons")
            .delete()
            .eq(
                "id",
                lessonId
            );


    if (error) {

        console.error(
            "Delete Lesson Error:",
            error
        );


        lessonMessage.textContent =
            "Could not delete lesson.";

        return;
    }


    lessonMessage.textContent =
        "Lesson deleted successfully!";


    // ========================================
    // RESET EDITING MODE
    // ========================================

    if (editingLessonId === lessonId) {

        editingLessonId = null;

        lessonForm.reset();

        resetFormButton();

    }


    await loadLessons();

}


// ========================================
// RESET FORM BUTTON
// ========================================

function resetFormButton() {

    const submitButton =
        lessonForm.querySelector(
            'button[type="submit"]'
        );


    submitButton.textContent =
        "Save Lesson";

}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value;


    return div.innerHTML;

}


// ========================================
// INITIAL LOAD
// ========================================

loadLessons();