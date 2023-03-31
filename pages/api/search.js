import { supabase } from "@/lib/supabaseClient";

async function fetchBeats(book) {
  console.log("fetchbeats");
  const prompt = `What are the story beats in the book ${book.title}? (If you aren't sure what book this is, don't make up a response, and instead just say "No.") List them as a set of bullet points that avoid assuming knowledge of subsequent story beats. For each bullet point, indicate how that beat contributes to the overall plot and character development. Format your response as markdown, with each story beat as a bullet point, with sub-bullets for each how the story beat contributes to the plot and how the story beat contributes to character development.
  You are aware that your target audience is writers who want to understand how stories are structured and why.`;

  const url = "https://api.openai.com/v1/chat/completions";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NEXT_OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.75,
      max_tokens: 800,
    }),
  };

  const response = await fetch(url, options);

  const data = await response.json();

  if (!data) return false;

  return data;
}

async function searchForBooks(query) {
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

  const firstResult = books.docs[0];
  return firstResult;
}

async function findExistingBook(key) {
  console.log("findexistingbook");
  const { data, error } = await supabase
    .from("stories")
    .select()
    .eq("openlibrary_key", key);

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

async function updateBook(id, beats) {
  console.log("updatebook");
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

async function createBook(book, beats) {
  console.log("createbook");
  if (!book) {
    throw new Error("Missing book");
  }

  const { data, error } = await supabase
    .from("stories")
    .insert({
      title: book.title,
      author: book.author,
      openlibrary_key: book.key,
      beats: beats,
    })
    .select();

  if (error) {
    throw new Error(error);
  }

  console.log(data);
  return data;
}

async function fetchBookData(key) {
  console.log("fetchbookdata");
  const url = `https://openlibrary.org/${key}.json`;
  const options = {
    method: "GET",
  };

  const book = await fetch(url, options);
  const data = await book.json();

  if (!data) return false;

  return data;
}

export default async function handler(req, res) {
  const query = req.body.search;

  if (!query) {
    return res.status(400).json({ data: "No query provided" });
  }

  try {
    // 1. API call that searches for entities based on a string
    const topResult = await searchForBooks(query);

    // 2. Assuming that succeeds, take the returned ID, and check if an entity already exists in the DB with that key.
    const bookKey = topResult.key;
    const existingEntity = await findExistingBook(bookKey);

    if (existingEntity) {
      console.log(existingEntity);
      // 3. If the entity already exists, check if it has a "beats" value.
      if (existingEntity.beats) {
        return res.status(200).json(existingEntity);
      } else {
        // 4. If the entity already exists but doesn't have a "beats" value, use the key to make an API call to fetch the book data.
        const bookData = await fetchBookData(bookKey);
        // 5. Assuming that succeeds, take the book data, and use an attribute from that to make another API call to fetch the "beats."
        const beatData = await fetchBeats(bookData);
        // 6. Assuming that succeeds, make another API call to update the database item with the "beats" value.
        const updatedBook = await updateBook(existingEntity.id, beatData);
        return res.status(200).json({ ...existingEntity, beats: beatData });
      }
    } else {
      // 7. If the entity did not exist in #3, then use the key to make an API call to fetch the book data.
      const bookData = await fetchBookData(bookKey);
      // 8. Assuming that succeeds, take the book data, and use an attribute from that to make another API call to fetch the "beats."
      const beatData = await fetchBeats(bookData);
      // 9. Assuming that succeeds, make another API call to insert a database item with the combination of book data and "beats."
      const newEntity = await createBook(bookData, beatData);
      return res.status(200).json(newEntity);
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
}
