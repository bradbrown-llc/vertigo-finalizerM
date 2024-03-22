import { AIQ } from 'https://deno.land/x/aiq@0.0.0/mod.ts'

const err = new AIQ<Error>()

;(async () => { for await (const e of err) console.error(Date.now(), e) })()

export { err }