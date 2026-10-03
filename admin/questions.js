console.log("QUESTIONS JS LOADED 👑");


// ========================================
// ELEMENTS
// ========================================

const questionForm =
    document.getElementById("questionForm");

const questionMessage =
    document.getElementById("questionMessage");

const questionsContainer =
    document.getElementById("questionsContainer");

const questionExam =
    document.getElementById("questionExam");

const backButton =
    document.getElementById("backButton");


// ========================================
// CURRENT EDITING QUESTION
// ========================================

let editingQuestionId = null;


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
// LOAD EXAMS
// ========================================

async function loadExamsIntoSelect() {

    questionExam.innerHTML = `
        <option value="">
            Loading exams...
        </option>
    `;


    const {
        data,
        error
    } =
        await supabaseClient
            .from("exams")
            .select("id, title")
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


        questionExam.innerHTML = `
            <option value="">
                Could not load exams
            </option>
        `;

        return;

    }


    if (!data || data.length === 0) {

        questionExam.innerHTML = `
            <option value="">
                No exams available
            </option>
        `;

        questionsContainer.innerHTML = `
            <p>
                Create an exam first.
            </p>
        `;

        return;

    }


    questionExam.innerHTML = `
        <option value="">
            Select an exam
        </option>
    `;


    data.forEach((exam) => {

        const option =
            document.createElement("option");


        option.value =
            exam.id;


        option.textContent =
            exam.title;


        questionExam.appendChild(
            option
        );

    });

}


// ========================================
// EXAM SELECT CHANGE
// ========================================

if (questionExam) {

    questionExam.addEventListener(
        "change",
        async () => {

            const examId =
                Number(
                    questionExam.value
                );


            if (!examId) {

                questionsContainer.innerHTML = `
                    <p>
                        Select an exam to view its questions.
                    </p>
                `;

                return;

            }


            editingQuestionId = null;

            resetQuestionForm();

            await loadQuestions(examId);

        }
    );

}


// ========================================
// ADD / UPDATE QUESTION
// ========================================

if (questionForm) {

    questionForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            // ========================================
            // GET FORM DATA
            // ========================================

            const examId =
                Number(
                    questionExam.value
                );


            const questionText =
                document
                    .getElementById("questionText")
                    .value
                    .trim();


            const optionA =
                document
                    .getElementById("optionA")
                    .value
                    .trim();


            const optionB =
                document
                    .getElementById("optionB")
                    .value
                    .trim();


            const optionC =
                document
                    .getElementById("optionC")
                    .value
                    .trim();


            const optionD =
                document
                    .getElementById("optionD")
                    .value
                    .trim();


            const correctAnswer =
                document
                    .getElementById("correctAnswer")
                    .value;


            // ========================================
            // VALIDATION
            // ========================================

            if (!examId) {

                questionMessage.textContent =
                    "Please select an exam.";

                return;

            }


            if (!questionText) {

                questionMessage.textContent =
                    "Please enter the question.";

                return;

            }


            if (!optionA || !optionB) {

                questionMessage.textContent =
                    "Option A and B are required.";

                return;

            }


            if (!correctAnswer) {

                questionMessage.textContent =
                    "Please select the correct answer.";

                return;

            }


            // ========================================
            // UPDATE
            // ========================================

            if (editingQuestionId) {

                await updateQuestion(
                    examId,
                    questionText,
                    optionA,
                    optionB,
                    optionC,
                    optionD,
                    correctAnswer
                );

                return;

            }


            // ========================================
            // ADD
            // ========================================

            await addQuestion(
                examId,
                questionText,
                optionA,
                optionB,
                optionC,
                optionD,
                correctAnswer
            );

        }
    );

}


// ========================================
// ADD QUESTION
// ========================================

async function addQuestion(
    examId,
    questionText,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer
) {

    try {

        questionMessage.textContent =
            "Saving question...";


        const {
            data,
            error
        } =
            await supabaseClient
                .from("questions")
                .insert([
                    {
                        exam_id: examId,
                        question_text: questionText,
                        option_a: optionA,
                        option_b: optionB,
                        option_c: optionC || null,
                        option_d: optionD || null,
                        correct_answer: correctAnswer
                    }
                ])
                .select();


        if (error) {

            console.error(
                "Add Question Error:",
                error
            );


            questionMessage.textContent =
                "Could not save question.";

            return;

        }


        console.log(
            "Question added:",
            data
        );


        questionMessage.textContent =
            "Question saved successfully! 👑";


        resetQuestionForm();


        await loadQuestions(
            examId
        );

    }

    catch (error) {

        console.error(
            "Unexpected Add Question Error:",
            error
        );


        questionMessage.textContent =
            "Something went wrong.";

    }

}


// ========================================
// LOAD QUESTIONS
// ========================================

async function loadQuestions(examId) {

    questionsContainer.innerHTML =
        "<p>Loading questions...</p>";


    const {
        data,
        error
    } =
        await supabaseClient
            .from("questions")
            .select("*")
            .eq(
                "exam_id",
                examId
            )
            .order(
                "created_at",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "Load Questions Error:",
            error
        );


        questionsContainer.innerHTML =
            "<p>Could not load questions.</p>";

        return;

    }


    // ========================================
    // NO QUESTIONS
    // ========================================

    if (!data || data.length === 0) {

        questionsContainer.innerHTML = `
            <p>
                No questions for this exam yet.
            </p>
        `;

        return;

    }


    questionsContainer.innerHTML = "";


    // ========================================
    // CREATE QUESTION CARDS
    // ========================================

    data.forEach((question, index) => {

        const questionCard =
            document.createElement("div");


        questionCard.className =
            "lesson-card";


        questionCard.innerHTML = `

            <h3>
                Question ${index + 1}
            </h3>


            <p>
                <strong>Question:</strong>
                ${escapeHTML(
                    question.question_text
                )}
            </p>


            <p>
                <strong>A:</strong>
                ${escapeHTML(
                    question.option_a
                )}
            </p>


            <p>
                <strong>B:</strong>
                ${escapeHTML(
                    question.option_b
                )}
            </p>


            ${
                question.option_c
                    ? `
                        <p>
                            <strong>C:</strong>
                            ${escapeHTML(
                                question.option_c
                            )}
                        </p>
                    `
                    : ""
            }


            ${
                question.option_d
                    ? `
                        <p>
                            <strong>D:</strong>
                            ${escapeHTML(
                                question.option_d
                            )}
                        </p>
                    `
                    : ""
            }


            <p>
                <strong>
                    ✅ Correct Answer:
                </strong>

                ${escapeHTML(
                    question.correct_answer
                )}
            </p>


            <div class="lesson-actions">

                <button
                    type="button"
                    class="edit-question-button"
                    data-id="${question.id}"
                >
                    ✏️ Edit Question
                </button>


                <button
                    type="button"
                    class="delete-question-button"
                    data-id="${question.id}"
                >
                    🗑️ Delete Question
                </button>

            </div>

        `;


        questionsContainer.appendChild(
            questionCard
        );

    });


    // ========================================
    // EDIT BUTTONS
    // ========================================

    const editButtons =
        questionsContainer.querySelectorAll(
            ".edit-question-button"
        );


    editButtons.forEach((button) => {

        button.addEventListener(
            "click",
            async () => {

                const questionId =
                    Number(
                        button.dataset.id
                    );


                await editQuestion(
                    questionId
                );

            }
        );

    });


    // ========================================
    // DELETE BUTTONS
    // ========================================

    const deleteButtons =
        questionsContainer.querySelectorAll(
            ".delete-question-button"
        );


    deleteButtons.forEach((button) => {

        button.addEventListener(
            "click",
            async () => {

                const questionId =
                    Number(
                        button.dataset.id
                    );


                await deleteQuestion(
                    questionId,
                    examId
                );

            }
        );

    });

}


// ========================================
// EDIT QUESTION
// ========================================

async function editQuestion(questionId) {

    console.log(
        "Editing question:",
        questionId
    );


    const {
        data,
        error
    } =
        await supabaseClient
            .from("questions")
            .select("*")
            .eq(
                "id",
                questionId
            )
            .single();


    if (error) {

        console.error(
            "Get Question Error:",
            error
        );


        questionMessage.textContent =
            "Could not load question.";

        return;

    }


    // ========================================
    // SELECT EXAM
    // ========================================

    questionExam.value =
        data.exam_id;


    // ========================================
    // FILL FORM
    // ========================================

    document.getElementById(
        "questionText"
    ).value =
        data.question_text || "";


    document.getElementById(
        "optionA"
    ).value =
        data.option_a || "";


    document.getElementById(
        "optionB"
    ).value =
        data.option_b || "";


    document.getElementById(
        "optionC"
    ).value =
        data.option_c || "";


    document.getElementById(
        "optionD"
    ).value =
        data.option_d || "";


    document.getElementById(
        "correctAnswer"
    ).value =
        data.correct_answer || "";


    // ========================================
    // SAVE EDITING ID
    // ========================================

    editingQuestionId =
        data.id;


    // ========================================
    // CHANGE SUBMIT BUTTON
    // ========================================

    const submitButton =
        questionForm.querySelector(
            'button[type="submit"]'
        );


    submitButton.textContent =
        "Update Question";


    questionMessage.textContent =
        "Editing question...";


    // ========================================
    // SCROLL TO FORM
    // ========================================

    questionForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


// ========================================
// UPDATE QUESTION
// ========================================

async function updateQuestion(
    examId,
    questionText,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer
) {

    try {

        questionMessage.textContent =
            "Updating question...";


        const {
            data,
            error
        } =
            await supabaseClient
                .from("questions")
                .update({
                    exam_id: examId,
                    question_text: questionText,
                    option_a: optionA,
                    option_b: optionB,
                    option_c: optionC || null,
                    option_d: optionD || null,
                    correct_answer: correctAnswer
                })
                .eq(
                    "id",
                    editingQuestionId
                )
                .select();


        if (error) {

            console.error(
                "Update Question Error:",
                error
            );


            questionMessage.textContent =
                "Could not update question.";

            return;

        }


        console.log(
            "Question updated:",
            data
        );


        questionMessage.textContent =
            "Question updated successfully! 👑";


        editingQuestionId =
            null;


        resetQuestionForm();


        await loadQuestions(
            examId
        );

    }

    catch (error) {

        console.error(
            "Unexpected Update Question Error:",
            error
        );


        questionMessage.textContent =
            "Something went wrong.";

    }

}


// ========================================
// DELETE QUESTION
// ========================================

async function deleteQuestion(
    questionId,
    examId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this question?"
        );


    if (!confirmed) {

        return;

    }


    console.log(
        "Deleting question:",
        questionId
    );


    const {
        error
    } =
        await supabaseClient
            .from("questions")
            .delete()
            .eq(
                "id",
                questionId
            );


    if (error) {

        console.error(
            "Delete Question Error:",
            error
        );


        questionMessage.textContent =
            "Could not delete question.";

        return;

    }


    questionMessage.textContent =
        "Question deleted successfully! 👑";


    // ========================================
    // RESET EDITING MODE
    // ========================================

    if (
        editingQuestionId === questionId
    ) {

        editingQuestionId =
            null;


        resetQuestionForm();

    }


    await loadQuestions(
        examId
    );

}


// ========================================
// RESET QUESTION FORM
// ========================================

function resetQuestionForm() {

    document.getElementById(
        "questionText"
    ).value = "";


    document.getElementById(
        "optionA"
    ).value = "";


    document.getElementById(
        "optionB"
    ).value = "";


    document.getElementById(
        "optionC"
    ).value = "";


    document.getElementById(
        "optionD"
    ).value = "";


    document.getElementById(
        "correctAnswer"
    ).value = "";


    const submitButton =
        questionForm.querySelector(
            'button[type="submit"]'
        );


    submitButton.textContent =
        "Save Question";

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

loadExamsIntoSelect();