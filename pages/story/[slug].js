import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ReactMarkdown from "react-markdown";
import html from "remark-html";
import { fetchBook, createBook, updateBook } from "@/lib/db";
import { fetchBeats } from "@/lib/chatgpt";
import { fetchBookData } from "@/lib/openlibrary";

function Story(props) {
  const [story, setStory] = useState(props.story);
  const [fetchingBeats, setFetchingBeats] = useState(false);

  useEffect(() => {
    if (story.beats === null) {
      setFetchingBeats(true);
      fetchBeatsAndUpdateBook(story);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBeatsAndUpdateBook = async () => {
    const beatData = await fetchBeats(story);
    const updatedBook = await updateBook(story.id, beatData);
    setStory({ ...story, beats: beatData });
  };

  return (
    <>
      <h2>{story.title}</h2>
      {story.beats ? (
        <ReactMarkdown children={story.beats.choices[0].message.content} />
      ) : (
        <p>Fetching beats...</p>
      )}
    </>
  );
}

export async function getServerSideProps(context) {
  const key = context.params.slug;
  let data;
  const existingEntity = await fetchBook(key);

  if (!existingEntity) {
    const bookData = await fetchBookData(key);
    const newEntity = await createBook(bookData);
    data = newEntity[0];
  } else {
    data = existingEntity;
  }

  const story = {
    ...data,
    beats: JSON.parse(data.beats),
  };

  return {
    props: {
      story: story,
    },
  };
}

export default Story;
