import React, { useState, useEffect } from "react";
import Downshift from "downshift";
import { useRouter } from "next/router";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return debouncedValue;
}

export default function SearchInput(redirect) {
  const router = useRouter();

  const [selectedValue, setSelectedValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setSearching(true);
      handleSearch(debouncedSearchTerm)
        .then((results) => {
          setSearching(false);
          // setSearchResults(results.docs) but only the top 10 results
          // limit to first 10 results in array
          setSearchResults(results.docs.slice(0, 10));
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setSearchResults([]);
    }
  }, [debouncedSearchTerm]);

  const handleSearch = async (searchTerm) => {
    try {
      const query = {
        search: searchTerm,
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
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  function parsedKeyRoute(string) {
    if (!string) return false;
    const parts = string.split("/");
    const result = `/story/${parts[2]}`;
    return result;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push(parsedKeyRoute(selectedValue.key));
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-row gap-2">
      <Downshift
        onChange={item => setSelectedValue(item)}
        itemToString={item => (item ? item.title : '')}
        id="search"
      >
        {({
          getInputProps,
          getMenuProps,
          getItemProps,
          isOpen,
          highlightedIndex,
        }) => (
          <div className="w-full">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative flex flex-row">
              <input
                {...getInputProps({
                  placeholder: "Search for story...",
                  onChange: (event) => setSearchTerm(event.target.value),
                })}
                type="text"
                id="search"
                className="grow bg-white-100 border-gray-300 border rounded py-1 pl-1 pr-10  focus:ring-2 focus:ring-indigo-200 placeholder-gray-500"
              />
              {searching && <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white absolute right-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>}
            </div>
            {isOpen && (
              <ul {...getMenuProps()} className="absolute">
                {searchResults.map((item, index) => (
                  <li
                    key={item.key}
                    {...getItemProps({
                      key: item.key,
                      index,
                      item,
                      style: {
                        backgroundColor:
                          highlightedIndex === index ? "lightgray" : "white",
                        fontWeight: selectedValue === item ? "bold" : "normal",
                      },
                    })}
                  >
                    {item.title && item.title}<br />
                    {item.author_name && item.author_name.map(author => <span key={author}>{author}</span>)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Downshift>
      <button type="submit" className="bg-indigo-600 text-white serif rounded px-3 py-1 disabled:bg-indigo-300">
        Submit
      </button>
    </form>
  );
}
