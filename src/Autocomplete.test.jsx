import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Autocomplete from '../src/Autocomplete'

test('filtered suggestions appear in the list', async () => {

  global.fetch = vi.fn(() => //mocking the API data
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          { name: { common: 'Cameroon' } },
          { name: { common: 'Cambodia' } },
          { name: { common: 'Canada' } },
        ]),
    })
  )

  render(<Autocomplete />)

const user = userEvent.setup() //simulate user typing
await user.type(screen.getByRole('textbox'), 'cam')

  //Should have 2 responses
  expect(await screen.getByText('Cameroon')).toBeInTheDocument()
  expect(await screen.getByText('Cambodia')).toBeInTheDocument()
})