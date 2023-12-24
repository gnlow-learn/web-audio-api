const audioContext = new AudioContext()

const $audio = document.createElement("audio")
$audio.setAttribute("src", "./sample.mp3")

document.body.appendChild($audio)

const audioSourceNode = audioContext.createMediaElementSource($audio)

audioSourceNode
    .connect(audioContext.destination)

const $button = document.querySelector("button")!

$button.addEventListener("click", () => {
    $audio.play()
})
