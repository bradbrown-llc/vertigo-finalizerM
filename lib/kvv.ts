import { Fallbacks } from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/kvcache@0.0.2-vertigo/mod.ts'
import { KvVertigo } from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/kvvertigo@0.0.2/mod.ts'
import { processId } from './processId.ts'

const kvPath = Deno.env.get('DENO_KV_PATH')
if (!kvPath) throw new Error('missing required env var \'DENO_KV_PATH\'')

const kv = await Deno.openKv(kvPath)

const key:Deno.KvKey = ['delay', 'kvv', processId]
const fallbacks:Fallbacks<number> = { value: 1000, expireIn: 30000 }

const kvv = new KvVertigo(kv, key, fallbacks)

;(async () => { for await (const m of kvv.out) m })()//console.log(Date.now(), m) })()
;(async () => { for await (const e of kvv.err) console.error(Date.now(), e) })()

export { kvv }