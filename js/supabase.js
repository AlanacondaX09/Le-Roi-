const SUPABASE_URL = "https://kkssxmcctnwtdbqzjxfh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_IXw6EhOaMjqhwhmbqRZqiA_lqAuhZ_S";
const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);
async function testConnection() {

    const { data, error } = await supabaseClient
        .from("lessons")
        .select("*");

    if (error) {
        console.error("Supabase Error:", error);
        return;
    }

    console.log("Lessons:", data);
}


testConnection();

