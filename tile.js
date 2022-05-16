export default class Tile {
    #tile
    #x
    #y
    #value
    constructor(container, value = Math.random() > 0.5 ? 2 : 4) {
      this.#tile = document.createElement("div")
      this.#tile.classList.add("tile")
      container.append(this.#tile)
      this.value = value
    }
    get value() {return this.#value}
    set value(v) {
      this.#value = v
      this.#tile.textContent = v
      const lightness = 100 - Math.log2(v) * 9
      this.#tile.style.setProperty("--lightness",`${lightness}%`)
    }
    set x(value) {
      this.#x = value
      this.#tile.style.setProperty("--x", value)
    }
    set y(value) {
      this.#y = value
      this.#tile.style.setProperty("--y", value)
    }
    remove() {this.#tile.remove()}
    transition(animation = false) {
      return new Promise(resolve => {
          this.#tile.addEventListener(animation ? "animationend" : "transitionend",resolve,{once: true,})
      })
    }
  }