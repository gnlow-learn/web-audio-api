import { html, ref } from "./deps.ts"
import { tick } from "./util.ts"

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
            const canvas = el as HTMLCanvasElement
            const [w, h] = [canvas.width, canvas.height]
            const canvasCtx = canvas.getContext("2d")!

            const arr = new Uint8Array(analyser.fftSize)

            canvasCtx.strokeStyle = `#aad`
            canvasCtx.lineWidth = 5

            while (true) {
                await tick()
                analyser.getByteTimeDomainData(arr)

                canvasCtx.clearRect(0, 0, w, h)
                canvasCtx.moveTo(0, h / 2)
                canvasCtx.beginPath()
                arr.forEach((y, i) => {
                    canvasCtx.lineTo(i, y / 255 * h)
                })
                canvasCtx.stroke()
            }
        })}
    ></canvas>
`