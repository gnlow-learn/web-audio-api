import { html, ref } from "./deps.ts"
import { tick } from "./util.ts"

const getF0 =
(
    ctx: AudioContext,
    analyser: AnalyserNode,
) => {
    const hzPerItem = ctx.sampleRate / 2 / analyser.frequencyBinCount

    const arr = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(arr)

    const [x] = arr.reduce(
        ([px, py], y, x) =>
            y > py
                ? [x, y]
                : [px, py],
        [0, -1],
    )

    return x * hzPerItem
}

export const WaveVis =
(
    ctx: AudioContext,
    analyser: AnalyserNode,
) => html`
    <canvas
        class="w(100%) b(2/#aad) r(8)"
        width="2000"
        height="500"
        ${ref(async el => {
            const windowSec = 0.1
            
            const canvas = el as HTMLCanvasElement
            const [w, h] = [canvas.width, canvas.height]
            const canvasCtx = canvas.getContext("2d")!

            const arr = new Uint8Array(analyser.fftSize)

            canvasCtx.strokeStyle = `#aad`
            canvasCtx.lineWidth = 5
            canvasCtx.lineJoin = "round"

            while (true) {
                await tick()

                const f0 = getF0(ctx, analyser)
                const secPerItem = 1 / ctx.sampleRate
                analyser.getByteTimeDomainData(arr)

                canvasCtx.clearRect(0, 0, w, h)
                canvasCtx.moveTo(0, h / 2)
                canvasCtx.beginPath()
                arr.forEach((y, i) => {
                    canvasCtx.lineTo(
                        (i * secPerItem - ctx.currentTime % (1 / f0)) / windowSec * w,
                        y / 255 * h * 2 - h/2,
                    )
                })
                canvasCtx.stroke()
            }
        })}
    ></canvas>
`