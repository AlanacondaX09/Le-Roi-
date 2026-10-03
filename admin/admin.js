console.log("ADMIN JS LOADED 👑");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const logoutButton = document.getElementById("logoutButton");


// ========================================
// ADMIN LOGIN
// ========================================

if (loginForm) {

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        loginMessage.textContent =
            "Logging in...";


        // Login with Supabase
        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });


        // Login error
        if (error) {

            console.error(
                "Login Error:",
                error
            );

            loginMessage.textContent =
                "Login failed. Check your email and password.";

            return;
        }


        console.log(
            "Logged in user:",
            data.user
        );


        // ========================================
        // GET USER PROFILE
        // ========================================

        const { data: profile, error: profileError } =
            await supabaseClient
                .from("profiles")
                .select("role")
                .eq("id", data.user.id)
                .single();


        // Profile error
        if (profileError) {

            console.error(
                "Profile Error:",
                profileError
            );

            loginMessage.textContent =
                "Could not verify your account.";

            await supabaseClient.auth.signOut();

            return;
        }


        console.log(
            "User role:",
            profile.role
        );


        // ========================================
        // CHECK ADMIN ROLE
        // ========================================

        if (profile.role !== "admin") {

            console.log(
                "Access denied."
            );

            loginMessage.textContent =
                "Access denied. Admins only.";

            await supabaseClient.auth.signOut();

            return;
        }


        // ========================================
        // ADMIN CONFIRMED
        // ========================================

        loginMessage.textContent =
            "Login successful!";

        console.log(
            "Welcome Admin 👑"
        );


        // Go to Dashboard
        window.location.href =
            "./dashboard.html";

    });

}


// ========================================
// DASHBOARD SECURITY
// ========================================

async function checkAdminAccess() {

    console.log(
        "Checking admin access..."
    );


    // Get current session
    const { data: sessionData, error: sessionError } =
        await supabaseClient.auth.getSession();


    // Session error
    if (sessionError) {

        console.error(
            "Session Error:",
            sessionError
        );

        window.location.href =
            "./admin.html";

        return;
    }


    const session =
        sessionData.session;


    // No session
    if (!session) {

        console.log(
            "No active session."
        );

        window.location.href =
            "./admin.html";

        return;
    }


    console.log(
        "Active session found."
    );


    // ========================================
    // GET PROFILE
    // ========================================

    const { data: profile, error: profileError } =
        await supabaseClient
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single();


    // Profile error
    if (profileError) {

        console.error(
            "Profile Error:",
            profileError
        );

        await supabaseClient.auth.signOut();

        window.location.href =
            "./admin.html";

        return;
    }


    console.log(
        "Dashboard user role:",
        profile.role
    );


    // ========================================
    // CHECK ADMIN
    // ========================================

    if (profile.role !== "admin") {

        console.log(
            "User is not an admin."
        );

        await supabaseClient.auth.signOut();

        window.location.href =
            "./admin.html";

        return;
    }


    // ========================================
    // ACCESS GRANTED
    // ========================================

    console.log(
        "Dashboard access granted 👑"
    );

}


// ========================================
// LOGOUT
// ========================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async () => {

            console.log(
                "Logging out..."
            );


            await supabaseClient.auth.signOut();


            window.location.href =
                "./admin.html";

        }
    );

}


// ========================================
// RUN DASHBOARD SECURITY
// ========================================

if (
    window.location.pathname.endsWith(
        "/dashboard.html"
    )
) {

    checkAdminAccess();

}

// ========================================
// MANAGE LESSONS BUTTON
// ========================================

const manageLessonsButton =
    document.getElementById("manageLessonsButton");


if (manageLessonsButton) {

    manageLessonsButton.addEventListener(
        "click",
        () => {

            console.log(
                "Opening Lessons Manager..."
            );


            window.location.href =
                "./lessons.html";

        }
    );

}


// ========================================
// MANAGE EXAMS BUTTON
// ========================================

const manageExamsButton =
    document.getElementById("manageExamsButton");

if (manageExamsButton) {

    manageExamsButton.addEventListener(
        "click",
        () => {

            console.log(
                "Opening Exams Manager..."
            );

            window.location.href =
                "./exams.html";

        }
    );

}


// ========================================
// MANAGE QUESTIONS BUTTON
// ========================================

const manageQuestionsButton =
    document.getElementById(
        "manageQuestionsButton"
    );

if (manageQuestionsButton) {

    manageQuestionsButton.addEventListener(
        "click",
        () => {

            console.log(
                "Opening Questions Manager..."
            );

            window.location.href =
                "./questions.html";

        }
    );

}