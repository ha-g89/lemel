import fs from 'node:fs'
import process from 'node:process'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/* korte commitcode van wat er gebouwd wordt, voor de versie in de voettekst.
   rechtstreeks uit .git gelezen (de azure-build heeft geen git-programma),
   met GITHUB_SHA als reserve en anders "dev" */
function commitCode() {
  try {
    const head = fs.readFileSync('.git/HEAD', 'utf8').trim()
    if (!head.startsWith('ref: ')) return head.slice(0, 7)
    const ref = head.slice(5)
    if (fs.existsSync('.git/' + ref)) return fs.readFileSync('.git/' + ref, 'utf8').trim().slice(0, 7)
    const regel = fs
      .readFileSync('.git/packed-refs', 'utf8')
      .split('\n')
      .find((r) => r.endsWith(' ' + ref))
    if (regel) return regel.slice(0, 7)
  } catch {
    /* geen .git: val terug op de omgeving */
  }
  return process.env.GITHUB_SHA ? process.env.GITHUB_SHA.slice(0, 7) : 'dev'
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_VERSIE': JSON.stringify(commitCode()),
    'import.meta.env.VITE_BUILDDATUM': JSON.stringify(new Date().toISOString()),
  },
})
