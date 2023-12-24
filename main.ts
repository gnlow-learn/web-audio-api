const audioContext = new AudioContext()

const audioBuffer = await fetch("./sample.mp3")
    .then(res => res.arrayBuffer())
    .then(buffer => audioContext.decodeAudioData(buffer))

const play = () => {
    const source = audioContext.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audioContext.destination)
    source.start(audioContext.currentTime, 20, 1)
}

const $button = document.querySelector("button")!

$button.addEventListener("click", () => {
    play()
})