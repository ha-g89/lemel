import { createContext, useContext } from 'react'

/* open programma's in de taakbalk, zie ProgrammaProvider */
export const ProgrammaContext = createContext(null)

export function useProgrammas() {
  return useContext(ProgrammaContext)
}
