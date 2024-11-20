import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs) => twMerge(clsx(inputs))
// export const getMissingFromDecks = (deck1, deck2) => deck1.filter(card => !deck2.includes(card))

export const getMissingFromDecksCount = (userDeck, allCardsDeck) => {
  return allCardsDeck.length - userDeck.length
}
