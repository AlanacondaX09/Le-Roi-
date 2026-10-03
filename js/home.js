console.log("HOME SYSTEM LOADED 👑");


// ========================================
// ELEMENTS
// ========================================

const welcomeMessage =
    document.getElementById("welcomeMessage");

const studentAccount =
    document.getElementById("studentAccount");

const studentRole =
    document.getElementById("studentRole");

const guestAccount =
    document.getElementById("guestAccount");

const logoutButton =
    document.getElementById("logoutButton");


// ========================================
// LOAD CURRENT USER
// ========================================

async function loadHomeUser() {

    try {

        // ========================================
        // GET SESSION
        // ========================================

        const { data, error } =
            await supabaseClient.auth.getSession();


        if (error) {

            console.error(
                "Session error:",
                error
            );

            return;

        }


        // ========================================
        // NO LOGIN
        // ========================================

        if (!data.session) {

            console.log(
                "No logged-in user."
            );

            welcomeMessage.textContent =
                "Bienvenue sur Le Roi 👑";

            studentAccount.style.display =
                "none";

            guestAccount.style.display =
                "block";

            return;

        }


        // ========================================
        // GET USER
        // ========================================

        const user =
            data.session.user;


        console.log(
            "Logged-in user:",
            user
        );


        // ========================================
        // GET PROFILE
        // ========================================

        const { data: profile, error: profileError } =
            await supabaseClient
                .from("profiles")
                .select("email, role, created_at")
                .eq("id", user.id)
                .single();


        // ========================================
        // PROFILE ERROR
        // ========================================

        if (profileError) {

            console.error(
                "Profile error:",
                profileError
            );

            welcomeMessage.textContent =
                `Bienvenue ! 👋 ${user.email}`;

            return;

        }


        // ========================================
        // PROFILE SUCCESS
        // ========================================

        console.log(
            "Student profile:",
            profile
        );


        console.log(
            "User role:",
            profile.role
        );


        // ========================================
        // SHOW STUDENT DATA
        // ========================================

        welcomeMessage.textContent =
            `Bienvenue ! 👋 ${profile.email}`;

        studentRole.textContent =
            `Role: ${profile.role}`;


        studentAccount.style.display =
            "block";

        guestAccount.style.display =
            "none";

    } catch (error) {

        console.error(
            "Home system error:",
            error
        );

    }

}


// ========================================
// LOGOUT
// ========================================

logoutButton.addEventListener(
    "click",
    async () => {

        console.log(
            "Logging out..."
        );


        logoutButton.disabled =
            true;

        logoutButton.textContent =
            "Logging out...";


        try {

            const { error } =
                await supabaseClient.auth.signOut();


            if (error) {

                console.error(
                    "Logout error:",
                    error
                );

                logoutButton.disabled =
                    false;

                logoutButton.textContent =
                    "Logout";

                return;

            }


            console.log(
                "Logout successful 👋"
            );


            // ========================================
            // GO TO LOGIN
            // ========================================

            window.location.href =
                "./login.html";

        } catch (error) {

            console.error(
                "Logout system error:",
                error
            );

            logoutButton.disabled =
                false;

            logoutButton.textContent =
                "Logout";

        }

    }
);


// ========================================
// START
// ========================================

loadHomeUser();