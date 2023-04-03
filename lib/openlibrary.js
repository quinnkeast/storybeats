export async function fetchBookData(key) {
  const id = key.startsWith("/works/") ? key : `/works/${key}`;

  const url = `https://openlibrary.org/${id}.json`;
  const options = {
    method: "GET",
  };

  const book = await fetch(url, options);
  const data = await book.json();

  if (!data) return false;

  return data;
}

export async function searchForBooks(query) {
  console.log("searchforbooks");
  const url = `https://openlibrary.org/search.json?q=${query}`;
  const options = {
    method: "GET",
  };

  const result = await fetch(url, options);
  const books = await result.json();

  if (!result || !books) {
    throw new Error("");
  }

  // const firstResult = books.docs[0];
  return books;
}
