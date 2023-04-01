import { supabase } from "@/lib/supabaseClient";

export async function fetchBook(key) {
  const id = key.startsWith("/works/") ? key : `/works/${key}`;

  const { data, error } = await supabase
    .from("stories")
    .select()
    .eq("openlibrary_key", id);

  if (error) {
    throw new Error(error);
  }

  if (data.length === 0) return false;

  return data[0];
}

export async function findExistingBook(key) {
  const id = key.startsWith("/works/") ? key : `/works/${key}`;

  const { data, error } = await supabase
    .from("stories")
    .select()
    .eq("openlibrary_key", id);

  if (error) {
    console.log(`error: ${error}`);
    throw new Error("findexistingbook");
  }

  if (data.length === 0) {
    console.log("doesn't exist");
    return false;
  }

  const book = data[0];

  return book;
}

export async function updateBook(id, beats) {
  const { data, error } = await supabase
    .from("stories")
    .update({
      beats: beats,
    })
    .eq("id", id)
    .select();

  if (error) {
    return false;
  }

  return data;
}

export async function createBook(book, beats) {
  if (!book) {
    throw new Error("Missing book");
  }

  const { data, error } = await supabase
    .from("stories")
    .insert({
      title: book.title,
      author: book.author,
      openlibrary_key: book.key,
      beats: beats || null,
    })
    .select();

  if (error) {
    throw new Error(error);
  }

  return data;
}
