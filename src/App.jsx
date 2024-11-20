import { useEffect, useState } from "react"
import cards from "./data/PTCGP Genetic Apex Cards.json"
import { useLocalStorage } from '@uidotdev/usehooks'
import { Badge } from "./Badge"
import { cn } from "./utils"
import { MinusCircle } from "lucide-react"
import { Layout } from "./Layout"

const CHARIZARD = 'CHARIZARD'
const PIKACHU = 'PIKACHU'
const MEWTWO = 'MEWTWO'
const PROMO_A = 'PROMO_A'

const NUM_CARDS_IN_CHARIZARD_DECK = cards.filter(c => c.Deck.toUpperCase() === CHARIZARD).length 
const NUM_CARDS_IN_PIKACHU_DECK = cards.filter(c => c.Deck.toUpperCase() === PIKACHU).length
const NUM_CARDS_IN_MEWTWO_DECK = cards.filter(c => c.Deck.toUpperCase() === MEWTWO).length
const NUM_CARDS_IN_PROMO_A_DECK = cards.filter(c => c.Deck.toUpperCase() === PROMO_A).length

export const App = () => {

  const [results, setResults] = useState([])
  const [userCards, setUserCards] = useLocalStorage('my-cards', [])
  const [search, setSearch] = useState('')
  const [cardPendingDeletion, setCardPendingDeletion] = useState(false)

  useEffect(() => {
    if (search.trim() === '*') {
      setResults(cards)
      return
    }
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
    <Layout>
      <div className="flex w-full max-w-[600px] flex-col px-5 py-5">
        <h1 className={cn([
          'text-5xl', 'mb-8',
          'text-center',
          'transition-all',
          'font-bold'
        ])}>
          <label htmlFor="card-search-field">Search Pokemon TCGP Cards</label>
        </h1>

        <input 
          id="card-search-field" 
          type="text" 
          placeholder="Search by name. Try: pikachu, or * to show all cards" 
          className="w-full text-lg ps-3 h-16 border rounded dark:bg-zinc-950 dark:text-white" 
          onChange={e => setSearch(e.target.value)} 
        />

        {hasResults && <div className={cn(['dark:bg-zinc-950 border', 'overflow-y-auto'])}>

          <div className="flex border-b pb-2 text-xs font-bold uppercase p-5 sticky top-0 dark:bg-zinc-950 bg-zinc-100">
            <div className="w-24">Number</div>
            <div className="w-52">Name</div>
            <div className="w-40">Deck</div>
            <div className="flex-1">Owned</div>
          </div>
    
            {results.map((r, i) => (
              <div className="flex p-5 dark:hover:bg-zinc-900 hover:bg-zinc-200" key={`r${i}`}>
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

      <div className="bg-red-400 text-white dark:bg-zinc-950 flex-1 overflow-y-auto max-w-80">
        <h2 className="text-2xl mb-2 font-bold px-5 pt-5">My Deck</h2>
          <div>
          {userCards.length === 0  
            ? <div>No cards collected yet!</div> 
            : <div className={cn(['fixed', 'bottom-0', 'w-80'])}>
                <div className={cn(['flex', 'w-full', 'justify-center', 'space-x-2'])}>
                <Badge label={`Charizard ${userCards.filter(c => c.Deck.toUpperCase() === CHARIZARD).length}/${NUM_CARDS_IN_CHARIZARD_DECK}`} />
                <Badge label={`Mewtwo ${userCards.filter(c => c.Deck.toUpperCase() === MEWTWO).length}/${NUM_CARDS_IN_MEWTWO_DECK}`}/> 
                <Badge label={`Pikachu ${userCards.filter(c => c.Deck.toUpperCase() === PIKACHU).length}/${NUM_CARDS_IN_PIKACHU_DECK}`}/> 
              </div>
          </div>}
        </div>
        
        <div className={cn(['px-5'])}>
        {userCards.map((c, i) => (
          <div key={`uc${i}`} className={cn([
            'w-full', 'inline-flex', 'justify-between', 'py-1', 'px-1', 
            cardPendingDeletion && cardPendingDeletion === c.Number && 'dark:bg-red-400 dark:text-black rounded-md font-bold'
          ])}>

            <span className="w-10">{c.Number}</span>
            <span className='flex-1'>{c.Name}</span>
            <button 
              className={cn([
                cardPendingDeletion && cardPendingDeletion === c.Number ? 'dark:text-black text-white' : 'text-black dark:text-white'
              ])}
              onMouseEnter={() => setCardPendingDeletion(c.Number)} 
              onMouseLeave={() => setCardPendingDeletion(false)} 
              onClick={() => removeCardFromCollection(c)}>
             <MinusCircle/>
            </button>
          </div>
        ))}
        </div>
        
      </div>

    </Layout>
  )

}
