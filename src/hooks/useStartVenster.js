import { createContext, useContext } from 'react'

/* opent een venster uit het start-menu (zie TEKSTVENSTERS in Pagina),
   ook vanaf een icoon op het bureaublad */
export const StartVensterContext = createContext(() => {})

export function useStartVenster() {
  return useContext(StartVensterContext)
}
