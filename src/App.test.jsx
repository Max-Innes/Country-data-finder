import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import App from "./App"

// Mock fetch globally
global.fetch = vi.fn()

describe("App component", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders the heading and input", () => {
    render(<App />)

    // Main heading is h1
    expect(screen.getByRole("heading", { name: "Country Finder", level: 1 })).toBeInTheDocument()

    // Input field
    expect(screen.getByPlaceholderText("Enter country name")).toBeInTheDocument()

    // Search button
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument()
  })

  it("shows error message when fetch fails", async () => {
    fetch.mockResolvedValueOnce({ ok: false })

    render(<App />)

    fireEvent.change(screen.getByPlaceholderText("Enter country name"), {
      target: { value: "invalidcountry" }
    })
    fireEvent.click(screen.getByRole("button", { name: /search/i }))

    await waitFor(() => {
      expect(screen.getByText("Country not found")).toBeInTheDocument()
    })
  })

  it("renders country info when fetch succeeds", async () => {
    const mockCountry = {
      name: { common: "Canada", official: "Canada" },
      capital: ["Ottawa"],
      region: "Americas",
      population: 38000000,
      languages: { eng: "English", fra: "French" },
      flags: { svg: "https://flagcdn.com/ca.svg" }
    }

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [mockCountry]
    })

    render(<App />)

    fireEvent.change(screen.getByPlaceholderText("Enter country name"), {
      target: { value: "canada" }
    })
    fireEvent.click(screen.getByRole("button", { name: /search/i }))

    await waitFor(() => {
      // Country name heading (h2)
      expect(screen.getByRole("heading", { name: "Canada", level: 2 })).toBeInTheDocument()

      // Official Name
      const officialNameParagraph = screen.getByText(/Official Name:/).closest("p")
      expect(officialNameParagraph).toHaveTextContent("Canada")

      // Capital
      const capitalParagraph = screen.getByText(/Capital:/).closest("p")
      expect(capitalParagraph).toHaveTextContent("Ottawa")

      // Region
      const regionParagraph = screen.getByText(/Region:/).closest("p")
      expect(regionParagraph).toHaveTextContent("Americas")

      // Languages
      const languagesParagraph = screen.getByText(/Languages:/).closest("p")
      expect(languagesParagraph).toHaveTextContent("English, French")
    })
  })
})

