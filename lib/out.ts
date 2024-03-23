import { AIQ } from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/aiq@0.0.0/mod.ts'

const out = new AIQ<string>()

;(async () => { for await (const m of out) console.log(Date.now(), m) })()

export { out }