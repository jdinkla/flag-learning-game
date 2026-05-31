import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import FlagGame from './FlagGame'
import { countries } from './countries'
import { getFlagUrl } from './game'

afterEach(cleanup)

// The flag image src encodes the correct country's code, so we can answer
// deterministically without mocking the RNG.
const correctCountryFromDom = () => {
    const src = screen.getByRole('img', { name: 'Flag to guess' }).getAttribute('src')
    const country = countries.find((c) => getFlagUrl(c.code) === src)
    if (!country) throw new Error(`No country matched flag src ${src}`)
    return country
}

describe('<FlagGame />', () => {
    it('renders a flag, the prompt, and three answer choices', () => {
        render(<FlagGame />)
        expect(
            screen.getByText('Which country does this flag belong to?'),
        ).toBeInTheDocument()
        expect(screen.getByRole('img', { name: 'Flag to guess' })).toBeInTheDocument()
        // 3 choice buttons (no "Play Again" button while playing).
        expect(screen.getAllByRole('button')).toHaveLength(3)
    })

    it('shows positive feedback when the correct flag is chosen', async () => {
        const user = userEvent.setup()
        render(<FlagGame />)
        const correct = correctCountryFromDom()

        await user.click(screen.getByRole('button', { name: correct.name }))

        expect(screen.getByText('Correct! 🎉')).toBeInTheDocument()
    })

    it('reveals the answer when a wrong flag is chosen', async () => {
        const user = userEvent.setup()
        render(<FlagGame />)
        const correct = correctCountryFromDom()
        const wrong = screen
            .getAllByRole('button')
            .find((b) => b.textContent !== correct.name)
        if (!wrong) throw new Error('Expected a wrong-answer button')

        await user.click(wrong)

        expect(screen.getByText(`Wrong! It was ${correct.name}`)).toBeInTheDocument()
    })
})
