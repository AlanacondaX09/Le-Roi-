console.log("RESULTS JS LOADED 👑");


/* ==============================
   DOM ELEMENTS
================================ */

const resultTitle =
    document.getElementById("resultTitle");

const resultDescription =
    document.getElementById("resultDescription");

const scoreDisplay =
    document.getElementById("scoreDisplay");

const percentageDisplay =
    document.getElementById("percentageDisplay");

const correctCount =
    document.getElementById("correctCount");

const wrongCount =
    document.getElementById("wrongCount");

const unansweredCount =
    document.getElementById("unansweredCount");

const totalCount =
    document.getElementById("totalCount");

const questionsReview =
    document.getElementById("questionsReview");

const backToExams =
    document.getElementById("backToExams");


/* ==============================
   LOAD RESULT
================================ */

function loadResult() {

    console.log(
        "Loading exam result..."
    );


    /* ==============================
       GET RESULT FROM SESSION
    =============================== */

    const savedResult =
        sessionStorage.getItem(
            "examResult"
        );


    if (!savedResult) {

        console.warn(
            "No exam result found."
        );

        showNoResult();

        return;
    }


    /* ==============================
       PARSE RESULT
    =============================== */

    let result;

    try {

        result =
            JSON.parse(savedResult);

    } catch (error) {

        console.error(
            "Invalid exam result:",
            error
        );

        showNoResult();

        return;
    }


    console.log(
        "Exam Result:",
        result
    );


    /* ==============================
       EXTRACT DATA
    =============================== */

    const score =
        Number(result.score) || 0;

    const totalQuestions =
        Number(result.total_questions) || 0;

    const answers =
        Array.isArray(result.answers)
            ? result.answers
            : [];

    const questions =
        Array.isArray(result.questions)
            ? result.questions
            : [];


    /* ==============================
       CALCULATE STATISTICS
    =============================== */

    let correct = 0;

    let answered = 0;

    let unanswered = 0;


    answers.forEach(answer => {

        if (
            answer &&
            answer.selected_answer
        ) {

            answered++;

        } else {

            unanswered++;

        }

    });


    correct = score;


    const wrong =
        Math.max(
            0,
            answered - correct
        );


    /*
       Make sure unanswered questions
       are calculated from the actual
       question count as well.
    */

    const calculatedUnanswered =
        Math.max(
            0,
            totalQuestions - answered
        );


    unanswered =
        Math.max(
            unanswered,
            calculatedUnanswered
        );


    /* ==============================
       PERCENTAGE
    =============================== */

    let percentage = 0;


    if (totalQuestions > 0) {

        percentage =
            (score / totalQuestions) * 100;

    }


    /* ==============================
       DISPLAY BASIC RESULT
    =============================== */

    scoreDisplay.textContent =
        `${score} / ${totalQuestions}`;


    percentageDisplay.textContent =
        `${percentage.toFixed(1)}%`;


    correctCount.textContent =
        correct;


    wrongCount.textContent =
        wrong;


    unansweredCount.textContent =
        unanswered;


    totalCount.textContent =
        totalQuestions;


    /* ==============================
       DISPLAY EXAM INFORMATION
    =============================== */

    if (
        questions.length > 0
    ) {

        /*
           The exam title is not currently
           guaranteed to be inside sessionStorage.
           So we keep the generic title here.
        */

        resultDescription.textContent =
            "Review your answers below.";

    }


    /* ==============================
       RENDER QUESTIONS
    =============================== */

    renderQuestionReview(
        questions,
        answers
    );

}


/* ==============================
   RENDER QUESTION REVIEW
================================ */

function renderQuestionReview(
    questions,
    answers
) {

    if (
        !questions ||
        questions.length === 0
    ) {

        questionsReview.innerHTML = `
            <p>
                No question details are available.
            </p>
        `;

        return;
    }


    questionsReview.innerHTML = "";


    questions.forEach(
        (question, index) => {

            /* ==============================
               FIND STUDENT ANSWER
            =============================== */

            const answer =
                answers.find(
                    item =>
                        Number(
                            item.question_id
                        ) === Number(
                            question.id
                        )
                );


            const selectedAnswer =
                answer &&
                answer.selected_answer
                    ? answer.selected_answer
                    : null;


            const correctAnswer =
                question.correct_answer;


            const isAnswered =
                Boolean(
                    selectedAnswer
                );


            const isCorrect =
                isAnswered &&
                selectedAnswer ===
                correctAnswer;


            /* ==============================
               ANSWER TEXT
            =============================== */

            const studentAnswerText =
                getAnswerText(
                    question,
                    selectedAnswer
                );


            const correctAnswerText =
                getAnswerText(
                    question,
                    correctAnswer
                );


            /* ==============================
               QUESTION CARD
            =============================== */

            const questionCard =
                document.createElement(
                    "article"
                );


            questionCard.className =
                "question-result";


            if (!isAnswered) {

                questionCard.classList.add(
                    "not-answered"
                );

            } else if (isCorrect) {

                questionCard.classList.add(
                    "correct"
                );

            } else {

                questionCard.classList.add(
                    "wrong"
                );

            }


            /* ==============================
               STATUS
            =============================== */

            let statusText = "";

            if (!isAnswered) {

                statusText =
                    "Not Answered";

            } else if (isCorrect) {

                statusText =
                    "Correct";

            } else {

                statusText =
                    "Wrong";

            }


            /* ==============================
               BUILD CARD
            =============================== */

            questionCard.innerHTML = `

                <div class="question-header">

                    <span class="question-number">
                        Question ${index + 1}
                    </span>

                    <span class="question-status">
                        ${escapeHTML(statusText)}
                    </span>

                </div>


                <div class="question-text">

                    ${escapeHTML(
                        question.question_text ||
                        "Question"
                    )}

                </div>


                <div class="answer-row">

                    <strong>
                        Your Answer:
                    </strong>

                    <span>
                        ${escapeHTML(
                            studentAnswerText
                        )}
                    </span>

                </div>


                <div class="answer-row correct-answer">

                    <strong>
                        Correct Answer:
                    </strong>

                    <span>
                        ${escapeHTML(
                            correctAnswerText
                        )}
                    </span>

                </div>

            `;


            questionsReview.appendChild(
                questionCard
            );

        }
    );

}


/* ==============================
   GET ANSWER TEXT
================================ */

function getAnswerText(
    question,
    answer
) {

    if (!answer) {

        return "Not Answered";

    }


    switch (answer) {

        case "A":

            return `A - ${
                question.option_a || ""
            }`;


        case "B":

            return `B - ${
                question.option_b || ""
            }`;


        case "C":

            return `C - ${
                question.option_c || ""
            }`;


        case "D":

            return `D - ${
                question.option_d || ""
            }`;


        default:

            return answer;

    }

}


/* ==============================
   NO RESULT
================================ */

function showNoResult() {

    resultTitle.textContent =
        "No Result Available";

    resultDescription.textContent =
        "There is no exam result to display.";


    scoreDisplay.textContent =
        "—";


    percentageDisplay.textContent =
        "—";


    correctCount.textContent =
        "0";


    wrongCount.textContent =
        "0";


    unansweredCount.textContent =
        "0";


    totalCount.textContent =
        "0";


    questionsReview.innerHTML = `

        <p>
            Please complete an exam first.
        </p>

    `;

}


/* ==============================
   ESCAPE HTML
================================ */

function escapeHTML(value) {

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
   BACK TO EXAMS
================================ */

backToExams.addEventListener(
    "click",
    () => {

        /*
           Remove the temporary result
           before going back.
        */

        sessionStorage.removeItem(
            "examResult"
        );


        window.location.href =
            "./exams.html";

    }
);


/* ==============================
   START
================================ */

loadResult();