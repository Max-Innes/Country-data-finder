import './App.css'
import "./Autocomplete.css"
import { useState } from "react"
import Autocomplete from './Autocomplete'

function App() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  async function handleClick(value) {
    console.log("User searched for:", value)

    if (!value) {
      console.warn("No country name entered")
      return
    }

    try {
      console.log("Fetching data from REST Countries API...")
      const response = await fetch(`https://restcountries.com/v3.1/name/${value}`)

      if (!response.ok) throw new Error("Country not found")

      const json = await response.json()
      if (!json || json.length === 0) throw new Error("No data found")

      setData(json[0])
      setError(null)
      console.log("Successfully set data:", json[0])
    } catch (err) {
      console.error("Error fetching country:", err)
      setData(null)
      setError(err.message)
    }
  }

  return (
    <div>
      <h1>Country Finder</h1>
      <p>Start typing a country in the box below and select from the dropdown menu.</p>
      <Autocomplete onSelect={handleClick} />

      {error && <p style={{ color: "red" }}>{error}</p>}

      {data && (
        <div className="sidebyside">
          <CountryFlag data={data} />
          <CountryInfo data={data} />
        </div>
      )}
    </div>
  )
}

function CountryFlag({ data }) {
  return (
    <img
      src={data.flags.svg}
      alt={`Flag of ${data.name.common}`}
      style={{ width: "200px", border: "1px solid #ccc" }}
    />
  )
}

function CountryInfo({ data }) {
  const languages = data.languages ? Object.values(data.languages).join(", ") : "N/A"
  return (
    <div style={{ marginLeft: "20px" }}>
      <h2>{data.name.common}</h2>
      <p><strong>Official Name:</strong> {data.name.official}</p>
      <p><strong>Capital:</strong> {data.capital ? data.capital.join(", ") : "N/A"}</p>
      <p><strong>Region:</strong> {data.region}</p>
      <p><strong>Population:</strong> {data.population.toLocaleString()}</p>
      <p><strong>Languages:</strong> {languages}</p>
    </div>
  )
}

export default App
