console.log("LOGIN SYSTEM LOADED 👑");


// ========================================
// PASSWORD SHOW / HIDE
// ========================================

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


// ========================================
// LOGIN ELEMENTS
// ========================================

const loginForm =
    document.getElementById("loginForm");

const loginButton =
    document.getElementById("loginButton");

const loginMessage =
    document.getElementById("loginMessage");


// ========================================
// LOGIN
// ========================================

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();


    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    console.log(
        "Login email:",
        email
    );

    console.log(
        "Password length:",
        password.length
    );


    loginMessage.textContent = "";


    // ========================================
    // VALIDATION
    // ========================================

    if (!email || !password) {

        loginMessage.textContent =
            "Please enter your email and password.";

        return;

    }


    // ========================================
    // LOADING STATE
    // ========================================

    loginButton.disabled = true;

    loginButton.textContent =
        "Logging in...";


    try {

        // ========================================
        // SUPABASE LOGIN
        // ========================================

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: password

            });


        // ========================================
        // LOGIN ERROR
        // ========================================

        if (error) {

            console.error(
                "Login error:",
                error
            );

            loginMessage.textContent =
                error.message;

            return;

        }


        // ========================================
        // CHECK USER
        // ========================================

        if (!data.user) {

            loginMessage.textContent =
                "Login failed. Please try again.";

            return;

        }


        // ========================================
        // LOGIN SUCCESS
        // ========================================

        console.log(
            "Login successful:",
            data
        );

        console.log(
            "User ID:",
            data.user.id
        );

        console.log(
            "User email:",
            data.user.email
        );


        // ========================================
        // GET USER ROLE
        // ========================================

        const { data: profile, error: profileError } =
            await supabaseClient
                .from("profiles")
                .select("role")
                .eq("id", data.user.id)
                .single();


        // ========================================
        // PROFILE ERROR
        // ========================================

        if (profileError) {

            console.error(
                "Profile error:",
                profileError
            );

            loginMessage.textContent =
                "Could not verify your account.";

            await supabaseClient.auth.signOut();

            return;

        }


        // ========================================
        // CHECK ROLE
        // ========================================

        console.log(
            "User role:",
            profile.role
        );


        // ========================================
        // ADMIN
        // ========================================

        if (profile.role === "admin") {

            console.log(
                "Admin detected 👑"
            );

            loginMessage.textContent =
                "Welcome Admin 👑";


            setTimeout(() => {

                window.location.href =
                    "./admin/dashboard.html";

            }, 500);

            return;

        }


        // ========================================
        // STUDENT
        // ========================================

        if (profile.role === "student") {

            console.log(
                "Student detected 🎓"
            );

            loginMessage.textContent =
                "Login successful!";


            setTimeout(() => {

                window.location.href =
                    "./index.html";

            }, 500);

            return;

        }


        // ========================================
        // UNKNOWN ROLE
        // ========================================

        console.error(
            "Unknown user role:",
            profile.role
        );

        loginMessage.textContent =
            "Your account role is not configured.";

        await supabaseClient.auth.signOut();


    } catch (error) {

        console.error(
            "Login system error:",
            error
        );

        loginMessage.textContent =
            "Something went wrong. Please try again.";

    } finally {

        loginButton.disabled = false;

        loginButton.textContent =
            "Login";

    }

});