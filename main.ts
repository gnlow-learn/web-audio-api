const ctx = new AudioContext()

const gain = ctx.createGain()
gain.gain.setValueAtTime(0.08, ctx.currentTime)

const analyser = ctx.createAnalyser()
analyser.fftSize = 2**14

gain.connect(analyser)
    .connect(ctx.destination)

const input = gain

const sine =
(f: number, db: number) => {
    const osc = ctx.createOscillator()
    osc.type = "sine"
    osc.frequency.setValueAtTime(f, ctx.currentTime)

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(db, ctx.currentTime)

    osc .connect(gain)
        .connect(input)

    return osc
}

import "https://esm.sh/adorable-css@1.6.2"
import { html, render } from "./src/deps.ts"
import { FreqVis } from "./src/FreqVis.ts"
import { WaveVis } from "./src/WaveVis.ts"

render(html`
    ${FreqVis(ctx, analyser)}
    ${WaveVis(ctx, analyser)}
    <button
        class="p(8) bg(#aad) r(8)"
        @click=${() => {
            Array.from({ length: 100 }, (_, i) => {
                sine(260 * (i+1), 1 / (i+1)**1.5).start()
            })
        }}
    >
        hi
    </button>
`, document.body)
