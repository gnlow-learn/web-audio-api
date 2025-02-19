import { html, ref } from "./deps.ts"

const render =
(canvas: HTMLCanvasElement, data: number[]) => {
    const canvasCtx = canvas.getContext("2d")!

    const [w, h] = [canvas.width, canvas.height]
    canvasCtx.clearRect(0, 0, w, h)

    data.forEach((v, i, { length: l }) => {
        canvasCtx.fillRect(w/l*i, h, w/l, -v*h)
    })
}

export const Pad =
(onChange: (data: number[]) => void = () => {}) => {
    const data = Array.from({ length: 16 }, (_, i) => 1 / (i+1)**1.5)
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

                data[Math.floor(x / (w / l))] = 1 - y / h
                render(canvas, data)
                onChange(data)
            }}
        ></canvas>
    `
}