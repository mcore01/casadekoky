import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPA_URL,
  process.env.SUPA_KEY
);

export default async function handler(req, res) {
  const { data } = await supabase.from("content").select("*");
  res.json(data);
}
