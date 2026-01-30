/*export default function handler(req, res) {
  res.json({
    test: "Backend funcionando",
    hero: "Casa de Koky ya es plataforma"
  });
} */

import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  try {
    const supabase = createClient(
      process.env.SUPA_URL,
      process.env.SUPA_KEY
    );

    const { data, error } = await supabase
      .from("content")
      .select("*");

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

