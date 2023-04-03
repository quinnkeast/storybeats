import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { useRouter } from "next/router";
import Downshift from "downshift";
import Link from "next/link";
import classNames from "classnames";

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

function parsedKey(string) {
  if (!string) return false;
  const parts = string.split("/");
  const result = parts[2];
  return result;
}

export default function SearchInput() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      handleSearch(debouncedSearchTerm)
        .then((results) => {
          setIsSearching(false);
          setSearchResults(results.docs);
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
      //setSearchResults(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Downshift
      onChange={(selection) =>
        router.push(`/story/${parsedKey(selection.key)}`)
      }
      itemToString={(item) => (item ? item.title : "")}
    >
      {({
        getInputProps,
        getMenuProps,
        getItemProps,
        isOpen,
        highlightedIndex,
      }) => (
        <div>
          <input
            {...getInputProps({
              placeholder: "Search",
              onChange: (event) => setSearchTerm(event.target.value),
            })}
          />
          {isOpen && (
            <div {...getMenuProps()}>
              {searchResults.map((item, index) => (
                <div
                  {...getItemProps({
                    key: item.key,
                    index,
                    item,
                    style: {
                      backgroundColor:
                        highlightedIndex === index ? "lightgray" : "white",
                      fontWeight: "bold",
                    },
                  })}
                >
                  <Link href={`/story/${parsedKey(item.key)}`}>
                    {item.title}
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Downshift>
  );
}
