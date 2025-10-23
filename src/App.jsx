import './App.css'
import { useState } from "react"

function App() {
  const [query, setQuery] = useState("")
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  async function handleClick() {
    const value = query.trim().toLowerCase()
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

      <input
        id="countryName"
        type="text"
        placeholder="Enter country name"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleClick}>Search</button>

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
