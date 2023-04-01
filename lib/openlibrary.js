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
