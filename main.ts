const ctx = new AudioContext()

const gain = ctx.createGain()
gain.gain.setValueAtTime(0.1, ctx.currentTime)

const analyser = ctx.createAnalyser()

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

import { html, render } from "https://esm.sh/lit-html@3.2.1"
import { ref } from "https://esm.sh/lit@3.2.1/directives/ref"

const tick = () => new Promise(requestAnimationFrame)
const sleep = (ms: number) => new Promise(o => setTimeout(o, ms))

render(html`
    <style>
        canvas {
            border: 1px solid #222;
            width: 100%;
        }
    </style>
    <canvas
        width="2000"
        height="500"
        ${ref(async el => {
            const canvas = el as HTMLCanvasElement
            const [w, h] = [canvas.width, canvas.height]
            const canvasCtx = canvas.getContext("2d")!

            const maxHz = 4000
            const hzPerItem = ctx.sampleRate / 2 / analyser.frequencyBinCount

            const arr = new Uint8Array(maxHz / hzPerItem)
            while (true) {
                await tick()
                analyser.getByteFrequencyData(arr)
                
                canvasCtx.clearRect(0, 0, w, h)
                arr.forEach((y, x) => {
                    const f = x * hzPerItem
                    canvasCtx.fillStyle = `oklch(
                        ${1 - y / 255 * 0.3}
                        0.1
                        ${Math.log2(f / 261) % 1 * 360}
                    )`
                    canvasCtx.fillRect(
                        x * w / arr.length,
                        h,
                        w / arr.length * 0.8,
                        -y * (h - 10) / 255,
                    )
                })
            }
        })}
    ></canvas>
    <button
        @click=${() => {
            sine(261).start()
            sine(261*2).start()
            sine(261*3).start()
            sine(261*4).start()
            sine(261*5).start()
            sine(261*6).start()
            sine(261*7).start()
            sine(261*8).start()
        }}
    >
        hi
    </button>
`, document.body)
