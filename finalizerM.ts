import { kvv } from './lib/kvv.ts'
import { ejra } from './lib/ejra.ts'
import { Mint } from 'https://cdn.jsdelivr.net/gh/bradbrown-llc/vertigo@0.0.16/lib/Mint.ts'
import { processId } from './lib/processId.ts'
import { err } from './lib/err.ts'
import { out } from './lib/out.ts'

async function handleMint(mint:Mint) {
    const active = await mint.active()
    const state = await mint.state()
    if (state === 'finalizable' && active === true) {
        const finalized = await mint.finalize()
        if (finalized === false) await mint.move('sendable')
        if (finalized === true) await mint.move('finalized')
    }
    if (state === 'finalizable' && active === false) await mint.move('archive')
    await mint.unclaim(processId)
}

while (true) {

    const processing = await Mint.nextProcessing(processId, kvv, ejra, { err, out })
    if (processing instanceof Mint) { await handleMint(processing); continue }

    const mint = await Mint.next('finalizable', kvv, ejra, { err, out })
    if (mint instanceof Error || mint === null) continue
    const claimed = await mint.claim(processId)
    console.log({ claimed })
    if (claimed instanceof Error || claimed === false) continue
    await handleMint(mint)
    
}