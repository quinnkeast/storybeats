import { useState } from "react";
import { remark } from "remark";
import html from "remark-html";

export default function SearchInput() {
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [story, setStory] = useState({});

  const updateSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const query = {
      search: search,
    };

    const JSONdata = JSON.stringify(query);

    const endpoint = "/api/search";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONdata,
    };

    const response = await fetch(endpoint, options);
    const data = await response.json();
    if (data) {
      let beats;
      if (Array.isArray(data)) {
        beats = JSON.parse(data[0].beats);
      } else {
        beats = JSON.parse(data.beats);
      }
      const processedMarkdown = await remark()
        .use(html)
        .process(beats.choices[0].message.content);
      const contentHtml = processedMarkdown.toString();

      setStory({
        title: data.title,
        author: data.author,
        beats: contentHtml,
      });

      setSubmitting(false);
      setSubmitted(true);
    } else {
      setSubmitting(false);
      setSubmitted(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="">
        <label htmlFor="search" className="block font-semibold mb-2">
          Find a story
        </label>
        <div className="flex flex-row">
          <input
            type="text"
            value={search}
            onChange={updateSearch}
            id="search"
            placeholder="Enter a story title..."
            className="border border-grey-500 px-3 py-2 rounded block flex-grow mr-2"
            required
          />
          <button
            type="submit"
            className="rounded bg-indigo-800 text-white px-4 py-2 font-semibold inline-block disabled:bg-indigo-300"
            disabled={submitting}
          >
            Go
          </button>
        </div>
      </form>
      {!submitting && submitted && (
        <>
          <h2>{story.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: story.beats }} />
        </>
      )}
    </div>
  );
}
