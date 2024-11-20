import { cn } from './utils'

export const Badge = ({ label, dotColor }) => {

  return (
    <span className={cn(
      ['inline-flex items-center rounded-md font-medium border py-1 px-2 text-xs w-fit'],
      label.trim().toUpperCase() === 'MEWTWO' && 'bg-indigo-700 border-indigo-900 text-white',
      label.trim().toUpperCase() === 'PIKACHU' && 'bg-yellow-400 border-yellow-900 text-black',
      label.trim().toUpperCase() === 'CHARIZARD' && 'bg-red-500 border-red-900 text-white',
      label.trim().toUpperCase() === 'PROMO_A' && 'dark:bg-zinc-900 dark:text-white',
    )}>
      {label}
    </span>
  )
}