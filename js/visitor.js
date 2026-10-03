console.log("VISITOR SYSTEM LOADED 👑");


/* =================================
   GET OR CREATE VISITOR ID
================================= */

function getVisitorId() {

    let visitorId =
        localStorage.getItem("le_roi_visitor_id");


    if (!visitorId) {

        visitorId =
            crypto.randomUUID();

        localStorage.setItem(
            "le_roi_visitor_id",
            visitorId
        );

        console.log(
            "New visitor created:",
            visitorId
        );

    } else {

        console.log(
            "Returning visitor:",
            visitorId
        );

    }


    return visitorId;
}


/* =================================
   TRACK VISITOR
================================= */

async function trackVisitor() {

    try {

        const visitorId =
            getVisitorId();


        const { data, error } =
            await supabaseClient.rpc(
                "track_visitor",
                {
                    p_visitor_id: visitorId
                }
            );


        if (error) {

            console.error(
                "Visitor tracking error:",
                error
            );

            return;

        }


        console.log(
            "Visitor tracked successfully:",
            data
        );


        if (data?.is_new) {

            console.log(
                "🆕 New visitor"
            );

        } else {

            console.log(
                "🔄 Returning visitor"
            );

        }

    } catch (error) {

        console.error(
            "Visitor system error:",
            error
        );

    }

}


/* =================================
   START VISITOR SYSTEM
================================= */

trackVisitor();