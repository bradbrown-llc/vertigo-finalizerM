import { AIQ } from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/aiq@0.0.0/mod.ts'

const err = new AIQ<Error>()

;(async () => { for await (const e of err) console.error(Date.now(), e) })()

export { err }