import { useEffect, useState } from "react"
import cards from "./data/PTCGP Genetic Apex Cards.json"
import { useLocalStorage } from '@uidotdev/usehooks'
import { Badge } from "./Badge"
import { cn } from "./utils"
import { MinusCircle } from "lucide-react"

export const App = () => {

  const [results, setResults] = useState([])
  const [userCards, setUserCards] = useLocalStorage('my-cards', [])
  const [search, setSearch] = useState('')
  const [cardPendingDeletion, setCardPendingDeletion] = useState(false)

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
    setCardPendingDeletion(false)
  }

  const cardIsInDeck = (card, deck) => deck.filter(c => c.Number === card.Number && c.Name === card.Name).length !== 0

  return (
    <div className="w-screen min-w-screen h-screen min-h-screen flex justify-content-center bg-neutral-100 text-black dark:bg-neutral-900 dark:text-white">

      <div className="flex w-full max-w-[600px] flex-col px-5 py-5">
        <h1 className={`${hasResults ? 'text-2xl' : 'text-4xl'} text-center ${hasResults ? 'mb-5' : 'mb-3'} transition-all`}>
          <label htmlFor="card-search-field">Search Pokemon TCGP Cards</label>
        </h1>

        <input 
          id="card-search-field" 
          type="text" 
          placeholder="Search by name, number, or card deck. Try: pikachu" 
          className="w-full text-lg ps-3 h-16 border rounded dark:bg-slate-950 dark:text-white" 
          onChange={e => setSearch(e.target.value)} 
        />

        {hasResults && <div className={cn(['dark:bg-neutral-950 border'])}>

          <div className="flex border-b pb-2 text-xs font-bold uppercase p-5">
            <div className="w-24">Number</div>
            <div className="w-52">Name</div>
            <div className="w-40">Deck</div>
            <div className="flex-1">Owned</div>
          </div>

          {results.map((r, i) => (
            <div className="flex p-5 dark:hover:bg-neutral-900 hover:bg-neutral-200" key={`r${i}`}>
              <div className="w-24">{r.Number}</div>
              <div className="w-52">{r.Name}</div>
              <div className="w-40 flex flex-col space-y-1">{r.Deck.split(',').map((c, i) => <Badge key={`${c}-${i}`} label={c} />)}</div>
              <div className="flex-1">
                <input
                  type="checkbox"
                  className="w-6 h-6 cursor-pointer"
                  checked={cardIsInDeck(r, userCards)}
                  onChange={e => e.target.checked ? addCardToCollection(r) : removeCardFromCollection(r)}
                />
              </div>
            </div>
          ))}
        </div>}
      </div>

      <div className="w-96 p-3 bg-red-400 text-white dark:bg-neutral-950 flex-1">
        <h2 className="text-2xl mb-2 font-bold">My Deck</h2>
        {userCards.length === 0 && <div>No cards collected yet!</div>}
        {userCards.map((c, i) => (
          <div key={`uc${i}`} className={cn([
            'w-full', 'inline-flex', 'justify-between', 'py-1', 'px-1', 
            cardPendingDeletion && cardPendingDeletion === c.Number && 'dark:bg-red-400 dark:text-white rounded-md'
          ])}>

            <span className="w-10">{c.Number}</span>
            <span className='flex-1'>{c.Name}</span>
            <button 
              className={cn(['dark:hover:text-black'])}
              onMouseEnter={() => setCardPendingDeletion(c.Number)} 
              onMouseLeave={() => setCardPendingDeletion(false)} 
              onClick={() => removeCardFromCollection(c)}>
             <MinusCircle/>
            </button>
          </div>
        ))}
      </div>

    </div>
  )

}
