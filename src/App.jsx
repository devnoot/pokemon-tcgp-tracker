import { useEffect, useState } from "react"
import cards from "./data/PTCGP Genetic Apex Cards.json"
import { useLocalStorage } from '@uidotdev/usehooks'

export const App = () => {

  const [results, setResults] = useState([])
  const [userCards, setUserCards] = useLocalStorage('my-cards', [])
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (search.length <3) {
      setResults([])
      return
    }
    const completions = cards.filter(card => card.Name.toLowerCase().trim().includes(search.toLowerCase().trim()))
    setResults(completions)
  }, [search])

  const hasResults = results.length > 0

  const addCardToCollection = card => {
    setUserCards([...userCards, card])
  }

  const removeCardFromCollection = card => {
    const cardIndex = userCards.findIndex(c => c.Number === card.Number && c.Name === card.Name)
    if (cardIndex !== -1) {
      const newUserCards = [...userCards]
      newUserCards.splice(cardIndex, 1)
      setUserCards(newUserCards)
    }
  }

  const cardIsInDeck = (card, deck) => deck.filter(c => c.Number === card.Number && c.Name === card.Name).length !== 0

  return (
    <div className="w-screen min-w-screen h-screen min-h-screen flex justify-content-center">
      <div className="flex w-full flex-col px-5">
        <label htmlFor="card-search-field" className="text-4xl text-center mb-3">Search Pokemon TCGP Cards</label>
        <input id="card-search-field" type="text" className="min-w-96 h-16 border rounded" onChange={e => setSearch(e.target.value)} />
        {hasResults && <div>

          <div className="flex space-x-4 min-w-64 border-b my-2">
            <div className="flex-1">Number</div>
            <div className="flex-1">Name</div>
            <div className="flex-1">Deck</div>
            <div className="flex-1">Owned</div>
          </div>

          {results.map((r, i) => (
            <div className="flex space-x-4 min-w-64" key={`r${i}`}>
              <div className="flex-1">{r.Number}</div>
              <div className="flex-1">{r.Name}</div>
              <div className="flex-1">{r.Deck}</div>
              <div className="flex-1">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={cardIsInDeck(r, userCards)}
                  onChange={e => e.target.checked ? addCardToCollection(r) : removeCardFromCollection(r)}
                />
              </div>
            </div>
          ))}
        </div>}
      </div>
      <div className="w-96 p-3 bg-red-500 text-white">
        <h2 className="text-2xl mb-2 font-bold">My Deck</h2>
        {userCards.length === 0 && <div>No cards collected yet!</div>}
        {userCards.map((c, i) => (
          <div key={`uc${i}`}>
            {c.Number} {c.Name}
          </div>
        ))}
      </div>
    </div>
  )

}
