import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { useRouter } from "next/router";
import Downshift from "downshift";
import classNames from "classnames";

function debounce(fn, time) {
  let timeoutId;
  return wrapper;
  function wrapper(...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      timeoutId = null;
      fn(...args);
    }, time);
  }
}

export default function SearchInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    debounce(searchTerm, 500);
  }, [searchTerm]);

  const handleSearch = async (searchTerm) => {
    console.log("trigger");
    try {
      const query = {
        search: inputValue,
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
      setSearchResults(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Downshift
      onChange={(selection) => console.log("selected:", selection)}
      itemToString={(item) => (item ? item.label : "")}
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
                    key: item.id,
                    index,
                    item,
                    style: {
                      backgroundColor:
                        highlightedIndex === index ? "lightgray" : "white",
                      fontWeight: "bold",
                    },
                  })}
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Downshift>
  );
}
