const ctx = new AudioContext()
const gain = ctx.createGain()
gain.connect(ctx.destination)

const sine =
() => {
    const osc = ctx.createOscillator()
    osc.type = "sine"
    osc.frequency.setValueAtTime(440, ctx.currentTime)

    osc.connect(gain)

    return osc
}

import { html, render } from "https://esm.sh/lit-html@3.2.1"

render(html`
    <button
        @click=${() => {
            const o1 = sine()
            o1.start()
        }}
    >
        hi
    </button>
`, document.body)
