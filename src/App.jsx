/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"

const buttons = {
  Q: {
    id: "Air-Horn",
    sound: "./src/assets/sounds/Air-Horn.mp3",
    duration: 1535,
    activeColor: "#2091b3"
  },
  W: {
    id: "Snap-Flow",
    sound: "./src/assets/sounds/Snap-Flow.mp3",
    duration: 250,
    activeColor: "#2091b3"
  },
  E: {
    id: "Tin-Can-Bell",
    sound: "./src/assets/sounds/Tin-Can-Bell.mp3",
    duration: 284,
    activeColor: "#2091b3"
  },
  A: {
    id: "Cymbal-Sold",
    sound: "./src/assets/sounds/Cymbal-Sold.mp3",
    duration: 89,
    activeColor: "#2091b3"
  },
  S: {
    id: "Cymbal-AllMe",
    sound: "./src/assets/sounds/Cymbal-AllMe.mp3",
    duration: 236,
    activeColor: "#2091b3"
  },
  D: {
    id: "Clap-Apollo",
    sound: "./src/assets/sounds/Clap-Apollo.mp3",
    duration: 502,
    activeColor: "#2091b3"
  },
  Z: {
    id: "Kick-HouseThud",
    sound: "./src/assets/sounds/Kick-HouseThud.mp3",
    duration: 361,
    activeColor: "#2091b3"
  },
  X: {
    id: "Kick-Boost",
    sound: "./src/assets/sounds/Kick-Boost.mp3",
    duration: 301,
    activeColor: "#2091b3"
  },
  C: {
    id: "Snare-Champion",
    sound: "./src/assets/sounds/Snare-Champion.mp3",
    duration: 404,
    activeColor: "#2091b3"
  }
}

function PadButton(props) {

  const [state, setState] = useState({
    isClicked: false
  })

  function handleClick(event) {
    const sound = event.target.lastChild

    if (!props.power) return

    if (props.volume == 0) {
      props.updateDisplay("Machine's muted")
      return
    }

    setState({ isClicked: true })

    sound.pause()
    sound.volume = props.volume
    sound.currentTime = 0
    sound.play()

    props.updateDisplay(props.id.replace(/-/g, " "), props.duration)

    setTimeout(() => setState({ isClicked: false }), props.duration)
  }

  const background = {
    background: props.activeColor
  }

  return (
    <div
      id={props.id}
      className="drum-pad pad-button"
      onClick={handleClick}
      style={state.isClicked ? background : null}
    >
      {props.text}
      <audio id={props.text} src={props.sound} className="clip" preload="auto" />
    </div>
  )

}

function Pad(props) {

  function updateDisplay() {
    props.updateDisplay(...arguments)
  }

  const padButtons = []
  for (const key of Object.keys(buttons)) {
    const button = buttons[key]
    padButtons.push(
      <PadButton
        id={button.id}
        text={key}
        sound={button.sound}
        duration={button.duration}
        activeColor={button.activeColor}
        power={props.power}
        volume={props.volume}
        updateDisplay={updateDisplay}
        key={key} />
    )
  }

  return (
    <section className="pad-section">
      {padButtons.map(button => button)}
    </section>
  )

}

export default function App() {

  const [state, setState] = useState({
    power: true,
    volume: 1,
    displayMessage: "Ready!"
  })

  let displayDebouncer = null

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown)

    return function () {
      document.removeEventListener("keydown", handleKeydown)
    }
  }, [])

  function handleKeydown(event) {
    if (!state.power) return

    const validKeys = Object.keys(buttons)
    const pressedKey = event.key.toUpperCase()

    if (validKeys.includes(pressedKey)) {
      const id = buttons[pressedKey].id
      document.getElementById(id).click()
    }
  }

  function handleVolumeChange(event) { 
    setState(prevState => ({
      ...prevState,
      volume: event.target.value
    }))

    let volumePercentage = Math.floor(event.target.value * 100)
    updateDisplay(`Volume: ${volumePercentage}%`)
  }

  function handlePower(event) {
    setState(prevState => ({
      ...prevState,
      displayMessage: event.target.checked ? "Ready!" : "X_X Off"
    }))

    if (!event.target.checked) {
      for (let key in buttons) {
        const id = buttons[key].id
        const button = document.getElementById(id)
        button.style = null
        const sound = button.lastChild
        sound.pause()
      }
    }
  }

  function updateDisplay() {
    if (!state.power) return

    setState(prevState => ({
      ...prevState,
      displayMessage: arguments[0]
    }))

    const lacksSecondArg = typeof (arguments[1]) == "undefined"
    let duration = lacksSecondArg || arguments[1] < 1000 ? 1000 : arguments[1]
    clearTimeout(displayDebouncer)
    displayDebouncer = setTimeout(() => {
      setState(prevState => ({
        ...prevState,
        displayMessage: "Ready!"
      }))
    }, duration)
  }

  return (
    <main className="page-container">
      <section id="drum-machine" className="drum-container">
        <Pad power={state.power} volume={state.volume} updateDisplay={updateDisplay} />
        <section className="controls-section">
          <div className="power-control">
            <span className="power-tag">Power</span>
            <label className="switch">
              <input type="checkbox" id="power-switch" defaultChecked={true} onChange={handlePower} />
              <span className="slider round"></span>
            </label>
          </div>
          <div id="display" className="display">
            {state.displayMessage}
          </div>
          <div className="volume-control">
            <span className="volume-tag">Volume</span>
            <input
              id="volume-slider"
              max={1}
              min={0}
              step={0.01}
              type="range"
              defaultValue={state.volume}
              className="volume-slider"
              onChange={handleVolumeChange} />
          </div>
          <a href="https://github.com/jmcarvajalj/drum-machine" className="source-code" target="_blank" title="View Source" rel="noreferrer">
            <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="github" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="currentColor" d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"></path></svg>
          </a>
        </section>
      </section>
    </main>
  )
}