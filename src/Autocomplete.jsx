// Created with assistance from ChatGPT (OpenAI, 2025).
// Prompt used: "Can you give me the most simple sample code you can make for an incremental/live search code as a component as a separate file."

import React, { useState, useEffect } from "react"

function Autocomplete({ onSelect }) {
  const [countries, setCountries] = useState([]) // all country names
  const [query, setQuery] = useState("")        // current input
  const [results, setResults] = useState([])    // filtered suggestions


  useEffect(() => { //first argument is a function, the effect itself
    async function fetchCountries() { //fetches all countries from the API
      try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name") //sets the value when the promise is fulfilled
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json() //await only sets the value when the promise is fulfilled
        const names = data.map(c => c.name.common).sort() //creates a new array containing only the common country name + .sort() for alphabetical
        setCountries(names)
      } catch (err) {
        console.error("Error fetching countries:", err)
      }
    }

    fetchCountries() //calls the function
  }, []) //empty array [] as the second argument means this effect runs only once

  // Handle typing in the input
  function handleChange(e) { //runs every time the user types in the box
    const value = e.target.value //contain whatever the user is typing at that exact moment
      //e is the event object automatically passed to event handlers (onChange).
      //e.target: the HTML element that triggered the event = <input>
      //e.target.value: the current text inside the input box
    setQuery(value) //update what is being shown in the boxv

    if (!value) { //check if box is empty
      setResults([]) //clears any previous suggestion
      return //stops the function early
    }

    const filtered = countries.filter(item => //suggests countries that that include the letters typed so far
      item.toLowerCase().includes(value.toLowerCase())
    )
    setResults(filtered) //set state variable

    console.log(`[${new Date().toLocaleTimeString()}] Input: "${value}" → ${filtered.length} results`)
  }

  //handle selecting a suggestion !!!!!
  function handleSelect(item) {
    setQuery(item) //puts item (the selected country) in the input box
    setResults([]) //hides the dropdown
    if (onSelect) onSelect(item)
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Seach..."
        value={query}
        onChange={handleChange} //as user types
      />
      {results.length > 0 && ( //maps out a list of countries 
        <ul className="autocomplete-list"> 
          {results.map((item, index) => (
            <li key={index} onClick={() => handleSelect(item)}> {/* when user clicks on an option */}
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Autocomplete
