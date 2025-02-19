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

            const minHz = 200
            const maxHz = 4300
            const w0 = Math.log(maxHz / minHz)

            const hzPerItem = ctx.sampleRate / 2 / analyser.frequencyBinCount

            const arr = new Uint8Array(analyser.frequencyBinCount)
            while (true) {
                await tick()
                analyser.getByteFrequencyData(arr)

                canvasCtx.clearRect(0, 0, w, h)
                arr.forEach((y, x) => {
                    const f = x * hzPerItem
                    canvasCtx.fillStyle = `oklch(
                        0.7
                        0.15
                        ${Math.log2(f / 130) % 1 * 360}
                        / ${y / 255 * 0.7}
                    )`
                    canvasCtx.fillRect(
                        Math.log(f/minHz) * w / w0,
                        h,
                        0.02 * w / w0 * y / 255,
                        -y * (h - 10) / 255,
                    )
                })
            }
        })}
    ></canvas>
`