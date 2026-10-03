console.log("EXAMS JS LOADED 👑");


const examsContainer =
    document.getElementById("examsContainer");


async function loadExams() {

    console.log("Loading exams...");

    examsContainer.innerHTML =
        "<p>Loading exams...</p>";


    const { data, error } =
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


    console.log(
        "Exams loaded:",
        data
    );


    if (!data || data.length === 0) {

        examsContainer.innerHTML =
            "<p>No exams available yet.</p>";

        return;
    }


    examsContainer.innerHTML = "";


    data.forEach((exam) => {

        const examCard =
            document.createElement("div");


        examCard.className =
            "exam-card";


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
                ⏱️ ${exam.duration} minutes
            </p>

            <button
                type="button"
                class="start-exam-button"
                data-id="${exam.id}"
            >
                Start Exam
            </button>

        `;


        examsContainer.appendChild(
            examCard
        );

    });


    const startButtons =
        document.querySelectorAll(
            ".start-exam-button"
        );


    startButtons.forEach((button) => {

    button.addEventListener(
        "click",
        () => {

            const examId =
                Number(
                    button.dataset.id
                );

            window.location.href =
                `./exam.html?id=${examId}`;

        }
    );

});

}


function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value;

    return div.innerHTML;
}


loadExams();