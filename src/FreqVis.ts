import { html, ref } from "./deps.ts"
import { tick } from "./util.ts"

export const FreqVis =
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

            const maxHz = 2000
            const hzPerItem = ctx.sampleRate / 2 / analyser.frequencyBinCount

            const arr = new Uint8Array(analyser.frequencyBinCount)
            while (true) {
                await tick()
                analyser.getByteFrequencyData(arr)

                canvasCtx.clearRect(0, 0, w, h)
                arr.forEach((y, x) => {
                    const f = x * hzPerItem
                    canvasCtx.fillStyle = `oklch(
                        ${1 - y / 255 * 0.3}
                        0.1
                        ${Math.log2(f / 130) % 1 * 360}
                    )`
                    canvasCtx.fillRect(
                        Math.log(x) * w / Math.log(maxHz),
                        h,
                        Math.log((x+1)/x) * w / Math.log(maxHz) * 0.8,
                        -y * (h - 10) / 255,
                    )
                })
            }
        })}
    ></canvas>
`