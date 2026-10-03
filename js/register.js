console.log("REGISTER SYSTEM LOADED 👑");


/* =========================================
   PASSWORD SHOW / HIDE
========================================= */

const toggleButtons =
    document.querySelectorAll(".toggle-password");


toggleButtons.forEach(button => {

    button.addEventListener("click", () => {

        const targetId =
            button.dataset.target;

        const input =
            document.getElementById(targetId);


        if (!input) return;


        if (input.type === "password") {

            input.type = "text";

            button.textContent = "🙈";

            button.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            input.type = "password";

            button.textContent = "👁️";

            button.setAttribute(
                "aria-label",
                "Show password"
            );

        }

    });

});


/* =========================================
   REGISTER FORM
========================================= */

const registerForm =
    document.getElementById("registerForm");

const registerButton =
    document.getElementById("registerButton");

const registerMessage =
    document.getElementById("registerMessage");


registerForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    /* =====================================
       GET FORM VALUES
    ===================================== */

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    /* =====================================
       CHECK PASSWORDS
    ===================================== */

    if (password !== confirmPassword) {

        registerMessage.textContent =
            "Passwords do not match.";

        return;

    }


    /* =====================================
       DISABLE BUTTON
    ===================================== */

    registerButton.disabled = true;

    registerButton.textContent =
        "Creating Account...";

    registerMessage.textContent = "";


    try {

        /* =================================
           CREATE SUPABASE ACCOUNT
        ================================= */

        const { data, error } =
            await supabaseClient.auth.signUp({
                email: email,
                password: password
            });


        /* =================================
           HANDLE ERROR
        ================================= */

        if (error) {

            console.error(
                "Registration error:",
                error
            );

            registerMessage.textContent =
                error.message;

            return;

        }


        console.log(
            "Registration successful:",
            data
        );


        /* =================================
           SUCCESS
        ================================= */

        if (data.session) {

            registerMessage.textContent =
                "Account created successfully!";

            /*
             * Later we will connect this
             * to the Student Area.
             */

        } else {

            registerMessage.textContent =
                "Account created! Please check your email to confirm your account.";

        }


    } catch (error) {

        console.error(
            "Registration system error:",
            error
        );

        registerMessage.textContent =
            "Something went wrong. Please try again.";


    } finally {

        registerButton.disabled = false;

        registerButton.textContent =
            "Create Account";

    }

});