import { cn } from "./utils"

export const Layout = ({ children }) => {

  return (
    <div className={cn(['w-screen h-screen max-w-screen max-h-screen', 'flex', 'overflow-hidden', 'bg-zinc-100 text-black dark:bg-zinc-900 dark:text-white'])}>
      {children}
    </div>
  )
}