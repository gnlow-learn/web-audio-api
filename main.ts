const ctx = new AudioContext()

const gain = ctx.createGain()
gain.gain.setValueAtTime(0.01, ctx.currentTime)

const analyser = ctx.createAnalyser()
analyser.fftSize = 2**12

gain.connect(analyser)
    .connect(ctx.destination)

const input = gain

const sine =
(f: number) => {
    const osc = ctx.createOscillator()
    osc.type = "sine"
    osc.frequency.setValueAtTime(f, ctx.currentTime)

    osc.connect(input)

    return osc
}

import "https://esm.sh/adorable-css@1.6.2"
import { html, render } from "./src/deps.ts"
import { FreqVis } from "./src/FreqVis.ts"

render(html`
    ${FreqVis(ctx, analyser)}
    <button
        class="p(8) bg(#aad) r(8)"
        @click=${() => {
            Array.from({ length: 10 }, (_, i) => {
                sine(260 * (i+1)).start()
            })
        }}
    >
        hi
    </button>
`, document.body)
