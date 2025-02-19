import { html, ref } from "./deps.ts"

const A = 100
const gamma =
(x: number) =>
    Math.log(A*x+1)/Math.log(A+1)

const unGamma =
(y: number) =>
    (Math.E**(y*Math.log(A+1))-1)/A

const render =
(canvas: HTMLCanvasElement, data: number[]) => {
    const canvasCtx = canvas.getContext("2d")!

    const [w, h] = [canvas.width, canvas.height]
    canvasCtx.clearRect(0, 0, w, h)

    data.forEach((v, i, { length: l }) => {
        canvasCtx.fillStyle = `oklch(
            0.8
            0.15
            ${Math.log2(i+1) % 1 * 360}
        )`
        canvasCtx.fillRect(w/l*(i+0.1), h, w/l*0.8, -gamma(v)*h)
    })
}

export const Pad =
(onChange: (data: number[]) => void = () => {}) => {
    const data = Array.from({ length: 16 }, (_, i) => 1 / (i+1)**1)
    let isMouseDown = false
    return html`
        <canvas
            class="w(100%) b(2/#aad) r(8)"
            width="2000"
            height="500"
            ${ref(el => {
                const canvas = el as HTMLCanvasElement
                
                render(canvas, data)
            })}
            @mousedown=${() => {
                isMouseDown = true
            }}
            @mouseup=${() => {
                isMouseDown = false
            }}
            @mouseleave=${() => {
                isMouseDown = false
            }}
            @mousemove=${(e: MouseEvent) => {
                if (!isMouseDown) return

                const canvas = e.target as HTMLCanvasElement

                const [w, h] = [canvas.width, canvas.height]

                const [x, y] = [
                    e.offsetX * w / canvas.clientWidth,
                    e.offsetY * h / canvas.clientHeight,
                ]

                const l = data.length

                data[Math.floor(x / (w / l))] = unGamma(1 - y / h)
                render(canvas, data)
                onChange(data)
            }}
        ></canvas>
    `
}