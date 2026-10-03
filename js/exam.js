console.log("EXAM JS LOADED 👑");


/* ==============================
   DOM ELEMENTS
================================ */

const examTitle =
    document.getElementById("examTitle");

const examDescription =
    document.getElementById("examDescription");

const examDuration =
    document.getElementById("examDuration");

const examTimer =
    document.getElementById("examTimer");

const questionsContainer =
    document.getElementById("questionsContainer");

const examForm =
    document.getElementById("examForm");


/* ==============================
   GET EXAM ID FROM URL
================================ */

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const examId =
    Number(
        urlParams.get("id")
    );

console.log(
    "Current URL:",
    window.location.href
);

console.log(
    "Exam ID:",
    examId
);


/* ==============================
   ATTEMPT
================================ */

let attemptId = null;

let timerInterval = null;

let examSubmitting = false;

let examFinished = false;

let examQuestions = [];

let exitHandled = false;

/* ==============================
   CHECK ATTEMPTS
================================ */

async function checkAttempts() {

    console.log(
        "Checking exam attempts..."
    );

    try {

        /* ==============================
           GET EXAM SETTINGS
        ============================== */

        const {
            data: examData,
            error: examError
        } = await supabaseClient
            .from("exams")
            .select("max_attempts")
            .eq("id", examId)
            .single();

        if (examError) {
            console.error(
                "Error loading exam settings:",
                examError
            );

            return false;
        }

        const maxAttempts =
            examData.max_attempts;

        console.log(
            "Maximum Attempts:",
            maxAttempts
        );


        /* ==============================
           GET USED ATTEMPTS
           USING SECURE RPC
        ============================== */

        const {
            data: usedAttempts,
            error: attemptsError
        } = await supabaseClient.rpc(
            "get_exam_attempt_count",
            {
                p_exam_id: examId
            }
        );

        if (attemptsError) {

            console.error(
                "Error checking attempts:",
                attemptsError
            );

            return false;
        }


        /* ==============================
           LOG ATTEMPTS
        ============================== */

        console.log(
            "Used Attempts:",
            usedAttempts
        );

        console.log(
            "Attempts available:",
            Math.max(
                0,
                maxAttempts - usedAttempts
            )
        );


        /* ==============================
           CHECK LIMIT
        ============================== */

        if (
            maxAttempts !== null &&
            usedAttempts >= maxAttempts
        ) {

            alert(
                "You have reached the maximum number of attempts for this exam."
            );

            window.location.href =
                "./exams.html";

            return false;
        }


        /* ==============================
           ATTEMPT AVAILABLE
        ============================== */

        return true;

    } catch (error) {

        console.error(
            "Unexpected error while checking attempts:",
            error
        );

        return false;
    }
}

/* ==============================
   CREATE ATTEMPT
================================ */

async function createAttempt() {

    console.log(
        "Creating exam attempt..."
    );


    const {
        data,
        error
    } =
        await supabaseClient
            .rpc(
                "create_exam_attempt",
                {
                    p_exam_id: examId
                }
            );


    if (error) {

        console.error(
            "Create Attempt Error:",
            error
        );

        alert(
            "Could not start the exam."
        );

        return false;
    }


    attemptId =
        data;


    console.log(
        "Attempt created:",
        attemptId
    );


    return true;
}


/* ==============================
   LOAD EXAM
================================ */

async function loadExam() {

    console.log(
        "Loading exam..."
    );


    if (
        !examId ||
        Number.isNaN(examId)
    ) {

        examTitle.textContent =
            "Invalid Exam";


        questionsContainer.innerHTML =
            "<p>Exam ID is missing.</p>";


        return;
    }


    /* ==============================
       CHECK ATTEMPTS
    ============================== */

    const attemptsAvailable =
        await checkAttempts();


    if (!attemptsAvailable) {

        return;
    }


    /* ==============================
       CREATE ATTEMPT
    ============================== */

    const attemptCreated =
        await createAttempt();


    if (!attemptCreated) {

        return;
    }


    /* ==============================
       LOAD EXAM DATA
    ============================== */

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
            "Load Exam Error:",
            error
        );


        examTitle.textContent =
            "Could not load exam.";


        return;
    }


    console.log(
        "Exam loaded:",
        data
    );


    examTitle.textContent =
        data.title;


    examDescription.textContent =
        data.description || "";


    examDuration.textContent =
        `⏱️ ${data.duration} minutes`;


    /* ==============================
       START TIMER
    ============================== */

    startTimer(
        data.duration
    );


    /* ==============================
       LOAD QUESTIONS
    ============================== */

    await loadQuestions();
}


/* ==============================
   LOAD QUESTIONS
================================ */

async function loadQuestions() {

    questionsContainer.innerHTML =
        "<p>Loading questions...</p>";


    const {
        data,
        error
    } =
        await supabaseClient
            .from("questions")
            .select("*")
            .eq("exam_id", examId)
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


    if (
        !data ||
        data.length === 0
    ) {

        questionsContainer.innerHTML =
            "<p>No questions available.</p>";


        return;
    }


    console.log(
        "Questions loaded:",
        data
    );


    /*
       IMPORTANT:
       Keep all questions in memory
       so unanswered questions are
       also submitted.
    */

    examQuestions = data;


    questionsContainer.innerHTML =
        "";


    /* ==============================
       CREATE QUESTIONS
    ============================== */

    data.forEach(
        (question, index) => {

            const questionCard =
                document.createElement(
                    "div"
                );


            questionCard.className =
                "question-card";


            questionCard.innerHTML = `

                <h3>
                    Question ${index + 1}
                </h3>

                <p>
                    ${escapeHTML(
                        question.question_text
                    )}
                </p>

                <label>

                    <input
                        type="radio"
                        name="question-${question.id}"
                        value="A"
                    >

                    ${escapeHTML(
                        question.option_a
                    )}

                </label>


                <label>

                    <input
                        type="radio"
                        name="question-${question.id}"
                        value="B"
                    >

                    ${escapeHTML(
                        question.option_b
                    )}

                </label>


                ${
                    question.option_c
                        ? `

                            <label>

                                <input
                                    type="radio"
                                    name="question-${question.id}"
                                    value="C"
                                >

                                ${escapeHTML(
                                    question.option_c
                                )}

                            </label>

                        `
                        : ""
                }


                ${
                    question.option_d
                        ? `

                            <label>

                                <input
                                    type="radio"
                                    name="question-${question.id}"
                                    value="D"
                                >

                                ${escapeHTML(
                                    question.option_d
                                )}

                            </label>

                        `
                        : ""
                }

            `;


            questionsContainer.appendChild(
                questionCard
            );

        }
    );


    /* ==============================
       SUBMIT BUTTON
    ============================== */

    const submitButton =
        document.createElement(
            "button"
        );


    submitButton.type =
        "submit";


    submitButton.id =
        "submitExamButton";


    submitButton.textContent =
        "Submit Exam";


    questionsContainer.appendChild(
        submitButton
    );
}


/* ==============================
   SUBMIT EXAM
================================ */

async function submitExam(
    automatic = false
) {

    console.log(
        "Submitting exam..."
    );


    /* ==============================
       PREVENT DOUBLE SUBMIT
    ============================== */

    if (examSubmitting) {

        console.log(
            "Exam is already being submitted."
        );

        return;
    }


    if (examFinished) {

        console.log(
            "Exam is already finished."
        );

        return;
    }


    if (!attemptId) {

        console.error(
            "No attempt ID found."
        );


        alert(
            "Exam attempt was not found."
        );


        return;
    }


    examSubmitting = true;


    /* ==============================
       STOP TIMER
    ============================== */

    if (timerInterval) {

        clearInterval(
            timerInterval
        );

        timerInterval = null;
    }


    /* ==============================
       COLLECT ALL ANSWERS
    ============================== */

    const answers =
        examQuestions.map(
            (question) => {

                const selectedAnswer =
                    examForm.querySelector(
                        `input[name="question-${question.id}"]:checked`
                    );


                return {

                    question_id:
                        question.id,

                    selected_answer:
                        selectedAnswer
                            ? selectedAnswer.value
                            : null

                };

            }
        );


    console.log(
        "Student answers:",
        answers
    );


    /*
       IMPORTANT:

       We DO NOT require at least
       one answer anymore.

       The student can submit:

       0 answered
       3 answered
       10 answered
       etc.

       Unanswered questions are sent
       as selected_answer: null.
    */


    /* ==============================
       DISABLE BUTTON
    ============================== */

    const submitButton =
        document.getElementById(
            "submitExamButton"
        );


    if (submitButton) {

        submitButton.disabled =
            true;


        submitButton.textContent =
            "Submitting...";
    }


    /* ==============================
       CALL RPC
    ============================== */

    const {
        data,
        error
    } =
        await supabaseClient
            .rpc(
                "submit_exam_attempt",
                {
                    p_attempt_id:
                        attemptId,

                    p_answers:
                        answers
                }
            );


    /* ==============================
       HANDLE ERROR
    ============================== */

    if (error) {

        console.error(
            "Submit Exam Error:",
            error
        );


        examSubmitting = false;


        if (submitButton) {

            submitButton.disabled =
                false;


            submitButton.textContent =
                "Submit Exam";
        }


        alert(
            "Could not submit the exam.\n\n" +
            error.message
        );


        return;
    }


    /* ==============================
       SUCCESS
    ============================== */

    console.log(
        "Exam submitted successfully:",
        data
    );


    sessionStorage.setItem(
    "examResult",
    JSON.stringify({
        attemptId: attemptId,
        examId: examId,
        score: data.score,
        total_questions: data.total_questions,
        answers: answers,
        questions: examQuestions
    })
);

    examFinished = true;


    examTimer.textContent =
        "Finished";


    if (submitButton) {

        submitButton.textContent =
            "Exam Submitted";
    }


    alert(
        `Exam submitted successfully!\n\nScore: ${data.score} / ${data.total_questions}`
    );
    

    window.location.href =
    "./results.html";

    console.log(
        "Score:",
        data.score
    );


    console.log(
        "Total Questions:",
        data.total_questions
    );
}


/* ==============================
   TIMER
================================ */

function startTimer(
    durationMinutes
) {

    let remainingSeconds =
        Number(durationMinutes) * 60;


    updateTimerDisplay(
        remainingSeconds
    );


    timerInterval =
        setInterval(
            () => {

                if (
                    examFinished ||
                    examSubmitting
                ) {

                    return;
                }


                remainingSeconds--;


                updateTimerDisplay(
                    remainingSeconds
                );


                if (
                    remainingSeconds <= 0
                ) {

                    clearInterval(
                        timerInterval
                    );


                    timerInterval =
                        null;


                    submitExamAutomatically();
                }


            },
            1000
        );
}


/* ==============================
   TIMER DISPLAY
================================ */

function updateTimerDisplay(
    remainingSeconds
) {

    const minutes =
        Math.floor(
            remainingSeconds / 60
        );


    const seconds =
        remainingSeconds % 60;


    examTimer.textContent =
        `⏱️ ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}


/* ==============================
   AUTO SUBMIT
================================ */

function submitExamAutomatically() {

    if (
        examFinished ||
        examSubmitting
    ) {

        return;
    }


    console.log(
        "Time is over!"
    );


    alert(
        "Time is over. Your exam will be submitted."
    );


    submitExam(true);
}


/* ==============================
   FORM SUBMIT
================================ */

if (examForm) {

    examForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            submitExam(false);

        }
    );
}


/* ==============================
   ESCAPE HTML
================================ */

function escapeHTML(
    value
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        value;


    return div.innerHTML;
}


/* ==============================
   HANDLE EXAM EXIT
================================ */

async function handleExamExit() {

    if (exitHandled) {
        return;
    }

    if (examFinished) {
        return;
    }

    if (!attemptId) {
        return;
    }

    exitHandled = true;

    console.log(
        "Exam exited. Abandoning attempt:",
        attemptId
    );

    try {

        const { data, error } =
            await supabaseClient.rpc(
                "abandon_exam_attempt",
                {
                    p_attempt_id: attemptId
                }
            );

        if (error) {

            console.error(
                "Error abandoning attempt:",
                error
            );

            return;
        }

        console.log(
            "Attempt abandoned:",
            data
        );

    } catch (error) {

        console.error(
            "Unexpected exit error:",
            error
        );
    }
}

/* ==============================
   PAGE EXIT
================================ */

window.addEventListener(
    "pagehide",
    () => {

        handleExamExit();

    }
);


/* ==============================
   START
================================ */

loadExam();