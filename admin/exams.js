console.log("EXAMS JS LOADED 👑");


// ========================================
// ELEMENTS
// ========================================

const examForm =
    document.getElementById("examForm");

const examMessage =
    document.getElementById("examMessage");

const examsContainer =
    document.getElementById("examsContainer");

const backButton =
    document.getElementById("backButton");


// ========================================
// CURRENT EDITING EXAM
// ========================================

let editingExamId = null;


// ========================================
// BACK TO DASHBOARD
// ========================================

if (backButton) {

    backButton.addEventListener("click", () => {

        window.location.href =
            "./dashboard.html";

    });

}


// ========================================
// ADD / UPDATE EXAM
// ========================================

if (examForm) {

    examForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        // ========================================
        // GET FORM DATA
        // ========================================

        const title =
            document
                .getElementById("examTitle")
                .value
                .trim();


        const description =
            document
                .getElementById("examDescription")
                .value
                .trim();


        const duration =
            Number(
                document
                    .getElementById("examDuration")
                    .value
            );


        const maxAttempts =
            Number(
                document
                    .getElementById("examMaxAttempts")
                    .value
            );


        // ========================================
        // VALIDATION
        // ========================================

        if (!title) {

            examMessage.textContent =
                "Please enter an exam title.";

            return;

        }


        if (!duration || duration < 1) {

            examMessage.textContent =
                "Please enter a valid duration.";

            return;

        }


        if (!maxAttempts || maxAttempts < 1) {

            examMessage.textContent =
                "Please enter a valid number of attempts.";

            return;

        }


        // ========================================
        // UPDATE
        // ========================================

        if (editingExamId) {

            await updateExam(
                title,
                description,
                duration,
                maxAttempts
            );

            return;

        }


        // ========================================
        // ADD
        // ========================================

        await addExam(
            title,
            description,
            duration,
            maxAttempts
        );

    });

}


// ========================================
// ADD NEW EXAM
// ========================================

async function addExam(
    title,
    description,
    duration,
    maxAttempts
) {

    try {

        examMessage.textContent =
            "Saving exam...";


        const {
            data,
            error
        } =
            await supabaseClient
                .from("exams")
                .insert([
                    {
                        title: title,
                        description: description,
                        duration: duration,
                        max_attempts: maxAttempts
                    }
                ])
                .select();


        if (error) {

            console.error(
                "Add Exam Error:",
                error
            );


            examMessage.textContent =
                "Could not save exam.";

            return;

        }


        console.log(
            "Exam added:",
            data
        );


        examMessage.textContent =
            "Exam saved successfully! 👑";


        // ========================================
        // RESET FORM
        // ========================================

        examForm.reset();


        // ========================================
        // RELOAD EXAMS
        // ========================================

        await loadExams();

    }


    catch (error) {

        console.error(
            "Unexpected Add Exam Error:",
            error
        );


        examMessage.textContent =
            "Something went wrong.";

    }

}


// ========================================
// LOAD EXAMS
// ========================================

async function loadExams() {

    examsContainer.innerHTML =
        "<p>Loading exams...</p>";


    const {
        data,
        error
    } =
        await supabaseClient
            .from("exams")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Load Exams Error:",
            error
        );


        examsContainer.innerHTML =
            "<p>Could not load exams.</p>";

        return;

    }


    // ========================================
    // NO EXAMS
    // ========================================

    if (!data || data.length === 0) {

        examsContainer.innerHTML =
            "<p>No exams yet.</p>";

        return;

    }


    examsContainer.innerHTML = "";


    // ========================================
    // CREATE EXAM CARDS
    // ========================================

    data.forEach((exam) => {

        const examCard =
            document.createElement("div");


        examCard.className =
            "lesson-card";


        examCard.innerHTML = `

            <h3>
                ${escapeHTML(exam.title)}
            </h3>


            <p>
                ${escapeHTML(
                    exam.description || ""
                )}
            </p>


            <p>
                ⏱️ Duration:
                ${exam.duration}
                minutes
            </p>


            <p>
                🔄 Maximum Attempts:
                ${exam.max_attempts}
            </p>


            <small>
                ${new Date(
                    exam.created_at
                ).toLocaleString()}
            </small>


            <div class="lesson-actions">

                <button
                    class="edit-exam-button"
                    data-id="${exam.id}"
                >
                    Edit
                </button>


                <button
                    class="delete-exam-button"
                    data-id="${exam.id}"
                >
                    Delete
                </button>

            </div>

        `;


        examsContainer.appendChild(
            examCard
        );

    });


    // ========================================
    // EDIT BUTTONS
    // ========================================

    const editButtons =
        document.querySelectorAll(
            ".edit-exam-button"
        );


    editButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const examId =
                    Number(
                        button.dataset.id
                    );


                editExam(examId);

            }
        );

    });


    // ========================================
    // DELETE BUTTONS
    // ========================================

    const deleteButtons =
        document.querySelectorAll(
            ".delete-exam-button"
        );


    deleteButtons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const examId =
                    Number(
                        button.dataset.id
                    );


                deleteExam(examId);

            }
        );

    });

}


// ========================================
// EDIT EXAM
// ========================================

async function editExam(examId) {

    console.log(
        "Editing exam:",
        examId
    );


    const {
        data,
        error
    } =
        await supabaseClient
            .from("exams")
            .select("*")
            .eq("id", examId)
            .single();


    if (error) {

        console.error(
            "Get Exam Error:",
            error
        );


        examMessage.textContent =
            "Could not load exam.";

        return;

    }


    // ========================================
    // PUT DATA INTO FORM
    // ========================================

    document.getElementById(
        "examTitle"
    ).value =
        data.title || "";


    document.getElementById(
        "examDescription"
    ).value =
        data.description || "";


    document.getElementById(
        "examDuration"
    ).value =
        data.duration || "";


    document.getElementById(
        "examMaxAttempts"
    ).value =
        data.max_attempts || 1;


    // ========================================
    // SAVE EDITING ID
    // ========================================

    editingExamId =
        data.id;


    // ========================================
    // CHANGE BUTTON
    // ========================================

    const submitButton =
        examForm.querySelector(
            'button[type="submit"]'
        );


    submitButton.textContent =
        "Update Exam";


    examMessage.textContent =
        "Editing exam...";


    // ========================================
    // SCROLL TO FORM
    // ========================================

    examForm.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}


// ========================================
// UPDATE EXAM
// ========================================

async function updateExam(
    title,
    description,
    duration,
    maxAttempts
) {

    try {

        examMessage.textContent =
            "Updating exam...";


        const {
            data,
            error
        } =
            await supabaseClient
                .from("exams")
                .update({

                    title: title,

                    description: description,

                    duration: duration,

                    max_attempts: maxAttempts

                })
                .eq(
                    "id",
                    editingExamId
                )
                .select();


        if (error) {

            console.error(
                "Update Exam Error:",
                error
            );


            examMessage.textContent =
                "Could not update exam.";

            return;

        }


        console.log(
            "Exam updated:",
            data
        );


        examMessage.textContent =
            "Exam updated successfully! 👑";


        // ========================================
        // RESET EDITING MODE
        // ========================================

        editingExamId =
            null;


        examForm.reset();


        resetFormButton();


        await loadExams();

    }


    catch (error) {

        console.error(
            "Unexpected Update Exam Error:",
            error
        );


        examMessage.textContent =
            "Something went wrong.";

    }

}


// ========================================
// DELETE EXAM
// ========================================

async function deleteExam(examId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this exam?"
        );


    if (!confirmed) {

        return;

    }


    console.log(
        "Deleting exam:",
        examId
    );


    const {
        error
    } =
        await supabaseClient
            .from("exams")
            .delete()
            .eq(
                "id",
                examId
            );


    if (error) {

        console.error(
            "Delete Exam Error:",
            error
        );


        examMessage.textContent =
            "Could not delete exam.";

        return;

    }


    examMessage.textContent =
        "Exam deleted successfully!";


    // ========================================
    // RESET EDITING MODE
    // ========================================

    if (editingExamId === examId) {

        editingExamId =
            null;


        examForm.reset();


        resetFormButton();

    }


    await loadExams();

}


// ========================================
// RESET FORM BUTTON
// ========================================

function resetFormButton() {

    const submitButton =
        examForm.querySelector(
            'button[type="submit"]'
        );


    submitButton.textContent =
        "Save Exam";

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

loadExams();