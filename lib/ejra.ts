import { Fallbacks, KvCache } from '../../../llc/kvcache/mod.ts'
import { Ejra } from '../../../llc/ejra/lib/Ejra.ts'
import { Toad } from '../../../llc/toad/mod.ts'
import { kvv } from './kvv.ts'
import { processId } from './processId.ts'

const key:Deno.KvKey = ['delay', 'ejra', processId] 

const fallbacks:Fallbacks<number> = { value: 1000, expireIn: 30000 }

const delaykvCache:KvCache<number> = new KvCache(kvv, key, fallbacks)

const toad = new Toad(delaykvCache)

const ejra = new Ejra(kvv, toad)

const chain50000UrlKvCache = new KvCache(
    kvv,
    ['url', 50000n, processId],
    {
        value: 'http://localhost:50003',
        expireIn: 30000
    }
)

const chain50001UrlKvCache = new KvCache(
    kvv,
    ['url', 50001n, processId],
    {
        value: 'http://localhost:50007',
        expireIn: 30000
    }
)

ejra.urls.set(50000n, chain50000UrlKvCache)
ejra.urls.set(50001n, chain50001UrlKvCache)

;(async () => { for await (const m of delaykvCache.out) m })()//console.log(Date.now(), m) })() console.log(Date.now(), m) })()
;(async () => { for await (const e of delaykvCache.err) console.error(Date.now(), e) })()
;(async () => { for await (const m of chain50000UrlKvCache.out) m })()// console.log(Date.now(), m) })()
;(async () => { for await (const e of chain50000UrlKvCache.err) console.error(Date.now(), e) })()
;(async () => { for await (const m of ejra.out) m })()// console.log(Date.now(), m) })()
;(async () => { for await (const e of ejra.err) console.error(Date.now(), e) })()

export { ejra }