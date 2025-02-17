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

const $button = document.querySelector("button")!

$button.addEventListener("click", () => {
    const o1 = sine()
    o1.start()
})
