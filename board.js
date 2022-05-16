const size = 4
const cell_size = 20
const gap = 2

export default class Grid {
  #cells
  constructor(board) {
    board.style.setProperty("--size", size)
    board.style.setProperty("--cell-size", `${cell_size}vmin`)
    board.style.setProperty("--gap", `${gap}vmin`)
    this.#cells = createcells(board).map((cell, index) => {
      return new Cell(cell,index % size,Math.floor(index / size))
    })
  }
  get cells() {return this.#cells}
  get row_cells() {
    return this.#cells.reduce((grid, cell) => {
      grid[cell.y] = grid[cell.y] || []
      grid[cell.y][cell.x] = cell
      return grid
    }, [])
  }

  get column_cells() {
    return this.#cells.reduce((grid, cell) => {
      grid[cell.x] = grid[cell.x] || []
      grid[cell.x][cell.y] = cell
      return grid
    }, [])
  }

  get #empty_cells() {return this.#cells.filter(cell => cell.tile == null)}

  random_cell() {return this.#empty_cells[Math.floor(Math.random() * this.#empty_cells.length)]}
}

class Cell {
  #cell
  #x
  #y
  #tile
  #merge
  constructor(cell, x, y) {
    this.#cell = cell
    this.#x = x
    this.#y = y
  }
  get x() {return this.#x}
  get y() {return this.#y}
  get tile() {return this.#tile}
  get merge() {return this.#merge}
  set tile(value) {
    this.#tile = value
    if (value == null) return
    this.#tile.x = this.#x
    this.#tile.y = this.#y
  }
  set merge(value) {
    this.#merge = value
    if (value == null) return
    this.#merge.x = this.#x
    this.#merge.y = this.#y
  }
  accept_motion(tile) {return (this.tile == null ||(this.merge == null && this.tile.value === tile.value))}

  merge_tiles() {
    if (this.tile == null || this.merge == null) return
    this.tile.value = this.tile.value + this.merge.value
    this.merge.remove()
    this.merge = null
  }
}

function createcells(board) {
  const cells = []
  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div")
    cell.classList.add("cell")
    cells.push(cell)
    board.append(cell)
  }
  return cells
}