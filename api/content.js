export default function handler(req, res) {
  res.json({
    test: "Backend funcionando",
    hero: "Casa de Koky ya es plataforma"
  });
}

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPA_URL,
  process.env.SUPA_KEY
);

export default async function handler(req, res) {
  const { data } = await supabase.from("content").select("*");
  res.json(data);
}

