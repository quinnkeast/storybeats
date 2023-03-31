import { supabase } from "@lib/supabaseClient";

export default function handler(req, res) {
  res.status(200).json({ name: "Single story" });
  // sanitize search string
  // query supabase for string
  // if book exists, return book
  // else query openlibrary for book
  // if book, create new record in supabase, then return book
  // if no book, handle err response
}
